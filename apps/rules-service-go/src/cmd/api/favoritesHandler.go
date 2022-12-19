package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"okscoring.com/rules-service/src/models"
)

func (app *application) favoriteRulesTemplate(w http.ResponseWriter, r *http.Request) {
	// TODO this whole thing seems inefficient, I need to rethink the data format for the request etc.
	var favoriteTemplate models.FavoriteTemplate

	err := json.NewDecoder(r.Body).Decode(&favoriteTemplate)

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}
	err = app.favoriteRulesTemplateEvents.Send(favoriteTemplate.PlayerKey, fmt.Sprintf("%s,%s", favoriteTemplate.PlayerKey, favoriteTemplate.RulesTemplateKey))
	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}
}
