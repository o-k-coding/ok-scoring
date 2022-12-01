package main

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/pascaldekloe/jwt"
)

func (app *application) enableCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO change this for prod
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		next.ServeHTTP(w, r)
	})
}

func (app *application) checkToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// The Vary header on a response tells the client that header(s) were used to determine the response
		// for instance if we send an unauthorized it is because of the Authorization header
		// I think this is fine and secure because they don't know what about the authorization was bad
		// However it does tell a client that an Authorization header is expected
		// Also this header is used for caching...
		w.Header().Add("Vary", "Authorization")
		// Get the auth header and check it
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			// Could set an anon user...
			app.logger.Println("No auth header")
		}

		headerParts := strings.Split(authHeader, " ")
		if len(headerParts) != 2 {
			app.writeAndSendError(w, http.StatusBadRequest, errors.New("invalid auth header"))
			return
		}

		if headerParts[0] != "Bearer" {
			app.writeAndSendError(w, http.StatusUnauthorized, errors.New("unauthorized"))
			return
		}

		token := headerParts[1]

		claims, err := jwt.HMACCheck([]byte(token), []byte(app.config.JwtSecret))

		// TODO in this case we could acually break each of these out and log them internally
		// in a more specific way, but only return unauthorized to the client
		if err != nil || !claims.Valid(time.Now()) || !claims.AcceptAudience("ok-scoring.com") || claims.Issuer != "ok-scoring.com" {
			app.writeAndSendError(w, http.StatusUnauthorized, errors.New("unauthorized"))
			return
		}

		playerKey, err := strconv.ParseInt(claims.Subject, 10, 64)

		if err != nil {
			app.writeAndSendError(w, http.StatusUnauthorized, errors.New("unauthorized"))
			return
		}

		app.logger.Println("valid player", playerKey)
		next.ServeHTTP(w, r)
	})
}
