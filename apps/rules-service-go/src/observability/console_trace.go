package observability

import (
	"context"
	"os"

	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/sdk/trace"
	"okscoring.com/rules-service/src/config"
)

type ConsoleSpanExporter struct {
	spanExporter    trace.SpanExporter
	traceFileWriter *os.File
}

func NewConsoleExporter(config *config.Config) (*ConsoleSpanExporter, error) {
	f, err := os.Create(config.ConsoleTraceFilePath)
	if err != nil {
		return nil, err
	}
	s, err := stdouttrace.New(
		stdouttrace.WithWriter(f),
		// Use human-readable output.
		stdouttrace.WithPrettyPrint(),
		// Do not print timestamps for the demo.
		stdouttrace.WithoutTimestamps(),
	)
	if err != nil {
		return nil, err
	}
	e := ConsoleSpanExporter{
		traceFileWriter: f,
		spanExporter:    s,
	}
	return &e, nil
}

func (c *ConsoleSpanExporter) Close() {
	_ = c.spanExporter.Shutdown(context.Background())
	c.traceFileWriter.Close()
}

func (c *ConsoleSpanExporter) GetSpanExporter() trace.SpanExporter {
	return c.spanExporter
}
