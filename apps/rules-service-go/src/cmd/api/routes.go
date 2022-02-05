package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) wrapMiddleware(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		// this is needed to be able to access params?
		ctx := context.WithValue(r.Context(), "params", params)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// Receiver function on the application type
func (app *application) routes() http.Handler {
	router := httprouter.New()
	secure := alice.New(app.checkToken)

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	router.HandlerFunc(http.MethodPost, "/v1/graphql", app.graphql)
	// router.HandlerFunc(http.MethodPost, "/v1/signin", app.signIn)
	// router.HandlerFunc(http.MethodPut, "/v1/rules/update", app.updateRulesTemplate)
	router.PUT("/v1/rules/update", app.wrapMiddleware(secure.ThenFunc(app.updateRulesTemplate)))
	router.POST("/v1/rules/create", app.wrapMiddleware(secure.ThenFunc(app.createRulesTemplate)))
	router.HandlerFunc(http.MethodGet, "/v1/rules/:key", app.getOneRulesTemplate)
	router.HandlerFunc(http.MethodGet, "/v1/rules", app.getAllRulesTemplates)

	// Create
	return app.enableCors(router)
}
