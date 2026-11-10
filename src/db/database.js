import { halls, invigilators, exams } from "./seed";
import { localISO } from "../utils";

export const EXAM_SQL = `
  SELECT e.*, h.name AS hall_name, h.building, h.floor, i.name AS inv_name
  FROM exams e
  JOIN halls h ON h.id = e.hall_id
  JOIN invigilators i ON i.id = e.invigilator_id`;

export async function initDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS halls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      building TEXT NOT NULL,
      floor TEXT,
      capacity INTEGER,
      directions TEXT,
      facilities TEXT
    );
    CREATE TABLE IF NOT EXISTS invigilators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT,
      phone TEXT,
      email TEXT,
      office TEXT
    );
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      duration_min INTEGER NOT NULL,
      hall_id INTEGER NOT NULL,
      invigilator_id INTEGER NOT NULL,
      seat_range TEXT,
      instructions TEXT,
      is_saved INTEGER DEFAULT 0,
      FOREIGN KEY (hall_id) REFERENCES halls(id),
      FOREIGN KEY (invigilator_id) REFERENCES invigilators(id)
    );
  `);

  const row = await db.getFirstAsync("SELECT COUNT(*) AS c FROM halls");
  if (row.c === 0) {
    for (const h of halls) {
      await db.runAsync(
        "INSERT INTO halls (name, building, floor, capacity, directions, facilities) VALUES (?,?,?,?,?,?)",
        h,
      );
    }
    for (const v of invigilators) {
      await db.runAsync(
        "INSERT INTO invigilators (name, department, phone, email, office) VALUES (?,?,?,?,?)",
        v,
      );
    }
    for (const e of exams) {
      await db.runAsync(
        `INSERT INTO exams (code, title, department, exam_date, start_time, duration_min, hall_id, invigilator_id, seat_range, instructions, is_saved)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          e[0],
          e[1],
          e[2],
          localISO(e[3]),
          e[4],
          e[5],
          e[6] + 1,
          e[7] + 1,
          e[8],
          e[9],
          e[10],
        ],
      );
    }
  }
}
