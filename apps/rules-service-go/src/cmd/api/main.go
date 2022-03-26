package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"okscoring.com/rules-service/src/models"
)

const version = "1.0.0"

type config struct {
	port int
	env  string
	db   struct {
		dsn string
	}
	jwt struct {
		secret string
	}
}

type AppStatus struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

type application struct {
	config config
	logger *log.Logger
	models models.Models
}

func getEnvVariable(key string, env string) string {

	// load .env file
	err := godotenv.Load(fmt.Sprintf("../../../.env.%s", env))

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	return os.Getenv(key)
}

func main() {
	var cfg config

	// Read an integer value as a command line argument for the port the app will listen on
	// the default will be 4000 and the value will be saved to the cfg.port
	flag.IntVar(&cfg.port, "port", 4000, "Server port to listen on")
	// TODO should use this to get the correct env file
	// Also should just build the url in the code and not use a cli flag
	flag.StringVar(&cfg.env, "env", "development", "Application environment (development|production)")
	flag.Parse()

	cfg.db.dsn = getEnvVariable("DB_STRING", cfg.env)
	cfg.jwt.secret = getEnvVariable("JWT_SECRET", cfg.env)
	// Create application context
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	db, err := openDb(cfg)

	if err != nil {
		logger.Fatal(err)
	} else {
		logger.Println("Connected to DB")
	}

	defer db.Close()

	app := &application{
		config: cfg,
		logger: logger,
		models: models.NewModels(db),
	}

	// This is a way to handle a web request with no 3rd part packages
	// http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
	// 	currentStatus := AppStatus {
	// 		Status: "Available",
	// 		Environment: cfg.env,
	// 		Version: version,
	// 	}

	// 	responseBody, err := json.MarshalIndent(currentStatus, "", "  ")
	// 	if err != nil {
	// 		log.Println(err)
	// 	}

	// 	w.Header().Set("Content-Type", "application/json")
	// 	w.WriteHeader(http.StatusOK)
	// 	w.Write(responseBody)
	// })
	// err := http.ListenAndServe(fmt.Sprintf(":%d", cfg.port), nil)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	logger.Printf("Running ok scoring rules %s environment on port %d", cfg.env, cfg.port)
	err = srv.ListenAndServe()
	if err != nil {
		log.Println(err)
	}
}

func openDb(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.db.dsn)

	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	defer cancel()

	err = db.PingContext(ctx)

	if err != nil {
		return nil, err
	}
	return db, nil
}
