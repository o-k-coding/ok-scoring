package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"

	"okscoring.com/rules-service/src/models"
)

type Credentials struct {
	Username string `json:"email"`
	Password string `json:"password"`
}

func (app *application) SignIn(w http.ResponseWriter, r *http.Request) {
	// TODO temporary
	var validUser = models.Player{
		Key:      "984e59db-bae2-418b-b2d4-243427734a02",
		Email:    "ok.coding355@gmail.com",
		Password: app.config.DummyPasswordHash,
	}
	var creds Credentials

	err := json.NewDecoder(r.Body).Decode(&creds)

	if err != nil {
		app.writeAndSendError(w, http.StatusUnauthorized, errors.New("unauthorized"))
		return
	}

	// This would be a DB query or service call IRL
	hashedPassword := validUser.Password

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password))
	if err != nil {
		app.writeAndSendError(w, http.StatusUnauthorized, errors.New("unauthorized"))
		return
	}

	// Otherwise we are good to go
	var claims jwt.Claims
	claims.Subject = fmt.Sprint(validUser.Key)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = "ok-scoring.com"
	claims.Audiences = []string{"ok-scoring.com"}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(app.config.JwtSecret))

	if err != nil {
		app.writeAndSendError(w, http.StatusInternalServerError, errors.New("error signing token"))
		return
	}

	app.writeAndSendJson(w, http.StatusOK, string(jwtBytes), "token")
}
