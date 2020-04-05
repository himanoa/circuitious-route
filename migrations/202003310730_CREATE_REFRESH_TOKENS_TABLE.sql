CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  discord_id TEXT PRIMARY KEY,
  token INTEGER NOT NULL,
  activated INTEGER NOT NULL,
  created_at DATETIME NOT NULL
);

