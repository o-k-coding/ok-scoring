package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// Receiver function on the application type
func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	router.HandlerFunc(http.MethodPut, "/v1/rules/update", app.updateRulesTemplate)
	router.HandlerFunc(http.MethodPost, "/v1/rules/create", app.createRulesTemplate)
	router.HandlerFunc(http.MethodGet, "/v1/rules/:key", app.getOneRulesTemplate)
	router.HandlerFunc(http.MethodGet, "/v1/rules", app.getAllRulesTemplates)

	// Call enableCors middleware for each request that comes into the router
	return app.enableCors(router)
}
