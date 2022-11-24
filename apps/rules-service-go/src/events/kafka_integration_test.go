package events_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"okscoring.com/rules-service/src/events"
)

func TestSendAndReceiveMessage(t *testing.T) {
	topic := "testTopic"
	brokerAddresses := []string{"localhost:9093"}
	kafkaEvents := events.NewKafkaEvents(topic, brokerAddresses)

	err := kafkaEvents.Connect()
	assert.NoError(t, err)

	err = kafkaEvents.Send("key", "hello")
	assert.NoError(t, err)

	message, err := kafkaEvents.Consume()
	assert.NoError(t, err)
	assert.Equal(t, "hello", message)
}
