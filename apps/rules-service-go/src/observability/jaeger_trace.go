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
	exp, err := jaeger.New(
		jaeger.WithAgentEndpoint(
			jaeger.WithAgentHost(config.TraceAgentHost),
			jaeger.WithAgentPort(config.TraceAgentPort),
		),
	)

	// exp, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(
	// 	"http://localhost:6831/api/traces",
	// )))

	if err != nil {
		return nil, err
	}
	e := JaegerSpanExporter{
		spanExporter: exp,
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
