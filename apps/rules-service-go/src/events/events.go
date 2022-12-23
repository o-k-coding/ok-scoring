package events

import (
	"log"

	"okscoring.com/rules-service/src/config"
)

type Event struct {
	ID      string
	Message string
}

type Events interface {
	Connect() error
	Close() error
	Send(key string, message string) error
	Consume() (*Event, error)
	ConfirmMessageProcessed() error
}

func NewEvents(stream string, config *config.Config) Events {
	switch config.EventType {
	case "segmentio_kafka":
		return NewSKafkaEvents(stream, config.EventHosts)
	case "confluent_kafka":
		return NewCKafkaEvents(stream, config.EventHosts)
	default:
		log.Printf("EventType %s not supported", config.EventType)
		return nil
	}
}
