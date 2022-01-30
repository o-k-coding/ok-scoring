package models

import (
	"context"
	"database/sql"
	"time"
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
			&rulesTemplateDb.FirstToScoreWins.Bool,
			&rulesTemplateDb.DealerSettings.String,
			&rulesTemplateDb.HighScoreWins.Bool,
			&rulesTemplateDb.PlayersMustBeOnSameRound.Bool,
			&rulesTemplateDb.CreatedAt,
			&rulesTemplateDb.Archived.Bool,
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
