package search

import (
	"log"

	"okscoring.com/rules-service/src/config"
)

type Search interface {
	Connect() error
	Close() error
	Add(doc string) error
}

func NewSearch(index string, config *config.Config) Search {
	switch config.SearchType {
	case "opensearch":
		return NewOpenSearch(config.SearchHosts, index)
	default:
		log.Printf("SearchType %s not supported", config.EventType)
		return nil
	}
}
