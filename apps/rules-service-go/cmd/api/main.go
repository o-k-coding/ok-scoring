package main

import (
	"flag"
	"fmt"
)

const version = "1.0.0"

type config struct {
	port int
	env string
}

func main() {
	var cfg config

	// Read an integer value as a command line argument for the port the app will listen on
	// the default will be 4000 and the value will be saved to the cfg.port
	flag.IntVar(&cfg.port, "port", 4000, "Server port to listen on")
	flag.StringVar(&cfg.env, "env", "development", "Application environment (development|production)")

	flag.Parse()

	fmt.Printf("Running ok scoring rules %s environment on port %d", cfg.env, cfg.port)

}
