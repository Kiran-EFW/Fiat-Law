/**
 * SQLite driver — local development only.
 *
 * Deployed instances use the Nova driver: Scalix Run compute is ephemeral, so a
 * file here would be discarded on every deploy.
 */

import "server-only";
import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { PRIVACY_VERSION, toLead, newLeadId, type LeadRow, type LeadStore } from "@/lib/leads/store";

const DB_PATH = process.env.LEADS_DB_PATH ?? path.join(process.cwd(), "data", "leads.db");

let db: Database.Database | null = null;

function connect(): Database.Database {
  if (db) return db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id                TEXT PRIMARY KEY,
      created_at        TEXT NOT NULL,
      updated_at        TEXT NOT NULL,
      kind              TEXT NOT NULL DEFAULT 'brief',
      segment           TEXT,
      answers           TEXT,
      recommendation    TEXT,
      score             INTEGER NOT NULL DEFAULT 0,
      band              TEXT NOT NULL DEFAULT 'nurture',
      status            TEXT NOT NULL DEFAULT 'new',
      name              TEXT NOT NULL DEFAULT '',
      role              TEXT NOT NULL DEFAULT '',
      company           TEXT NOT NULL DEFAULT '',
      email             TEXT NOT NULL DEFAULT '',
      phone             TEXT NOT NULL DEFAULT '',
      notes             TEXT NOT NULL DEFAULT '',
      source            TEXT NOT NULL DEFAULT '{}',
      duration_ms       INTEGER,
      marketing_consent INTEGER NOT NULL DEFAULT 0,
      privacy_version   TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads (status);
    CREATE INDEX IF NOT EXISTS idx_leads_segment ON leads (segment);
  `);
  return db;
}

export const sqliteLeadStore: LeadStore = {
  async create(lead) {
    const conn = connect();
    const now = new Date().toISOString();
    const id = newLeadId(now);
    conn
      .prepare(
        `INSERT INTO leads (id, created_at, updated_at, kind, segment, answers, recommendation, score, band,
                            status, name, role, company, email, phone, notes, source, duration_ms,
                            marketing_consent, privacy_version)
         VALUES (@id, @created_at, @updated_at, @kind, @segment, @answers, @recommendation, @score, @band,
                 'new', @name, @role, @company, @email, @phone, @notes, @source, @duration_ms,
                 @marketing_consent, @privacy_version)`,
      )
      .run({
        id,
        created_at: now,
        updated_at: now,
        kind: lead.kind,
        segment: lead.segment ?? null,
        answers: lead.answers ? JSON.stringify(lead.answers) : null,
        recommendation: lead.recommendation ? JSON.stringify(lead.recommendation) : null,
        score: lead.score ?? 0,
        band: lead.band ?? "nurture",
        name: lead.name,
        role: lead.role ?? "",
        company: lead.company ?? "",
        email: lead.email,
        phone: lead.phone ?? "",
        notes: lead.notes ?? "",
        source: JSON.stringify(lead.source ?? {}),
        duration_ms: lead.durationMs ?? null,
        marketing_consent: lead.marketingConsent ? 1 : 0,
        privacy_version: PRIVACY_VERSION,
      });
    return (await this.get(id))!;
  },

  async list(opts = {}) {
    const conn = connect();
    const clauses: string[] = [];
    const params: Record<string, unknown> = { limit: opts.limit ?? 500 };
    if (opts.status) {
      clauses.push("status = @status");
      params.status = opts.status;
    }
    if (opts.segment) {
      clauses.push("segment = @segment");
      params.segment = opts.segment;
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = conn
      .prepare(`SELECT * FROM leads ${where} ORDER BY score DESC, created_at DESC LIMIT @limit`)
      .all(params) as LeadRow[];
    return rows.map(toLead);
  },

  async get(id) {
    const conn = connect();
    const row = conn.prepare("SELECT * FROM leads WHERE id = ?").get(id) as LeadRow | undefined;
    return row ? toLead(row) : null;
  },

  async setStatus(id, status) {
    connect()
      .prepare("UPDATE leads SET status = ?, updated_at = ? WHERE id = ?")
      .run(status, new Date().toISOString(), id);
  },

  async remove(id) {
    connect().prepare("DELETE FROM leads WHERE id = ?").run(id);
  },

  async count() {
    const conn = connect();
    const total = (conn.prepare("SELECT COUNT(*) AS n FROM leads").get() as { n: number }).n;
    const rows = conn.prepare("SELECT status, COUNT(*) AS n FROM leads GROUP BY status").all() as {
      status: string;
      n: number;
    }[];
    return { total, byStatus: Object.fromEntries(rows.map((r) => [r.status, r.n])) };
  },
};
