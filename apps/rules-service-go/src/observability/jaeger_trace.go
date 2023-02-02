package observability

import (
	"context"

	"go.opentelemetry.io/otel/exporters/jaeger"
	"go.opentelemetry.io/otel/sdk/trace"
	"okscoring.com/rules-service/src/config"
)

type JaegerSpanExporter struct {
	spanExporter trace.SpanExporter
}

func NewJaegerExporter(config *config.Config) (*JaegerSpanExporter, error) {
	s, err := jaeger.New(
		jaeger.WithAgentEndpoint(
			jaeger.WithAgentHost(config.JaegerAgentHost),
			jaeger.WithAgentPort(config.JaegerAgentPort),
		),
	)

	if err != nil {
		return nil, err
	}
	e := JaegerSpanExporter{
		spanExporter: s,
	}
	return &e, nil
}

func (j *JaegerSpanExporter) Close() {
	// TODO error?
	_ = j.spanExporter.Shutdown(context.Background())
}

func (c *JaegerSpanExporter) GetSpanExporter() trace.SpanExporter {
	return c.spanExporter
}
