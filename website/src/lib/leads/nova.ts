/**
 * Minimal ScalixNova client.
 *
 * Nova is Postgres reached over HTTP rather than a socket, so there is no pool
 * and no driver — one POST per statement. `rows` come back as arrays aligned to
 * `columns`, which is why everything here zips them into objects before use.
 */

import "server-only";

const DEFAULT_BASE = "https://api.scalix.world";

export interface NovaColumn {
  name: string;
  type_oid: number;
  type_name: string;
}

interface NovaResponse {
  columns: NovaColumn[];
  rows: unknown[][];
  row_count: number;
  command: string;
  duration_ms?: number;
}

export class NovaError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "NovaError";
  }
}

function config() {
  const key = process.env.SCALIX_API_KEY;
  if (!key) {
    throw new NovaError(
      "SCALIX_API_KEY is not set. The Nova lead store cannot run without a project-scoped Scalix key.",
      0,
    );
  }
  const base = (process.env.SCALIX_API_URL ?? DEFAULT_BASE).replace(/\/+$/, "");
  return { key, url: `${base}/api/v1/sql` };
}

/**
 * Run one statement. `params` are bound positionally as $1, $2, … — every call
 * site in this application uses them, so no lead value is ever concatenated
 * into SQL.
 */
export async function sql<T = Record<string, unknown>>(query: string, params: unknown[] = []): Promise<T[]> {
  const { key, url } = config();

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(params.length ? { query, params } : { query }),
      cache: "no-store",
    });
  } catch (cause) {
    throw new NovaError(`Could not reach Nova at ${url}: ${(cause as Error).message}`, 0);
  }

  const text = await response.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new NovaError(`Nova returned a non-JSON response (${response.status}): ${text.slice(0, 300)}`, response.status);
  }

  if (!response.ok) {
    const err = body as { error?: string; code?: string; request_id?: string };
    throw new NovaError(err.error ?? `Nova request failed with ${response.status}`, response.status, err.request_id);
  }

  const result = body as NovaResponse;
  if (!Array.isArray(result.rows) || !Array.isArray(result.columns)) return [];

  // Zip: the wire format is column metadata plus positional cells.
  const names = result.columns.map((c) => c.name);
  return result.rows.map((cells) => {
    const row: Record<string, unknown> = {};
    names.forEach((name, i) => {
      row[name] = cells[i];
    });
    return row as T;
  });
}

/** Statements with no result set worth reading. */
export async function exec(query: string, params: unknown[] = []): Promise<void> {
  await sql(query, params);
}
