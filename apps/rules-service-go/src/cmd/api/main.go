package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
	"okscoring.com/rules-service/src/config"
	"okscoring.com/rules-service/src/events"
	"okscoring.com/rules-service/src/models"
)

const version = "1.0.0"

// TODO create some struct or map to hold all of the event streams the app needs. For now just have one
type application struct {
	config                     *config.Config
	logger                     *log.Logger
	models                     models.Models
	favoriteRuleTemplateEvents events.Events
}

func main() {
	config, err := config.LoadConfig("../../../")

	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	db, err := openDb(config)

	if err != nil {
		logger.Fatal(err)
	} else {
		logger.Println("Connected to DB")
	}

	events := events.NewEvents("favoriterulestemplates", config)
	err = events.Connect()

	if err != nil {
		logger.Fatal(err)
	} else {
		logger.Println("Connected to Events")
	}

	defer db.Close()
	defer events.Close()

	app := &application{
		config:                     config,
		logger:                     logger,
		models:                     models.NewModels(db),
		favoriteRuleTemplateEvents: events,
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", config.ServerPort),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	logger.Printf("Running ok scoring rules on port %d", config.ServerPort)
	err = srv.ListenAndServe()
	if err != nil {
		log.Println(err)
	}
}

func openDb(cfg *config.Config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.DBString)

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
