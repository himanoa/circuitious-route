CREATE TABLE IF NOT EXISTS `users` (
  discord_id INTEGER PRIMARY KEY,
  current_login_id TEXT
);

CREATE INDEX users_current_login_id on users(current_login_id);
