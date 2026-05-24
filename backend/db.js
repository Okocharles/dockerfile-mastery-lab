import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { seedInstructions } from "./data/seed.js";

const dbPath = process.env.DATABASE_PATH || "./data/mastery.db";
mkdirSync(dirname(dbPath), { recursive: true });
export const db = new DatabaseSync(dbPath);

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS instructions (
      slug TEXT PRIMARY KEY,
      payload TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS progress (
      instruction TEXT PRIMARY KEY,
      completed INTEGER DEFAULT 0,
      quizScore INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      weakAreas TEXT DEFAULT '[]',
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const insertInstruction = db.prepare("INSERT OR REPLACE INTO instructions (slug, payload) VALUES (?, ?)");
  const insertProgress = db.prepare("INSERT OR IGNORE INTO progress (instruction, completed, quizScore, attempts, xp, streak) VALUES (?, 0, 0, 0, 0, 0)");

  db.exec("BEGIN");
  try {
    for (const instruction of seedInstructions) {
      insertInstruction.run(instruction.slug, JSON.stringify(instruction));
      insertProgress.run(instruction.name);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getInstructions() {
  return db.prepare("SELECT payload FROM instructions ORDER BY slug").all().map((row) => JSON.parse(row.payload));
}

export function getInstruction(slug) {
  const row = db.prepare("SELECT payload FROM instructions WHERE slug = ?").get(slug);
  return row ? JSON.parse(row.payload) : null;
}

export function getProgress() {
  return db.prepare("SELECT * FROM progress ORDER BY instruction").all().map((row) => ({
    ...row,
    completed: Boolean(row.completed),
    weakAreas: JSON.parse(row.weakAreas || "[]")
  }));
}

export function saveQuizAttempt(instruction, score, weakAreas) {
  const xp = Math.max(10, score * 2);
  db.prepare(`
    INSERT INTO progress (instruction, completed, quizScore, attempts, weakAreas, xp, streak, updatedAt)
    VALUES (?, ?, ?, 1, ?, ?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(instruction) DO UPDATE SET
      completed = excluded.completed,
      quizScore = excluded.quizScore,
      attempts = attempts + 1,
      weakAreas = excluded.weakAreas,
      xp = xp + excluded.xp,
      streak = streak + 1,
      updatedAt = CURRENT_TIMESTAMP
  `).run(instruction, score >= 70 ? 1 : 0, score, JSON.stringify(weakAreas), xp);
  return getProgress().find((record) => record.instruction === instruction);
}
