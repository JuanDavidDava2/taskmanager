import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "../data/tasks.db");

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`);

export default db;