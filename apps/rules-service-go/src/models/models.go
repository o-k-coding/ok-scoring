package models

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

type Player struct {
	Key      string `json:"key"`
	Name     string `json:"name"`
	Favorite bool   `json:"favorite"`
	Email    string `json:"-"`
	Password string `json:"-"`
}

type Schema map[string]interface{}

type FavoriteTemplate struct {
	RulesTemplateKey string `json:"rulesTemplateKey"`
	PlayerKey        string `json:"playerKey"`
}

type GameRulesTemplate struct {
	Key string `json:"key"`
	// This is the author of the template
	PlayerKey                string    `json:"playerKey"`
	Description              string    `json:"description"`
	ValidStateSchema         Schema    `json:"validStateSchema"`
	WinningSchema            Schema    `json:"winningSchema"`
	FirstToScoreWins         bool      `json:"firstToScoreWins"`
	DealerSettings           string    `json:"dealerSettings"`
	HighScoreWins            bool      `json:"highScoreWins"`
	PlayersMustBeOnSameRound bool      `json:"playersMustBeOnSameRound"`
	CreatedAt                time.Time `json:"createdAt"`
	Archived                 bool      `json:"archived"`
}

type GameRulesTemplateDb struct {
	Key                      string         `json:"key"`
	PlayerKey                string         `json:"playerKey"`
	Description              string         `json:"description"`
	ValidStateSchema         Schema         `json:"validStateSchema"`
	WinningSchema            Schema         `json:"winningSchema"`
	FirstToScoreWins         sql.NullBool   `json:"firstToScoreWins"`
	DealerSettings           sql.NullString `json:"dealerSettings"`
	HighScoreWins            sql.NullBool   `json:"highScoreWins"`
	PlayersMustBeOnSameRound sql.NullBool   `json:"playersMustBeOnSameRound"`
	CreatedAt                time.Time      `json:"createdAt"`
	Archived                 sql.NullBool   `json:"archived"`
}

func (g *GameRulesTemplateDb) CreateTemplate() *GameRulesTemplate {
	return &GameRulesTemplate{
		Key:                      g.Key,
		Description:              g.Description,
		PlayerKey:                g.PlayerKey,
		ValidStateSchema:         g.ValidStateSchema,
		WinningSchema:            g.WinningSchema,
		FirstToScoreWins:         g.FirstToScoreWins.Bool,
		DealerSettings:           g.DealerSettings.String,
		HighScoreWins:            g.HighScoreWins.Bool,
		PlayersMustBeOnSameRound: g.PlayersMustBeOnSameRound.Bool,
		CreatedAt:                g.CreatedAt,
		Archived:                 g.Archived.Bool,
	}
}

// https://www.alexedwards.net/blog/using-postgresql-jsonb for how to handle json marshalling and scanning of a jsonb column into a map
func (a Schema) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *Schema) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(b, &a)
}

// DB Related code

// Wrapper for database, not really sure why this is necessary yet.
type Models struct {
	DB DBModel
}

// returns models with db pool attached. this type can then be "extended" with receiver functions to allow access to the DB
// This is basically a repo with a built in connection to the DB
func NewModels(db *sql.DB) Models {
	return Models{
		DB: DBModel{
			DB: db,
		},
	}
}

// Actual game rules, I don't think they are needed here.

// type GameState struct {
// 	Key         string `json:"key"`
// 	Description string `json:"description"`
// 	// TODO not sure on the type for this
// 	Date             int                  `json:"date"`
// 	Duration         int                  `json:"duration"`
// 	WinningPlayerKey string               `json:"winningPlayerKey"`
// 	ActivePlayerKey  string               `json:"activePlayerKey"`
// 	DealingPlayerKey string               `json:"dealingPlayerKey"`
// 	Rules            GameRules            `json:"rules"`
// 	ScoreHistory     []PlayerScoreHistory `json:"scoreHistory"`
// }

// type GameRules struct {
// 	Key                      string `json:"key"`
// 	GameKey                  string `json:"gameKey"`
// 	ValidStateSchema         string `json:"validStateSchema"`
// 	WinningSchema            string `json:"winningSchema"`
// 	FirstToScoreWins         bool   `json:"firstToScoreWins"`
// 	DealerSettings           string `json:"dealerSettings"`
// 	HighScoreWins            bool   `json:"highScoreWins"`
// 	PlayersMustBeOnSameRound bool   `json:"playersMustBeOnSameRound"`
// }

// type PlayerScoreHistory struct {
// 	Key          string       `json:"key"`
// 	GameKey      string       `json:"gameKey"`
// 	PlayerKey    string       `json:"playerKey"`
// 	Scores       []ScoreRound `json:"scores"`
// 	Score        int          `json:"score"`
// 	InitialScore int          `json:"initialScore"`
// 	Order        int          `json:"order"`
// }

// type ScoreRound struct {
// 	Key                   string `json:"key"`
// 	PlayerScoreHistoryKey string `json:"playerScoreHistoryKey"`
// 	Scores                []int  `json:"scores"`
// 	Score                 int    `json:"score"`
// 	InitialScore          int    `json:"initialScore"`
// 	Order                 int    `json:"order"`
// }

// type Player struct {
// 	Key      string `json:"key"`
// 	Name     string `json:"name"`
// 	Favorite bool   `json:"favorite"`
// }

// type FavoriteGame struct {
// 	Key         string `json:"key"`
// 	Description string `json:"favoriteGame"`
// }
