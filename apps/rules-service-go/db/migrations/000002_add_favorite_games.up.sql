CREATE TABLE IF NOT EXISTS "favorite_template" (
  "rule_template_key" uuid NOT NULL REFERENCES "rules_template" ("key") ON DELETE CASCADE,
  "player_key" uuid NOT NULL,
  PRIMARY KEY(rule_template_key, player_key)
);
