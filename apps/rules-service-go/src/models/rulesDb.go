package models

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type DBModel struct {
	DB *sql.DB
}

// TODO probably move these bits to a new file
type Scannable interface {
	Scan(dest ...interface{}) error
}

func ScanGameRulesTemplate(r Scannable) (*GameRulesTemplateDb, error) {
	var rulesTemplateDb GameRulesTemplateDb
	err := r.Scan(
		&rulesTemplateDb.Key,
		&rulesTemplateDb.Description,
		&rulesTemplateDb.PlayerKey,
		&rulesTemplateDb.ValidStateSchema,
		&rulesTemplateDb.WinningSchema,
		&rulesTemplateDb.FirstToScoreWins,
		&rulesTemplateDb.DealerSettings,
		&rulesTemplateDb.HighScoreWins,
		&rulesTemplateDb.PlayersMustBeOnSameRound,
		&rulesTemplateDb.CreatedAt,
		&rulesTemplateDb.Archived,
	)
	if err != nil {
		return nil, err
	}
	return &rulesTemplateDb, nil
}

// DB Methods

// Get returns one rulestemplate if found, and error if any
func (m *DBModel) GetRulesTemplate(key string) (*GameRulesTemplate, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

	defer cancel()

	//Note: one way to handle selects with null values would be to use coalesce to have a default value if null... but I feel like that's a bandaid
	query := `
	select
		key,
		description,
		player_key,
		valid_state_schema,
		winning_schema,
		first_to_score_wins,
		dealer_settings,
		high_score_wins,
		players_must_be_on_same_round,
		created_at,
		archived
	from rules_template
	where key = $1
	`

	row := m.DB.QueryRowContext(ctx, query, key)
	rulesTemplateDb, err := ScanGameRulesTemplate(row)
	if err != nil {
		return nil, err
	}

	return rulesTemplateDb.CreateTemplate(), nil
}

// Get returns all rulestemplate if found, and error if any
func (m *DBModel) GetAllRulesTemplates() ([]*GameRulesTemplate, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
	select
		key,
		description,
		player_key,
		valid_state_schema,
		winning_schema,
		first_to_score_wins,
		dealer_settings,
		high_score_wins,
		players_must_be_on_same_round,
		created_at,
		archived
	from rules_template
	order by created_at
	`

	rows, err := m.DB.QueryContext(ctx, query)

	if err != nil {
		return nil, err
	}

	// Needed for a query expecting multiple rows
	defer rows.Close()

	var ruleTemplates []*GameRulesTemplate

	for rows.Next() {
		rulesTemplateDb, err := ScanGameRulesTemplate(rows)
		if err != nil {
			return nil, err
		}
		ruleTemplates = append(ruleTemplates, rulesTemplateDb.CreateTemplate())
	}

	return ruleTemplates, nil
}

func (m *DBModel) InsertRulesTemplate(rulesTemplate *GameRulesTemplate) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// TODO the player key will come from the auth, which still needs a central service
	statement := `
	insert into rules_template (
		key,
		player_key,
		description,
		valid_state_schema,
		winning_schema,
		first_to_score_wins,
		dealer_settings,
		high_score_wins,
		players_must_be_on_same_round,
		archived
	)
	values (
		$1, $2, $3, $4, $5, $6, $7, $8, $9, false
	)
	`
	key := uuid.New().String()
	_, err := m.DB.ExecContext(
		ctx,
		statement,
		key,
		"984e59db-bae2-418b-b2d4-243427734a02",
		rulesTemplate.Description,
		rulesTemplate.ValidStateSchema,
		rulesTemplate.WinningSchema,
		rulesTemplate.FirstToScoreWins,
		rulesTemplate.DealerSettings,
		rulesTemplate.HighScoreWins,
		rulesTemplate.PlayersMustBeOnSameRound,
	)

	if err != nil {
		return "", err
	}
	return key, nil
}

func (m *DBModel) UpdateRulesTemplate(rulesTemplate *GameRulesTemplate) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// TODO the player key will come from the auth, which still needs a central service
	statement := `
	update rules_template set (
		description,
		valid_state_schema,
		winning_schema,
		first_to_score_wins,
		dealer_settings,
		high_score_wins,
		players_must_be_on_same_round
	) = (
		$1, $2, $3, $4, $5, $6, $7
	)

	where key = $8
	`
	_, err := m.DB.ExecContext(
		ctx,
		statement,
		rulesTemplate.Description,
		rulesTemplate.ValidStateSchema,
		rulesTemplate.WinningSchema,
		rulesTemplate.FirstToScoreWins,
		rulesTemplate.DealerSettings,
		rulesTemplate.HighScoreWins,
		rulesTemplate.PlayersMustBeOnSameRound,
		rulesTemplate.Key,
	)

	if err != nil {
		return err
	}
	return nil
}

func (m *DBModel) FavoriteGame(rulesTemplateKey string, playerKey string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// TODO the player key will come from the auth, which still needs a central service
	statement := `
	insert into favorite_template (rule_template_key, player_key) values (
		$1, $2
	) on conflict do nothing
	`
	m.DB.ExecContext(
		ctx,
		statement,
		rulesTemplateKey,
		playerKey,
	)

	return nil
}
