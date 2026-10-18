/**
 * Verifies a Postgres connection string before you rely on it in production.
 *
 *   npm run db:test
 *
 * Connects, creates the tables if they are missing, writes and deletes a row,
 * and reports what it found. Safe to run against a live database — it cleans up
 * after itself and never touches existing rows.
 */

import postgres from "postgres";

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

console.log(bold("\nDatabase connection test\n"));

const url = process.env.DATABASE_URL?.trim();

if (!url) {
  console.log(yellow("○ DATABASE_URL is not set."));
  console.log(`
That is fine for local development — the site falls back to SQLite at
data/portfolio.db and everything works.

You only need Postgres for ${bold("Netlify")} (or any serverless host), because those
wipe the filesystem between requests and a SQLite file would not survive.

Add the connection string to .env.local to test it here first:

  DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
`);
  process.exit(0);
}

// Never print the password back to the terminal.
const redacted = url.replace(/:\/\/([^:]+):[^@]+@/, "://$1:••••••@");
console.log(dim(`Connecting to: ${redacted}\n`));

const pooled = url.includes("-pooler");
if (!pooled && url.includes("neon.tech")) {
  console.log(
    yellow("⚠ This looks like a direct Neon connection, not a pooled one."),
  );
  console.log(
    dim(
      "  On serverless each request can open its own connection and exhaust the\n" +
        "  limit. In the Neon dashboard turn on 'Connection pooling' and use the\n" +
        "  string containing '-pooler'.\n",
    ),
  );
}

const sql = postgres(url, {
  max: 2,
  idle_timeout: 5,
  connect_timeout: 15,
  ssl: url.includes("localhost") ? false : "require",
});

try {
  process.stdout.write("Connecting...          ");
  const [{ version }] = await sql`SELECT version()`;
  console.log(green("ok"));
  console.log(dim(`  ${version.split(",")[0]}`));

  process.stdout.write("Creating tables...     ");
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY, name TEXT, role TEXT, company TEXT,
      rating INTEGER NOT NULL, message TEXT NOT NULL,
      anonymous BOOLEAN NOT NULL DEFAULT FALSE,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), ip_hash TEXT
    )`;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_reviews_published
      ON reviews (published, created_at DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
      reason TEXT NOT NULL, message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      emailed BOOLEAN NOT NULL DEFAULT FALSE, ip_hash TEXT
    )`;
  console.log(green("ok"));

  process.stdout.write("Write / read / delete… ");
  const id = `connection-test-${Date.now()}`;
  await sql`
    INSERT INTO reviews (id, rating, message, anonymous, published)
    VALUES (${id}, 5, 'connection test', TRUE, FALSE)`;
  const rows = await sql`SELECT id FROM reviews WHERE id = ${id}`;
  await sql`DELETE FROM reviews WHERE id = ${id}`;
  if (rows.length !== 1) throw new Error("row did not read back");
  console.log(green("ok"));

  const [{ count: reviewCount }] = await sql`SELECT COUNT(*)::int AS count FROM reviews`;
  const [{ count: messageCount }] = await sql`SELECT COUNT(*)::int AS count FROM messages`;

  console.log(green("\n✓ Database is ready."));
  console.log(dim(`  reviews:  ${reviewCount} row(s)`));
  console.log(dim(`  messages: ${messageCount} row(s)`));
  console.log(
    `\nUse this same string as ${bold("DATABASE_URL")} in your Netlify environment variables.\n`,
  );
} catch (error) {
  console.log(red("failed\n"));
  console.log(red(`✗ ${error.message}\n`));

  const m = String(error.message).toLowerCase();
  if (m.includes("password") || m.includes("authentication")) {
    console.log("The username or password in the string is wrong. Copy it again\nfrom the Neon dashboard — use the button that includes the password.\n");
  } else if (m.includes("timeout") || m.includes("enotfound") || m.includes("econnrefused")) {
    console.log("Could not reach the host. Check the hostname, and that the Neon\nproject still exists and is not deleted.\n");
  } else if (m.includes("ssl")) {
    console.log("SSL negotiation failed. Make sure the string ends with ?sslmode=require\n");
  } else if (m.includes("does not exist")) {
    console.log("The database name in the string does not exist on that host.\nNeon's default is usually 'neondb'.\n");
  }
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
