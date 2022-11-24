package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"okscoring.com/rules-service/src/models"
)

func (app *application) getOneRulesTemplate(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	key := params.ByName("key")

	app.logger.Println("key is ", key)

	rulesTemplate, err := app.models.DB.GetRulesTemplate(key)

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}

	err = app.writeAndSendJson(w, http.StatusOK, rulesTemplate, "data")

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}
}

func (app *application) getAllRulesTemplates(w http.ResponseWriter, r *http.Request) {

	rulesTemplates, err := app.models.DB.GetAllRulesTemplates()

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}

	err = app.writeAndSendJson(w, http.StatusOK, rulesTemplates, "data")

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}
}

// TODO
func (app *application) deleteRulesTemplate(w http.ResponseWriter, r *http.Request) {
}

func (app *application) favoriteRulesTemplate(w http.ResponseWriter, r *http.Request) {
	// TODO this whole thing seems inefficient, I need to rethink the data format for the request etc.
	var favoriteTemplate models.FavoriteTemplate

	err := json.NewDecoder(r.Body).Decode(&favoriteTemplate)

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}
	err = app.favoriteRuleTemplateEvents.Send(favoriteTemplate.PlayerKey, fmt.Sprintf("%s,%s", favoriteTemplate.PlayerKey, favoriteTemplate.RulesTemplateKey))
	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}
}

// Could you this, where everything is a string
// And then create a function to translate the strings into the correct types for each field
// type GameRulesTemplatePayload struct {
// 	Description              string    `json:"description"`
// 	ValidStateSchema         string    `json:"validStateSchema"`
// 	WinningSchema            string    `json:"winningSchema"`
// 	FirstToScoreWins         string      `json:"firstToScoreWins"`
// 	DealerSettings           string    `json:"dealerSettings"`
// 	HighScoreWins            string      `json:"highScoreWins"`
// 	PlayersMustBeOnSameRound string      `json:"playersMustBeOnSameRound"`
// 	Archived                 string      `json:"archived"`
// }

func (app *application) createRulesTemplate(w http.ResponseWriter, r *http.Request) {
	var rulesTemplate models.GameRulesTemplate

	err := json.NewDecoder(r.Body).Decode(&rulesTemplate)

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}

	key, err := app.models.DB.InsertRulesTemplate(&rulesTemplate)

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}

	app.writeAndSendJson(w, http.StatusCreated, key, "key")
}

func (app *application) updateRulesTemplate(w http.ResponseWriter, r *http.Request) {
	var rulesTemplate models.GameRulesTemplate

	app.logger.Println("UPDATE RULES TEMPLATE")

	err := json.NewDecoder(r.Body).Decode(&rulesTemplate)

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}

	key, err := app.models.DB.UpdateRulesTemplate(&rulesTemplate)

	if err != nil {
		app.writeAndSendError(w, http.StatusBadRequest, err)
		return
	}

	app.writeAndSendJson(w, http.StatusCreated, key, "key")
}

// TODO
func (app *application) searchRulesTemplates(w http.ResponseWriter, r *http.Request) {
}
