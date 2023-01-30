package observability

import (
	"context"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/jaeger"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.12.0"
	api_trace "go.opentelemetry.io/otel/trace"
	"okscoring.com/rules-service/src/config"
)

// name is the Tracer name used to identify this instrumentation library.
const tracerName = "ok-rules-service"

func GetNewSpan(ctx context.Context, spanName string, opts ...api_trace.SpanStartOption) (context.Context, api_trace.Span) {
	return otel.Tracer(tracerName).Start(ctx, spanName)
}

func NewExporter(config *config.Config) (trace.SpanExporter, error) {
	return jaeger.New(
		jaeger.WithAgentEndpoint(
			jaeger.WithAgentHost(config.JaegerAgentHost),
			jaeger.WithAgentPort(config.JaegerAgentPort),
		),
	)
}

// newResource returns a resource describing this application.
func NewResource() *resource.Resource {
	r, _ := resource.Merge(
		resource.Default(),
		// TODO the string values should come from config
		resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceNameKey.String("ok-rules-service"),
			semconv.ServiceVersionKey.String("v1.0.0"),
			attribute.String("environment", "dev"),
		),
	)
	return r
}
