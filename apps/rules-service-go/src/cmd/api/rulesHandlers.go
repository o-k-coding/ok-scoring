package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) getOneRulesTemplate(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	key := params.ByName("key")

	// if err != nil {
	// 	app.logger.Println(errors.New("invalid id parameter"))
	// 	app.writeAndSendError(w, err)
	// 	return
	// }

	app.logger.Println("key is ", key)

	rulesTemplate, err := app.models.DB.GetRulesTemplate(key)

	if err != nil {
		app.writeAndSendError(w, err)
		return
	}

	err = app.writeAndSendJson(w, http.StatusOK, rulesTemplate, "data")

	if err != nil {
		app.writeAndSendError(w, err)
		return
	}
}

func (app *application) getAllRulesTemplates(w http.ResponseWriter, r *http.Request) {

	rulesTemplates, err := app.models.DB.GetAllRulesTemplates()

	if err != nil {
		app.writeAndSendError(w, err)
		return
	}

	err = app.writeAndSendJson(w, http.StatusOK, rulesTemplates, "data")

	if err != nil {
		app.writeAndSendError(w, err)
		return
	}
}

func (app *application) deleteRulesTemplate(w http.ResponseWriter, r *http.Request) {
}

func (app *application) createRulesTemplate(w http.ResponseWriter, r *http.Request) {
}

func (app *application) updateRulesTemplate(w http.ResponseWriter, r *http.Request) {
}

func (app *application) searchRulesTemplates(w http.ResponseWriter, r *http.Request) {
}
