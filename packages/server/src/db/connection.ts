// ──────────────────────────────────────────────
// Database Connection
// ──────────────────────────────────────────────
import * as schema from "./schema/index.js";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { DATA_DIR } from "../utils/data-dir.js";

type DrizzleDB = ReturnType<typeof import("drizzle-orm/libsql").drizzle<typeof schema>>;

let dbPromise: Promise<DrizzleDB> | null = null;

async function createWithLibsql(dbPath: string): Promise<DrizzleDB> {
  const { createClient } = await import("@libsql/client");
  const { drizzle } = await import("drizzle-orm/libsql");

  const client = createClient({ url: `file:${dbPath}` });
  await client.execute("PRAGMA journal_mode=WAL");
  await client.execute("PRAGMA synchronous=NORMAL");
  await client.execute("PRAGMA busy_timeout=5000");

  return drizzle(client, { schema });
}

async function createWithBetterSqlite3(dbPath: string): Promise<DrizzleDB> {
  const Database = (await import("better-sqlite3")).default;
  const { drizzle } = await import("drizzle-orm/better-sqlite3");

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("synchronous = NORMAL");
  sqlite.pragma("busy_timeout = 5000");

  // Cast is safe — both Drizzle SQLite drivers share the same query API
  return drizzle(sqlite, { schema }) as unknown as DrizzleDB;
}

async function createWithSqlJs(dbPath: string): Promise<DrizzleDB> {
  const initSqlJs = (await import("sql.js")).default;
  const { drizzle } = await import("drizzle-orm/sql-js");

  const SQL = await initSqlJs();

  // Load existing database from disk if it exists
  let sqlDb;
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    sqlDb = new SQL.Database(fileBuffer);
  } else {
    sqlDb = new SQL.Database();
  }

  sqlDb.run("PRAGMA journal_mode = WAL");
  sqlDb.run("PRAGMA synchronous = NORMAL");
  sqlDb.run("PRAGMA busy_timeout = 5000");

  // Persist to disk periodically and on process exit
  const save = () => {
    try {
      const data = sqlDb.export();
      const buffer = Buffer.from(data);
      writeFileSync(dbPath, buffer);
    } catch {
      // Non-fatal — log but don't crash
      console.error("[sql.js] Failed to persist database to disk");
    }
  };

  // Auto-save every 30 seconds
  const timer = setInterval(save, 30_000);
  timer.unref(); // Don't prevent process exit

  // Save on clean shutdown
  process.on("beforeExit", save);
  for (const sig of ["SIGINT", "SIGTERM"] as const) {
    process.once(sig, () => {
      save();
      process.exit(0);
    });
  }

  return drizzle(sqlDb, { schema }) as unknown as DrizzleDB;
}

async function createDB(dbPath: string): Promise<DrizzleDB> {
  mkdirSync(dirname(dbPath), { recursive: true });

  const driver = process.env.DATABASE_DRIVER;

  // Explicit driver selection
  if (driver === "better-sqlite3") {
    return createWithBetterSqlite3(dbPath);
  }
  if (driver === "sql.js") {
    return createWithSqlJs(dbPath);
  }

  // Default: try libsql → better-sqlite3 → sql.js
  try {
    return await createWithLibsql(dbPath);
  } catch {
    try {
      return await createWithBetterSqlite3(dbPath);
    } catch {
      return await createWithSqlJs(dbPath);
    }
  }
}

export async function getDB() {
  if (!dbPromise) {
    const dbUrl = process.env.DATABASE_URL ?? `file:${join(DATA_DIR, "marinara-engine.db")}`;
    const dbPath = dbUrl.replace(/^file:/, "");
    dbPromise = createDB(dbPath);
  }
  return dbPromise;
}

export type DB = DrizzleDB;
