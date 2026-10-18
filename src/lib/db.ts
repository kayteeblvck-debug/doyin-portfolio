/**
 * Storage layer.
 *
 * Two drivers, chosen at runtime:
 *
 *   • SQLite (default) — uses Node's built-in `node:sqlite`, no native build,
 *     no external service. The database is a single file at ./data/portfolio.db.
 *     Perfect for local use and for any host with a persistent disk
 *     (a VPS, Docker, Render, Railway, Fly.io).
 *
 *   • Postgres — used automatically when DATABASE_URL is set. Required on
 *     serverless hosts such as Vercel, where the filesystem is wiped between
 *     invocations and a SQLite file would not survive.
 *
 * Both drivers expose the same async API, so nothing above this file cares
 * which one is running.
 */

import { randomUUID } from "node:crypto";
import type { ContactMessage, NewContactMessage, NewReview, Review } from "./types";

const DATABASE_URL = process.env.DATABASE_URL?.trim();
export const usingPostgres = Boolean(DATABASE_URL);

/** Reviews appear immediately unless you set REVIEWS_REQUIRE_APPROVAL=true. */
export const requireApproval =
  process.env.REVIEWS_REQUIRE_APPROVAL?.toLowerCase() === "true";

/* -------------------------------------------------------------------------- */
/*  SQLite driver                                                             */
/* -------------------------------------------------------------------------- */

type SqliteHandle = {
  prepare: (sql: string) => {
    all: (...params: unknown[]) => unknown[];
    get: (...params: unknown[]) => unknown;
    run: (...params: unknown[]) => unknown;
  };
  exec: (sql: string) => void;
};

// Cached on globalThis so Next's dev-mode hot reload does not open a new
// handle on every edit.
const globalForDb = globalThis as unknown as {
  __portfolioSqlite?: SqliteHandle;
  __portfolioPg?: ReturnType<typeof import("postgres")>;
};

/**
 * Serverless hosts give each request a fresh, throwaway filesystem. A SQLite
 * file there would be silently discarded — reviews would appear to save and
 * then vanish. Refusing loudly is far better than losing someone's review.
 */
function assertPersistentDisk() {
  const serverless =
    process.env.NETLIFY ||
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (serverless) {
    throw new Error(
      "DATABASE_URL is not set. This platform has no persistent filesystem, so " +
        "SQLite cannot be used here — reviews and messages would be lost. Add a " +
        "Postgres connection string as the DATABASE_URL environment variable in " +
        "your site settings. See README.md.",
    );
  }
}

async function sqlite(): Promise<SqliteHandle> {
  if (globalForDb.__portfolioSqlite) return globalForDb.__portfolioSqlite;

  assertPersistentDisk();

  const { DatabaseSync } = await import("node:sqlite");
  const { mkdirSync } = await import("node:fs");
  const path = await import("node:path");

  const dir = path.join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });

  const db = new DatabaseSync(path.join(dir, "portfolio.db")) as unknown as SqliteHandle;

  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS reviews (
      id          TEXT PRIMARY KEY,
      name        TEXT,
      role        TEXT,
      company     TEXT,
      rating      INTEGER NOT NULL,
      message     TEXT NOT NULL,
      anonymous   INTEGER NOT NULL DEFAULT 0,
      published   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL,
      ip_hash     TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_published
      ON reviews (published, created_at DESC);

    CREATE TABLE IF NOT EXISTS messages (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      reason      TEXT NOT NULL,
      message     TEXT NOT NULL,
      created_at  TEXT NOT NULL,
      emailed     INTEGER NOT NULL DEFAULT 0,
      ip_hash     TEXT
    );
  `);

  globalForDb.__portfolioSqlite = db;
  return db;
}

/* -------------------------------------------------------------------------- */
/*  Postgres driver                                                           */
/* -------------------------------------------------------------------------- */

async function pg() {
  if (globalForDb.__portfolioPg) return globalForDb.__portfolioPg;

  const postgres = (await import("postgres")).default;
  const sql = postgres(DATABASE_URL!, {
    max: 5,
    idle_timeout: 20,
    // Most managed Postgres providers require TLS; local ones usually do not.
    ssl: DATABASE_URL!.includes("localhost") ? false : "require",
  });

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id          TEXT PRIMARY KEY,
      name        TEXT,
      role        TEXT,
      company     TEXT,
      rating      INTEGER NOT NULL,
      message     TEXT NOT NULL,
      anonymous   BOOLEAN NOT NULL DEFAULT FALSE,
      published   BOOLEAN NOT NULL DEFAULT TRUE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ip_hash     TEXT
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_reviews_published
      ON reviews (published, created_at DESC)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      reason      TEXT NOT NULL,
      message     TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      emailed     BOOLEAN NOT NULL DEFAULT FALSE,
      ip_hash     TEXT
    )
  `;

  globalForDb.__portfolioPg = sql;
  return sql;
}

/* -------------------------------------------------------------------------- */
/*  Row mapping                                                               */
/* -------------------------------------------------------------------------- */

type Row = Record<string, unknown>;

const toIso = (v: unknown): string =>
  v instanceof Date ? v.toISOString() : String(v ?? "");

function mapReview(row: Row): Review {
  return {
    id: String(row.id),
    name: (row.name as string | null) || null,
    role: (row.role as string | null) || null,
    company: (row.company as string | null) || null,
    rating: Number(row.rating),
    message: String(row.message),
    anonymous: Boolean(row.anonymous),
    published: Boolean(row.published),
    createdAt: toIso(row.created_at),
  };
}

function mapMessage(row: Row): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    reason: String(row.reason),
    message: String(row.message),
    createdAt: toIso(row.created_at),
    emailed: Boolean(row.emailed),
  };
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export async function listReviews(includeUnpublished = false): Promise<Review[]> {
  if (usingPostgres) {
    const sql = await pg();
    const rows = includeUnpublished
      ? await sql`SELECT * FROM reviews ORDER BY created_at DESC`
      : await sql`SELECT * FROM reviews WHERE published = TRUE ORDER BY created_at DESC`;
    return (rows as unknown as Row[]).map(mapReview);
  }

  const db = await sqlite();
  const rows = includeUnpublished
    ? db.prepare(`SELECT * FROM reviews ORDER BY created_at DESC`).all()
    : db
        .prepare(
          `SELECT * FROM reviews WHERE published = 1 ORDER BY created_at DESC`,
        )
        .all();
  return (rows as Row[]).map(mapReview);
}

export async function createReview(
  input: NewReview,
  ipHash: string,
): Promise<Review> {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const published = !requireApproval;

  // An anonymous review keeps no identifying fields at all.
  const name = input.anonymous ? null : input.name?.trim() || null;
  const role = input.anonymous ? null : input.role?.trim() || null;
  const company = input.anonymous ? null : input.company?.trim() || null;

  if (usingPostgres) {
    const sql = await pg();
    const rows = await sql`
      INSERT INTO reviews (id, name, role, company, rating, message, anonymous, published, created_at, ip_hash)
      VALUES (${id}, ${name}, ${role}, ${company}, ${input.rating}, ${input.message},
              ${input.anonymous}, ${published}, ${createdAt}, ${ipHash})
      RETURNING *
    `;
    return mapReview((rows as unknown as Row[])[0]);
  }

  const db = await sqlite();
  db.prepare(
    `INSERT INTO reviews (id, name, role, company, rating, message, anonymous, published, created_at, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    name,
    role,
    company,
    input.rating,
    input.message,
    input.anonymous ? 1 : 0,
    published ? 1 : 0,
    createdAt,
    ipHash,
  );

  return {
    id,
    name,
    role,
    company,
    rating: input.rating,
    message: input.message,
    anonymous: input.anonymous,
    published,
    createdAt,
  };
}

export async function setReviewPublished(
  id: string,
  published: boolean,
): Promise<void> {
  if (usingPostgres) {
    const sql = await pg();
    await sql`UPDATE reviews SET published = ${published} WHERE id = ${id}`;
    return;
  }
  const db = await sqlite();
  db.prepare(`UPDATE reviews SET published = ? WHERE id = ?`).run(
    published ? 1 : 0,
    id,
  );
}

export async function deleteReview(id: string): Promise<void> {
  if (usingPostgres) {
    const sql = await pg();
    await sql`DELETE FROM reviews WHERE id = ${id}`;
    return;
  }
  const db = await sqlite();
  db.prepare(`DELETE FROM reviews WHERE id = ?`).run(id);
}

export async function createMessage(
  input: NewContactMessage,
  ipHash: string,
  emailed: boolean,
): Promise<ContactMessage> {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  if (usingPostgres) {
    const sql = await pg();
    const rows = await sql`
      INSERT INTO messages (id, name, email, reason, message, created_at, emailed, ip_hash)
      VALUES (${id}, ${input.name}, ${input.email}, ${input.reason}, ${input.message},
              ${createdAt}, ${emailed}, ${ipHash})
      RETURNING *
    `;
    return mapMessage((rows as unknown as Row[])[0]);
  }

  const db = await sqlite();
  db.prepare(
    `INSERT INTO messages (id, name, email, reason, message, created_at, emailed, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.name,
    input.email,
    input.reason,
    input.message,
    createdAt,
    emailed ? 1 : 0,
    ipHash,
  );

  return { id, ...input, createdAt, emailed };
}

export async function markMessageEmailed(id: string): Promise<void> {
  if (usingPostgres) {
    const sql = await pg();
    await sql`UPDATE messages SET emailed = TRUE WHERE id = ${id}`;
    return;
  }
  const db = await sqlite();
  db.prepare(`UPDATE messages SET emailed = 1 WHERE id = ?`).run(id);
}

export async function listMessages(): Promise<ContactMessage[]> {
  if (usingPostgres) {
    const sql = await pg();
    const rows = await sql`SELECT * FROM messages ORDER BY created_at DESC LIMIT 200`;
    return (rows as unknown as Row[]).map(mapMessage);
  }
  const db = await sqlite();
  const rows = db
    .prepare(`SELECT * FROM messages ORDER BY created_at DESC LIMIT 200`)
    .all();
  return (rows as Row[]).map(mapMessage);
}
