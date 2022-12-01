CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "rules_template" (
  "key" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "player_key" uuid NOT NULL,
  "first_to_score_wins" boolean NOT NULL,
  "dealer_settings" text NOT NULL,
  "high_score_wins" boolean NOT NULL,
  "players_must_be_on_same_round" boolean NOT NULL,
  "valid_state_schema" jsonb NOT NULL,
  "winning_schema" jsonb NOT NULL,
  "archived" boolean NOT NULL,
  "description" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "rules_template" ("player_key");
