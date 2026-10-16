/**
 * Lead store.
 *
 * The interface is deliberately narrow. Moving to Postgres, HubSpot, Salesforce
 * or anything else means reimplementing `LeadStore` in one file — nothing else
 * in the application touches the database.
 *
 * Two drivers ship: SQLite for local development, and ScalixNova (Postgres over
 * HTTP) for deployment. The driver is imported dynamically so that the Nova path
 * never loads better-sqlite3 — a native module we do not want inside the
 * container image.
 */

import "server-only";
import type { BriefAnswers, Recommendation } from "@/lib/brief/types";
import { PRIVACY_VERSION } from "@/lib/leads/privacy";

export type LeadStatus = "new" | "contacted" | "proposal_sent" | "instructed" | "declined";

export interface LeadSource {
  referrer?: string;
  landingPath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  updatedAt: string;
  kind: "brief" | "enquiry";
  segment: string | null;
  answers: BriefAnswers | null;
  recommendation: Recommendation | null;
  score: number;
  band: string;
  status: LeadStatus;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  source: LeadSource;
  durationMs: number | null;
  marketingConsent: boolean;
  privacyVersion: string;
}

export interface NewLead {
  kind: "brief" | "enquiry";
  segment?: string | null;
  answers?: BriefAnswers | null;
  recommendation?: Recommendation | null;
  score?: number;
  band?: string;
  name: string;
  role?: string;
  company?: string;
  email: string;
  phone?: string;
  notes?: string;
  source?: LeadSource;
  durationMs?: number | null;
  marketingConsent?: boolean;
}

export interface LeadStore {
  create(lead: NewLead): Promise<Lead>;
  list(opts?: { status?: LeadStatus; segment?: string; limit?: number }): Promise<Lead[]>;
  get(id: string): Promise<Lead | null>;
  setStatus(id: string, status: LeadStatus): Promise<void>;
  remove(id: string): Promise<void>;
  count(): Promise<{ total: number; byStatus: Record<string, number> }>;
}

export { PRIVACY_VERSION };

/* ------------------------------------------------ shared row mapping */

/**
 * The wire shape both drivers produce. Types are loose on purpose: SQLite has no
 * boolean and returns 0/1, Postgres returns true/false; Postgres BIGINT arrives
 * as a string once it has been through JSON; and a JSONB column comes back
 * already parsed while a TEXT one does not.
 */
export interface LeadRow {
  id: string;
  created_at: string;
  updated_at: string;
  kind: string;
  segment: string | null;
  answers: unknown;
  recommendation: unknown;
  score: number | string;
  band: string;
  status: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  source: unknown;
  duration_ms: number | string | null;
  marketing_consent: number | boolean;
  privacy_version: string;
}

/** Accepts a JSON string, an already-parsed object, or null. */
function parse<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value as T;
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function num(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    kind: row.kind as Lead["kind"],
    segment: row.segment,
    answers: parse<BriefAnswers | null>(row.answers, null),
    recommendation: parse<Recommendation | null>(row.recommendation, null),
    score: num(row.score) ?? 0,
    band: row.band,
    status: row.status as LeadStatus,
    name: row.name,
    role: row.role,
    company: row.company,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    source: parse<LeadSource>(row.source, {}),
    durationMs: num(row.duration_ms),
    marketingConsent: row.marketing_consent === 1 || row.marketing_consent === true,
    privacyVersion: row.privacy_version,
  };
}

/**
 * Reference shown to the client and used as the primary key. Generated in the
 * application rather than the database so both drivers mint identical ids.
 */
export function newLeadId(now: string): string {
  return `FL-${now.slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/* ------------------------------------------------------ driver selection */

export type LeadDriver = "sqlite" | "nova";

/**
 * Explicit LEADS_DRIVER wins. Otherwise infer: a Nova key means we are deployed,
 * no key means a developer laptop. Inferring beats defaulting to SQLite, because
 * a missing env var in production would silently write leads to a container
 * filesystem that is discarded on the next deploy.
 */
export function resolveDriver(): LeadDriver {
  const explicit = process.env.LEADS_DRIVER?.trim().toLowerCase();
  if (explicit === "nova" || explicit === "sqlite") return explicit;
  return process.env.SCALIX_API_KEY ? "nova" : "sqlite";
}

let driverPromise: Promise<LeadStore> | null = null;

function driver(): Promise<LeadStore> {
  if (!driverPromise) {
    driverPromise =
      resolveDriver() === "nova"
        ? import("./store-nova").then((m) => m.novaLeadStore)
        : import("./store-sqlite").then((m) => m.sqliteLeadStore);
  }
  return driverPromise;
}

export const leadStore: LeadStore = {
  async create(lead) {
    return (await driver()).create(lead);
  },
  async list(opts) {
    return (await driver()).list(opts);
  },
  async get(id) {
    return (await driver()).get(id);
  },
  async setStatus(id, status) {
    return (await driver()).setStatus(id, status);
  },
  async remove(id) {
    return (await driver()).remove(id);
  },
  async count() {
    return (await driver()).count();
  },
};
