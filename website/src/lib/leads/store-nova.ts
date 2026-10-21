/**
 * ScalixNova driver — the deployed lead store.
 *
 * Two deliberate choices, both to keep this byte-identical to the SQLite driver
 * so a lead exported from either is the same record:
 *
 *  - `created_at` / `updated_at` are TEXT holding ISO-8601 UTC, not timestamptz.
 *    The application never does date arithmetic in SQL, ISO-8601 sorts correctly
 *    as text, and this removes any chance of a timezone changing what a
 *    retention period means.
 *  - `answers`, `recommendation` and `source` are JSONB. Nothing queries inside
 *    them today, but a firm will eventually want "every enquiry from pharma",
 *    and JSONB makes that a query rather than a migration.
 *
 * There is no DDL at runtime. The schema is applied once by
 * `scripts/nova-migrate.mjs` using the deploy key; the runtime key holds only
 * database:read and database:query, so it could not create or drop a table even
 * if this file asked it to. A missing table therefore fails loudly at the first
 * write instead of silently succeeding against something half-provisioned.
 */

import "server-only";
import { sql, exec } from "@/lib/leads/nova";
import { PRIVACY_VERSION, toLead, newLeadId, type LeadRow, type LeadStore } from "@/lib/leads/store";

const COLUMNS = `id, created_at, updated_at, kind, segment, answers, recommendation, score, band,
                 status, name, role, company, email, phone, notes, source, duration_ms,
                 marketing_consent, privacy_version`;

/**
 * One position in an INSERT: either a bound placeholder, or the NULL literal.
 *
 * Scalix's SQL gateway cannot serialise a JSON null bound to a parameter that
 * carries a type — it answers `error serializing parameter N`. That hits every
 * nullable column this table has except `segment` (TEXT), so `answers`,
 * `recommendation` and `duration_ms` are written as `NULL` when the client sent
 * nothing for them and the column's own default stands. Binding them is not an
 * option, and neither is an empty string: the gateway types the value and
 * rejects a bigint it cannot parse.
 */
interface Slot {
  sql: string;
  param?: unknown;
}

const NULL_SQL: Slot = { sql: "NULL" };
// `== null` on purpose: an absent value and an explicit null are the same
// thing here, and both must become the literal rather than a bound parameter.
const optional = <T,>(value: T | null | undefined): Slot =>
  value == null ? NULL_SQL : { sql: "?", param: value };
const optionalJsonb = (value: string | null | undefined): Slot =>
  value == null ? NULL_SQL : { sql: "?::jsonb", param: value };
const optionalBigint = (value: number | null | undefined): Slot =>
  value == null ? NULL_SQL : { sql: "?::bigint", param: value };

export const novaLeadStore: LeadStore = {
  async create(lead) {
    const now = new Date().toISOString();
    const id = newLeadId(now);

    const slots: Slot[] = [
      optional(id),
      optional(now),
      optional(now),
      optional(lead.kind),
      optional(lead.segment ?? null),
      optionalJsonb(lead.answers ? JSON.stringify(lead.answers) : null),
      optionalJsonb(lead.recommendation ? JSON.stringify(lead.recommendation) : null),
      optional(lead.score ?? 0),
      optional(lead.band ?? "nurture"),
      // status is a literal, not a bound parameter.
      { sql: "'new'" },
      optional(lead.name),
      optional(lead.role ?? ""),
      optional(lead.company ?? ""),
      optional(lead.email),
      optional(lead.phone ?? ""),
      optional(lead.notes ?? ""),
      optionalJsonb(JSON.stringify(lead.source ?? {})),
      optionalBigint(lead.durationMs ?? null),
      optional(lead.marketingConsent ?? false),
      optional(PRIVACY_VERSION),
    ];

    // Number the placeholders in the order the params are pushed, so the two
    // can never drift apart.
    const params: unknown[] = [];
    const values = slots
      .map(({ sql, param }) => {
        if (sql === "NULL" || param === undefined) return sql;
        params.push(param);
        return sql.replace("?", `$${params.length}`);
      })
      .join(", ");

    const rows = await sql<LeadRow>(
      `INSERT INTO leads (${COLUMNS})
       VALUES (${values})
       RETURNING ${COLUMNS}`,
      params,
    );
    if (!rows.length) throw new Error(`Nova accepted the insert for ${id} but returned no row`);
    return toLead(rows[0]);
  },

  async list(opts = {}) {
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (opts.status) {
      params.push(opts.status);
      clauses.push(`status = $${params.length}`);
    }
    if (opts.segment) {
      params.push(opts.segment);
      clauses.push(`segment = $${params.length}`);
    }
    params.push(opts.limit ?? 500);
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = await sql<LeadRow>(
      `SELECT ${COLUMNS} FROM leads ${where} ORDER BY score DESC, created_at DESC LIMIT $${params.length}`,
      params,
    );
    return rows.map(toLead);
  },

  async get(id) {
    const rows = await sql<LeadRow>(`SELECT ${COLUMNS} FROM leads WHERE id = $1`, [id]);
    return rows.length ? toLead(rows[0]) : null;
  },

  async setStatus(id, status) {
    await exec("UPDATE leads SET status = $1, updated_at = $2 WHERE id = $3", [
      status,
      new Date().toISOString(),
      id,
    ]);
  },

  async remove(id) {
    await exec("DELETE FROM leads WHERE id = $1", [id]);
  },

  async count() {
    const rows = await sql<{ status: string; n: number | string }>(
      "SELECT status, COUNT(*)::int AS n FROM leads GROUP BY status",
    );
    let total = 0;
    const byStatus: Record<string, number> = {};
    for (const row of rows) {
      const n = Number(row.n) || 0;
      byStatus[row.status] = n;
      total += n;
    }
    return { total, byStatus };
  },
};
