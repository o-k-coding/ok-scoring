package observability

import (
	"context"
	"log"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"
	api_trace "go.opentelemetry.io/otel/trace"
	"okscoring.com/rules-service/src/config"
)

type Trace struct {
	Exporter TraceSpanExporter
	Resource *resource.Resource
}

type TraceSpanExporter interface {
	GetSpanExporter() trace.SpanExporter
	Close()
}

// name is the Tracer name used to identify this instrumentation library.
const tracerName = "ok-rules-service"

// TODO receiver function?
func GetNewSpan(ctx context.Context, spanName string, opts ...api_trace.SpanStartOption) (context.Context, api_trace.Span) {
	return otel.Tracer(tracerName).Start(ctx, spanName)
}

func NewTrace(config *config.Config) Trace {
	trace := Trace{}
	// TODO error handling
	switch config.TraceType {
	case "jaeger":
		trace.Exporter, _ = NewJaegerExporter(config)
	case "console":
		trace.Exporter, _ = NewConsoleExporter(config)
	default:
		log.Printf("TraceType %s not supported", config.TraceType)
	}
	trace.Resource = NewResource()
	return trace
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
