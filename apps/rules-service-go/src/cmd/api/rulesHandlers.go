package main

import (
	"encoding/json"
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

func (app *application) deleteRulesTemplate(w http.ResponseWriter, r *http.Request) {
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

func (app *application) searchRulesTemplates(w http.ResponseWriter, r *http.Request) {
}