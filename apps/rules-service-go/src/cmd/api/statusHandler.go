package main

import (
	"encoding/json"
	"net/http"
)

type AppStatus struct {
	Status  string
	Version string
}

func (app *application) statusHandler(w http.ResponseWriter, r *http.Request) {
	currentStatus := AppStatus{
		Status:  "Available",
		Version: version,
	}

	responseBody, err := json.MarshalIndent(currentStatus, "", "  ")
	if err != nil {
		app.logger.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(responseBody)
}
