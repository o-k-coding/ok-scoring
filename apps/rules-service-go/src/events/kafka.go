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
		Partition: 0, // TODO partitions...
	})
	return nil
}

func (k *KafkaEvents) Close() error {
	// TODO this could fail if the pointers are nil
	if err := k.producer.Close(); err != nil {
		log.Fatal("failed to close kafka producer:", err)
		return err
	}

	if err := k.consumer.Close(); err != nil {
		log.Fatal("failed to close kafka consumer:", err)
		return err
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
	m, err := k.consumer.FetchMessage(context.Background())
	if err != nil {
		return "", err
	}
	k.pendingMessages = append(k.pendingMessages, m)
	return string(m.Value), nil
}

func (k *KafkaEvents) ConfirmMessageProcessed() error {
	if err := k.consumer.CommitMessages(context.Background(), k.pendingMessages...); err != nil {
		return err
	}
	k.pendingMessages = []kafka.Message{}
	return nil
}
