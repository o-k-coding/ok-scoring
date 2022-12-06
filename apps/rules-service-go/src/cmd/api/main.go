package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
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

// based on recommendation from <https://github.com/segmentio/kafka-go#reader->
// HOWEVER, idk if this is needed because of the `defer` statements on the close below
func createShutdownSignalHandler(closeFns []func() error) {
	// Create one channel of signals to receive and handle these.
	sigs := make(chan os.Signal, 1)

	// Notify the sigs channel on a SIGINT or SIGTERM
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)

	done := make(chan bool, 1)

	// Wait for a signal in the background on a separate go routine
	go func() {
		sig := <-sigs
		if len(closeFns) > 0 {
			for _, fn := range closeFns {
				fn()
			}
		}
		fmt.Printf("recevied sig %s, sending shutdown signal", sig)
		done <- true
	}()

	fmt.Println("Awaiting SIGINT or SIGTERM")
	<-done // Wait until the done channel emits
	fmt.Println("exiting")
}

func main() {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	config, err := config.LoadConfig("../../../")

	if err != nil {
		logger.Fatalf("failed to load config %e", err)
	}

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

	go app.handleFavoriteRuleTemplateMessages()

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", config.ServerPort),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	// TODO maybe should closure this, also it is not working as expected with the signal handling deal on wsl at least
	// I think it might be because go run is receiving the interruput first see answer in <https://stackoverflow.com/questions/11268943/is-it-possible-to-capture-a-ctrlc-signal-sigint-and-run-a-cleanup-function-i>
	go srv.ListenAndServe()
	logger.Printf("Running ok scoring rules on port %d", config.ServerPort)

	createShutdownSignalHandler([]func() error{events.Close, srv.Close})
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

// TODO new file
func (app *application) handleFavoriteRuleTemplateMessages() {
	app.logger.Printf("Started listening for  favoriteRuleTemplateEvents")
	defer func() {
		err := app.favoriteRuleTemplateEvents.ConfirmMessageProcessed()
		if err != nil {
			app.logger.Print("error confirming message processing, possible duplicate message on next startup")
		}
	}()

	for {
		m, err := app.favoriteRuleTemplateEvents.Consume()
		if err != nil {
			break
		}
		app.logger.Printf("message received %s", m)
		keys := strings.Split(m, ",")
		err = app.models.DB.FavoriteGame(keys[1], keys[0])
		if err != nil {
			app.logger.Printf("error saving favorite game %s for player %s: %e", keys[1], keys[0], err)
			continue
		}
		app.logger.Printf("favorite game saved %s for player %s", keys[1], keys[0])
		err = app.favoriteRuleTemplateEvents.ConfirmMessageProcessed()
		if err != nil {
			app.logger.Printf("error confirming message processing, possible duplicate message on next startup %e", err)
		}
	}
}
