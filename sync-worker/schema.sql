-- D1 schema for the diary sync worker (1 row per day)
CREATE TABLE IF NOT EXISTS entries (
  date       TEXT PRIMARY KEY,          -- YYYY-MM-DD
  mood       TEXT,                      -- 最高 / 良い / 普通 / 微妙 / 最悪 (nullable)
  text       TEXT NOT NULL,
  updated_at INTEGER NOT NULL,          -- client clock (ms) when the entry was last edited; used for last-write-wins
  synced_at  INTEGER NOT NULL           -- server clock (ms) when the row was written; used as the pull cursor
);
CREATE INDEX IF NOT EXISTS idx_entries_synced ON entries (synced_at);
