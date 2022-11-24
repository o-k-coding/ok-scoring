package events

type Events interface {
	Connect() error
	Close() error
	Send(key string, message string) error
	Consume() error
}
