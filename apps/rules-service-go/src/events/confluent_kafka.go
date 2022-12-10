package events

import (
	"fmt"
	"log"
	"os"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type CKafkaEvents struct {
	producer        *kafka.Producer
	consumer        *kafka.Consumer
	topic           string
	brokerAddresses []string
	pendingMessages []kafka.TopicPartition
}

func NewCKafkaEvents(topic string, brokerAddresses []string) *SKafkaEvents {
	return &SKafkaEvents{
		topic: topic,
		// TODO this should be an env variable
		brokerAddresses: brokerAddresses,
	}
}

func (k *CKafkaEvents) Connect() error {

	// Config options
	// https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md
	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": k.brokerAddresses,
		"client.id":         "ok-scoring",
		// "enable.idempotence=true automatically sets
		// max.in.flight.requests.per.connection=5
		// retries=INT32_MAX
		// acks=all
		// queuing.strategy=fifo
		"enable.idempotence": true,
		"compression.type":   "none", // Messages are just string values right now, but use if json is sent
		// If we hit the max in flight requests (5) then kafka will start to batch to maintain throughput and low latency
		// Side note batches have a higher compression ratio
		// linger.ms is how long to wait until sending a batch
		// batch.size, max number of bytes in the batch. if a batch is filled before ^, increase the batch size. messages larger than the batch size will be sent right away
		// batch is allocated per partition, so be careful to not use up too much memory
	})

	if err != nil {
		fmt.Printf("failed to create confluent producer: %s\n", err)
		panic(err.Error())
	}

	k.producer = producer

	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers":  k.brokerAddresses,
		"group.id":           "ok-scoring-rules-service",
		"auto.offset.reset":  "latest", // To avoid replaying messages when connecting
		"enable.auto.commit": false,
	})

	if err != nil {
		fmt.Printf("failed to create confluent consumer: %s\n", err)
		panic(err.Error())
	}
	k.consumer = consumer
	return nil
}

func (k *CKafkaEvents) Close() error {
	if k.producer != nil {
		log.Println("Closing confluent kafka events producer")
		k.producer.Close()
	}

	if k.consumer != nil {
		log.Println("Closing confluent kafka events consumer")
		if err := k.consumer.Close(); err != nil {
			log.Fatal("failed to close confluent kafka consumer:", err)
		}
	}
	return nil
}

// TODO could build buffering into this
func (k *CKafkaEvents) Send(key string, message string) error {
	// Can provide a channel to listen to result https://docs.confluent.io/kafka-clients/go/current/overview.html#asynchronous-writes
	err := k.producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &k.topic, Partition: kafka.PartitionAny},
		Value:          []byte(message)},
		nil,
	)
	return err
}

// This set up implements an exactly once processing scheme.
func (k *CKafkaEvents) Consume() (string, error) {
	message := k.consumer.Poll(100)
	log.Printf("consuming message %s", message.String())
	switch m := message.(type) {
	case *kafka.Message:
		// Store the message to be commited by the app later in batches AFTER they have been succesfully processed
		// Question, can we duplicate messages in this case?
		// If the process fails before the batch is committed, then yes this could happen.
		// On close could we commit whatever we have so far? that could be bad too, we could commit an "unprocessed" record as well
		// TODO think about this more before actually using batches. Currently we just process and commit one at a time
		k.pendingMessages = append(k.pendingMessages, m.TopicPartition)
		return string(m.Value), nil
	case kafka.Error:
		fmt.Fprintf(os.Stderr, "%% Error: %v\n", m)
		return "", m
	default:
		fmt.Printf("Ignored %v\n", m)
		return "", nil
	}
}

// When commiting the offset, this allows us to make sure the data is saved first, so if the process crashes, on restart the un coommited messages will be re consumed (TODO I believe, this should be tested)
func (k *CKafkaEvents) ConfirmMessageProcessed() error {
	_, err := k.consumer.CommitOffsets(k.pendingMessages)
	if err != nil {
		return err
	}
	k.pendingMessages = []kafka.TopicPartition{}
	return nil
}
