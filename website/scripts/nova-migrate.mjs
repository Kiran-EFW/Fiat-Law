#!/usr/bin/env node
/**
 * Applies the leads schema to ScalixNova.
 *
 * Run once per environment, with a key that holds database:admin — the key the
 * running site uses deliberately does not:
 *
 *   SCALIX_API_KEY=scalix_at_... node scripts/nova-migrate.mjs
 *
 * Every statement is idempotent, so re-running after a deploy is safe and is the
 * intended way to roll a schema change forward.
 */

const BASE = (process.env.SCALIX_API_URL ?? "https://api.scalix.world").replace(/\/+$/, "");
const KEY = process.env.SCALIX_API_KEY;

if (!KEY) {
  console.error("SCALIX_API_KEY is not set. Use a project-scoped key with database:admin.");
  process.exit(1);
}

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS leads (
     id                TEXT PRIMARY KEY,
     created_at        TEXT NOT NULL,
     updated_at        TEXT NOT NULL,
     kind              TEXT NOT NULL DEFAULT 'brief',
     segment           TEXT,
     answers           JSONB,
     recommendation    JSONB,
     score             INTEGER NOT NULL DEFAULT 0,
     band              TEXT NOT NULL DEFAULT 'nurture',
     status            TEXT NOT NULL DEFAULT 'new',
     name              TEXT NOT NULL DEFAULT '',
     role              TEXT NOT NULL DEFAULT '',
     company           TEXT NOT NULL DEFAULT '',
     email             TEXT NOT NULL DEFAULT '',
     phone             TEXT NOT NULL DEFAULT '',
     notes             TEXT NOT NULL DEFAULT '',
     source            JSONB NOT NULL DEFAULT '{}'::jsonb,
     duration_ms       BIGINT,
     marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
     privacy_version   TEXT NOT NULL DEFAULT ''
   )`,
  // The console's default view is "highest score first, then newest", and the
  // status and position filters are the only other access paths.
  `CREATE INDEX IF NOT EXISTS idx_leads_rank    ON leads (score DESC, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads (status)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_segment ON leads (segment)`,
  // Retention: enquiries that do not become instructions are deleted 24 months
  // after last contact. That sweep reads updated_at.
  `CREATE INDEX IF NOT EXISTS idx_leads_updated ON leads (updated_at)`,
];

async function run(query) {
  const response = await fetch(`${BASE}/api/v1/sql`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${text.slice(0, 400)}`);
  }
  return text;
}

const label = (s) => s.trim().split("\n")[0].replace(/\s+/g, " ").slice(0, 72);

for (const statement of STATEMENTS) {
  try {
    await run(statement);
    console.log(`  ok    ${label(statement)}`);
  } catch (error) {
    console.error(`  FAIL  ${label(statement)}\n        ${error.message}`);
    process.exit(1);
  }
}

const [{ n } = {}] = await run("SELECT COUNT(*)::int AS n FROM leads")
  .then((t) => JSON.parse(t))
  .then((r) => (r.rows ?? []).map((cells) => Object.fromEntries(r.columns.map((c, i) => [c.name, cells[i]]))))
  .catch(() => []);

console.log(`\nSchema applied. leads currently holds ${n ?? "?"} row(s).`);
