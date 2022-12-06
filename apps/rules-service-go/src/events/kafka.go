package events

import (
	"context"
	"log"

	"github.com/segmentio/kafka-go"
)

type KafkaEvents struct {
	producer        *kafka.Writer
	consumer        *kafka.Reader
	topic           string
	brokerAddresses []string
	pendingMessages []kafka.Message
}

func NewKafkaEvents(topic string, brokerAddresses []string) *KafkaEvents {
	return &KafkaEvents{
		topic: topic,
		// TODO this should be an env variable
		brokerAddresses: brokerAddresses,
	}
}

func (k *KafkaEvents) Connect() error {
	// Create topic if it does not exist
	_, err := kafka.DialLeader(context.Background(), "tcp", k.brokerAddresses[0], k.topic, 0)
	if err != nil {
		panic(err.Error())
	}
	k.producer = kafka.NewWriter(kafka.WriterConfig{
		Brokers:  k.brokerAddresses,
		Topic:    k.topic,
		Balancer: &kafka.LeastBytes{}, // TODO not sure what this is
	})

	k.consumer = kafka.NewReader(kafka.ReaderConfig{
		Brokers:   k.brokerAddresses,
		Topic:     k.topic,
		GroupID:   "ok-scoring-rules-service",
		Partition: 0, // TODO partitions... do I need to create 1 reader for each partition?
	})
	return nil
}

func (k *KafkaEvents) Close() error {
	if k.producer != nil {
		log.Println("Closing kafka events producer")
		if err := k.producer.Close(); err != nil {
			log.Fatal("failed to close kafka producer:", err)
		}
	}

	if k.consumer != nil {
		log.Println("Closing kafka events consumer")
		if err := k.consumer.Close(); err != nil {
			log.Fatal("failed to close kafka consumer:", err)
		}
	}
	return nil
}

// TODO could build buffering into this
func (k *KafkaEvents) Send(key string, message string) error {
	err := k.producer.WriteMessages(context.Background(),
		kafka.Message{
			Key:   []byte(key),
			Value: []byte(message),
		},
	)
	if err != nil {
		log.Fatal("failed to write messages:", err)
	}
	return nil
}

// This set up implements an exactly once processing scheme.
func (k *KafkaEvents) Consume() (string, error) {
	// This will block until a message is available. Make sure this is run on a dedicated go routine :)
	m, err := k.consumer.FetchMessage(context.Background())
	if err != nil {
		return "", err
	}
	log.Printf("consuming message %s", m.Value)
	k.pendingMessages = append(k.pendingMessages, m)
	return string(m.Value), nil
}

// When commiting the offset, this allows us to make sure the data is saved first, so if the process crashes, on restart the un coommited messages will be re consumed (TODO I believe, this should be tested)
func (k *KafkaEvents) ConfirmMessageProcessed() error {
	if err := k.consumer.CommitMessages(context.Background(), k.pendingMessages...); err != nil {
		return err
	}
	k.pendingMessages = []kafka.Message{}
	return nil
}
