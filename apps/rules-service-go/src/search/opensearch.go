package search

import (
	"context"
	"crypto/tls"
	"net/http"
	"strings"

	"github.com/opensearch-project/opensearch-go"
	"github.com/opensearch-project/opensearch-go/opensearchapi"
)

type OpenSearch struct {
	client        *opensearch.Client
	nodeAddresses []string
	index         string
}

func NewOpenSearch(nodeAddresses []string, index string) *OpenSearch {
	return &OpenSearch{
		nodeAddresses: nodeAddresses,
		index:         index,
	}
}

func (o *OpenSearch) Connect() error {
	client, err := opensearch.NewClient(opensearch.Config{
		// TODO
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
		Addresses: o.nodeAddresses,
		// TODO
		Username: "admin", // For testing only. Don't store credentials in code.
		Password: "admin",
	})

	if err != nil {
		return err
	}

	o.client = client

	return nil
}

func (o *OpenSearch) Close() error {
	return nil
}

func (o *OpenSearch) Add(key string, doc string) error {
	req := opensearchapi.IndexRequest{
		Index:      o.index,
		DocumentID: key, // TODO will this replace an existing one?
		Body:       strings.NewReader(doc),
	}
	_, err := req.Do(context.Background(), o.client)
	return err
}
