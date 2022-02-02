package main

import (
	"encoding/json"
	"net/http"
)

func (app *application) writeAndSendJson(w http.ResponseWriter, status int, data interface{}, wrap string) error {
	wrapper := make(map[string]interface{})
	wrapper[wrap] = data

	js, err := json.Marshal(wrapper)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

func (app *application) writeAndSendError(w http.ResponseWriter, err error) {
	app.logger.Println("Sending error response", err)
	type jsonError struct {
		Message string `json:"message"`
	}

	responseError := jsonError{
		Message: err.Error(),
	}

	app.writeAndSendJson(w, http.StatusBadRequest, responseError, "error")
}
