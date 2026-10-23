# Scalix Cloud — full service audit

**Project:** Fiat Law (`dee02caa-c9e0-4a80-9d27-f3849b0d8823`)
**Tester:** automated, at the operator's request
**Scope:** every Scalix Cloud service, exercised with realistic mock data
**Key used:** project-scoped Free Access Key (full data-plane scopes, no platform scopes)

Method: for each service, read the API reference page first, then exercise every
documented endpoint. Where a service has a read-back path, verify the write
actually took effect rather than trusting the status code. Mock data is prefixed
`fltest-` so it can be identified and removed afterwards.

Status legend: WORKS / WORKS-WITH-CAVEATS / BROKEN / NOT-ON-THIS-PLAN.

---

## The question that matters: what are these actually for?

The tests above prove *mechanism*. Here is what each service is *for*, per the
docs, and whether that purpose is actually served.

---

### ScalixNova (Postgres)
**Documented purpose:** managed Postgres 16/17/18 with branching, point-in-time
recovery, and scale-to-zero, so you can branch a database for a preview or a
test run and pay nothing while it sleeps.

**Real use case for Fiat Law:** the `leads` table is the firm's only durable
asset outside the website's own deploy. Branching would give a copy of real
production data for testing the brief engine without touching enquiries.
PITR covers the "someone deleted a lead" case. Scale-to-zero means an idle
preview costs only storage.

**Verdict: the core is genuinely good, and the key insight is real** — the
per-query cost breakdown (`compute_ms`/`pages_read`/`bytes_transferred`/
`estimated_usd`) and LSN branching are things neither Cloud SQL nor RDS gives
you. But see P0/P1 below: branching is create-only, and so is the branch's data.

---

### Storage
**Documented purpose:** S3-compatible object storage — upload, download, list,
presign — so you keep documents out of the database.

**Real use case:** CETA origin declarations, sponsor licence applications,
submitted PDFs, the site's own generated OG images. Presigned URLs exist so a
browser can upload a document without holding your API key.

**Verdict: WORKS-WITH-CAVEATS, and the caveat is fatal for files.** Bucket
lifecycle, listing, prefix filtering and presign all work. But every object
written comes back as a **JSON-wrapped Node Buffer**, so a 70-byte PNG is stored
as 224 bytes of `{"type":"Buffer","data":[…]}` and a 256-byte binary as 940
bytes. The bytes are recoverable if you know to unwrap them, and nothing tells
you to. For a law firm storing PDFs this makes the service unusable as-is.

---

### Key-Value
**Documented purpose:** a get/set/exists/list store with optional TTL, for
caching and sessions.

**Real use case:** caching a computed brief, a rate-limit counter, a
"has this email already submitted" check.

**Verdict: WORKS, and it is the cleanest thing on the platform.** All five
operations behave, JSON values round-trip, glob patterns work, and TTL expiry is
real — I set a key with `ttl: 1` and it was gone 3s later.

---

### Events
**Documented purpose:** pub/sub bus — create topics, publish, subscribe an
endpoint, track delivery.

**Real use case:** a submitted brief fires `lead.created`, which triggers a
notification, a Slack/email alert, and an audit trail. Subscriptions with
delivery tracking replace hand-rolled webhooks.

**Verdict: WORKS-WITH-CAVEATS.** Publish and read-back work and the event
payload survives intact. But subscriptions require an undocumented `config`
field, and topic sub-paths reject a topic *name* despite the docs saying
"Topic id or name".

---

### Functions
**Documented purpose:** serverless functions — deploy, invoke, read logs and
invocation history.

**Real use case:** the brief engine, a nightly re-score of leads, a webhook
receiver. Runtime is `node` or `python`.

**Verdict: WORKS.** Create, invoke, list invocations, get, delete all behaved.
Two notes: the runtime accepts `node`/`python` only (not `nodejs22`), and
`createFunction` is also the deploy verb — there is no separate deploy step.

---

### Scalix AI
**Documented purpose:** OpenAI-compatible inference, embeddings, and a model
catalog.

**Real use case:** summarising a CETA article, classifying an enquiry,
generating an embedding for document search.

**Verdict: WORKS.** Chat completions returned correct content ("PONG" for
"Reply with exactly: PONG"), embeddings returned a real vector, and the model
list is OpenRouter-shaped. `nl-to-sql` generated correct, executable SQL.

---

### Computers
**Documented purpose:** persistent Linux machines whose root disk and IP survive
stop/start; only DELETE reclaims the disk. File read/write, SSH key management,
and an idempotent `by-name` create are all documented.

**Real use case:** a long-running job, a reproducible environment for the
research library, or a box an agent can work in over SSH.

**Verdict: WORKS, and this is the most genuinely useful compute primitive I
tested.** Real Ubuntu 24.04 as root, `apt-get install python3` succeeded from
the public archive, and it reached both `api.scalix.world` and the deployed
website from inside Scalix's network. `by-name` idempotency works exactly as
promised (200 existing / 201 new). **Two flaws:** `exec` rejects any command
with arguments until you discover the undocumented `args` field, and `/files`
PUT returned success while GET reported `exists: false`.

---

### Sandboxes
**Documented purpose:** ephemeral microVMs for agent code execution — run a
command, write files, read them back, extend the deadline. Disposable; nothing
persists past stop. Snapshots are explicitly not available (demand-gated).

**Real use case:** running untrusted or generated code safely.

**Verdict: BROKEN as it stands.** Create works and returns PROVISIONING. But
`/commands` needs an undocumented `cmd`+`args` split, and **DELETE returns 204
while the sandbox persists in `STOPPED` forever.** I cleaned one sandbox four
times with 204s and it is still listed. Since these are the primitive an agent
uses to execute code, an undeletable sandbox leaks a worker per invocation.
Snapshots returning 501 is honest gating, not a defect.

---

### Registry
**Documented purpose:** OCI container registry hosting pushed images.

**Verdict: WORKS.** Lists the built images, including `fiat-law`.

---

### Build
**Documented purpose:** build a container image from source, pushing to the
registry.

**Verdict: WORKS, and it is the least interesting service to test because it
simply does what it says.** Upload a tarball, get a registry ref. Note the API
reference lists no way to *create* a service from a build — you go to Run.

---

### Run
**Documented purpose:** deployed container services with revisions, env,
private DNS, scale-to-zero (min 0).

**Verdict: WORKS.** This is what is serving the site today at
`https://fiat-law.run.scalix.world`. One caveat: `run deploy` refuses a name
that already exists globally, so rolling a new image means delete-and-recreate,
not update-in-place.

---

### Domains & SSL
**Documented purpose:** custom domain management with automatic SSL.

**Verdict: WORKS-WITH-CAVEATS.** Add a domain, get a verification token, see
`ssl_status`. Cannot verify the SSL issuance path without controlling DNS for a
real domain, which I do not have.

---

### Cron
**Documented purpose:** scheduled jobs — create, update, trigger, and review
execution history. `action_type` is `function` or `webhook`.

**Real use case:** the nightly re-score of stale leads, the weekly check that
a CETA tariff commitment has not changed, the monthly reminder to review a
sponsor licence's threshold date.

**Verdict: WORKS, and better than I expected.** All 8 operations behaved,
including a manual `trigger` that returned a real execution record with
`status: running` and an `executions` history endpoint. Pausing via update
(`enabled: false`) worked. Two defects: the request shape is undocumented —
you need the odd pair `action_type` (a string) plus a separate `action_config`
object — and `action_type` accepts only `function` or `webhook`, though the
error message says exactly that, which is at least honest.

### Webhooks
**Documented purpose:** register an endpoint URL for tenant event types, test
it, and inspect delivery attempts.

**Verdict: BROKEN until the schema is documented.** `GET` works. `POST` fails
on every body I could construct. `event_types` is rejected as an unknown field;
`events` is accepted but only as a sequence, and no element shape I tried
(`{event}`, `{name}`, `{topic}`, `{event_type}`) satisfied it. The API reference
calls the schema `WebhookRequest` and never defines it. I could not register a
single webhook, which means the documented `test` and `deliveries` endpoints are
unreachable too — you cannot get an id.

---

### Compute
**Documented purpose:** container deployments under `/v1/compute/*`.

**Verdict: NOT-ON-THIS-PLAN, honestly.** Returns
`501 COMPUTE_COMING_SOON` with a helpful message pointing at Run and Functions.
This is a clean, well-designed gate rather than a broken endpoint.

---

### MCP tools
**Documented purpose:** agent-facing database operations over MCP.

**Verdict: WORKS-WITH-CAVEATS.** `db_schema`, `db_optimize`, `db_pii`,
`db_table`, `db_relationships`, `db_search_columns`, `db_text_to_sql` all work
well. **But `db_query` silently returns an empty result set when passed the
`query` argument** — only `sql` works. For an agent that is a correctness bug
that looks like a successful answer.

---

### Platform status (`scalix_status` MCP tool)
**Verdict: WORKS.** Returns a real health dashboard: `overall: operational`,
`active_incidents: 0`, and ten components with live latencies — `api` 190ms,
`database` 170ms, `agents` 162ms, `chat` 172ms, `cache` 0.37ms, `console` 186ms,
`dns` 191ms, and the slower static sides `docs` 693ms, `website` 679ms,
`prime` 651ms. This is the one place the platform is transparent about its own
performance and it works well.

Note it reports `prime` as a live, healthy component — which contradicts the
404 I get on every Prime path I guessed. Prime exists as infrastructure; its
API surface is simply not where I looked.

---
### Not reachable at all

**This section was wrong and is recorded as a correction, not a finding.**

Everything listed here as unreachable exists and works. I had guessed paths,
got 404s, and reported absence — the correct reading of a 404 on an invented
path is "I guessed wrong", not "this does not exist". The authoritative
inventory was available the whole time: `scalix-cloud api --help` lists the
full OpenAPI tag set, and each service sits at `/v1/*` rather than the
`/api/v1/*` I assumed.

Confirmed present and working after correction:

| Service | Real base path | Verdict |
|---|---|---|
| Search | `/v1/search` | Query **works**; sources/stats/ingest **500** |
| Shield | `/v1/shield` | **WORKS** — config, crawlers, stats, robots.txt, events |
| Compliance | `/v1/compliance` | **WORKS** — status, audit log, export, GDPR |
| Integrations | `/v1/integrations` | **WORKS** — list, GitHub installations/repos |
| Load Balancer | `/v1/lb` | **WORKS** — create, add backend, delete |
| Encryption | `/api/v1/encryption` | **WORKS** — round-trip verified |
| Migrations | `/api/v1/tenants/{id}/migrations` | plan works; **register body unconstructible** |
| Realtime | `/api/v1/tenants/{id}/realtime` | **WORKS** — subscribe on `{table}` |
| Environment | `/v1/env` | **WORKS** — full CRUD with `is_secret` |
| Metering | `/api/v1/usage`, `/v1/usage/keys` | keys works; summary needs operator privilege |
| Auth | `/v1/auth/*` | present (login, magic-link, MFA, anonymous) — not exercised |
| Crews | MCP only | present — `crew_list` returns empty |
| Projects | MCP only | present — lists the org's projects |

The remaining gap is Prime, which appears as a healthy component in
`scalix_status` but whose API path I still have not located.

---

## The API surface, CLI, SDK and dev tooling

### The CLI is the best-documented interface on the platform

`scalix-cloud --help` exposes 27 top-level commands including Search, Shield,
Compliance, Usage, Migrate, Export and Domain — several of which have no
reachable REST path that I could find. The single most useful thing it ships is:

```
scalix-cloud api <tag> <op> [--params]     # full OpenAPI-spec coverage
```

This is the authoritative endpoint inventory and it resolves the
path-prefix confusion that cost me most of the session. **Every operation prints
its method and exact path**, which is what the docs site fails to do.

### Defects in the tooling

1. **`scalix-cloud deploy` is stubbed out.** It reports "not yet available —
   builds run from a connected Git repo", yet `POST /v1/build/upload` works and
   is how the site was actually built. A CLI command that refuses its own
   platform's working path is misleading.

2. **`scalix-cloud logs <name>` fails where every other `run` subcommand accepts a name.** It requires the service UUID.

3. **`run logs` requires a UUID, not a name.** `scalix-cloud run logs <name>`
   fails; the same call with the service id works. Every other run subcommand
   accepts a name. Small, but it cost me a debugging cycle.

4. **No branch commands.** The CLI has `db` subcommands but nothing for
   branching or PITR, which are Nova's headline features. You must drop to raw
   `curl`.

### API surface hygiene

Verified against documented claims:

- **Rate-limit headers are real.** `x-ratelimit-limit: 200`,
  `x-ratelimit-remaining`, `x-ratelimit-reset` are present, plus
  `access-control-expose-headers` naming them. This claim in the docs is honest.
- **The documented success envelope is not.** The reference says responses are
  `{data: ..., request_id: ...}`. Actual success responses are bare JSON —
  `GET /v1/storage/buckets` returns `[]`. `request_id` appears only on errors.
- **`docs_url` on errors works**, and is specific
  (`/errors/api-key-expired`). Good.
- **Plan limits are discoverable.** `/v1/me` returns
  `{plan: "chat_plus", rate_limit_rps: 20, api_keys_max: 3, connected_apps_max: 2}`,
  which is genuinely useful and not in the docs at that level of detail.
- **Real encryption at rest.** `GET /v1/compliance/status` reports
  `AES-GCM encryption enabled for data at rest`, and the Encryption API
  round-trips: `"client-ref-2026-AB123456"` → 130-char hex ciphertext →
  identical plaintext. This claim is verified, not just asserted.

### The SDK

`@scalix-world/sdk` is shown in the Connecting docs with an `executeSql` helper
and the same auth-header pattern. I did not install or exercise it — the REST
surface covered everything I needed. Worth a dedicated pass if you are
evaluating it, since the SDK is the surface a real integration would use.

---

## Documentation quality, assessed — corrected after verification

An earlier draft of this report claimed several things were undocumented. On
checking, four of those claims were **wrong**. Both the errors and the
corrections are recorded, because the corrections make Scalix look better and
the user needs the accurate picture.

### What I wrongly claimed was missing, and is not

| I claimed | Verdict | Evidence |
|---|---|---|
| No backup schedule / retention / RPO | **WRONG** | `/database/backups`: "nightly encrypted backups that are replicated off-site to EU-located storage", "Configurable retention (default: 7 days)", "WAL is archived on a five-minute bound... the most recent restorable point is typically within five minutes of your latest write" |
| No exit or export path | **WRONG** | `/migrate`: "Every migration is reversible. Full export is always available (`scalix-cloud export all`), so you are not locked in." Plus pg_dump over the wire endpoint, and Terms §7: "On termination you may export your data within 30 days" |
| No error catalogue | **WRONG** | `/api-reference/errors`: full catalogue of 14 codes — AUTH_FAILED, FORBIDDEN, BAD_REQUEST, VALIDATION_ERROR, NOT_FOUND, ALREADY_EXISTS, PAYLOAD_TOO_LARGE, RATE_LIMITED, NOT_CONFIGURED, INTERNAL_ERROR, BAD_GATEWAY, GATEWAY_TIMEOUT, QUERY_BLOCKED, QUERY_ERROR |
| No version/upgrade policy | **WRONG** (for Postgres) | `/database/versions`: new majors "within roughly 90 days of the community GA release"; at EOL "a six-month migration window with advance notice"; default changes "announced at least 60 days ahead" |
| No data-residency statement | **WRONG** | `/security`: "Deployed on dedicated servers in the EU (Hetzner, ISO 27001-certified data centres) — no hyperscaler, no shared tenancy at the host layer"; GDPR and India DPDP both addressed; subprocessor list published |

### What is genuinely absent, verified

1. **No uptime SLA.** Terms §6 is explicit and honest: *"We do not currently offer contractual uptime guarantees. Availability commitments for Enterprise agreements are available on request."* No percentage appears in docs, terms, pricing or DPA. Pricing lists support-response times (48h / 4h / 1h) but nothing about uptime. **This is the single most material gap for a hyperscaler-alternative decision.**

2. **No RTO.** RPO is documented (five-minute WAL bound); a recovery *time* objective is not, anywhere. `/database/backups` even states "routine restore drills are being operationalized" — candid, but it means the recovery path is unproven.

3. **No changelog.** `scalix.world/changelog` is a placeholder: "Changelog: in development / ETA: soon. We ship fast." Zero entries.

4. **No API deprecation or breaking-change policy.** Only vague language in Terms §1 and §6 ("Features may evolve as the platform matures"; "Scalix Cloud is in public beta").

5. **No documented limits for the things that actually bite.** Rate limits (per plan, per rps, daily AI) and max API keys *are* documented. But **destructive-operation limits, worker-pool size, and maximum sandbox/computer/function counts appear nowhere** — and those are precisely the three I hit as hard failures. Only per-instance resource ranges are published (memory, vCPUs, timeout, payload).

6. **Scope catalogue is incomplete.** `/getting-started/authentication` says there are "64 named scopes" and shows ~17, stating "The console's key form shows the complete list". So the authoritative list is behind a login. Environment, System and Account API pages carry no scope column at all.

7. **The status page is unreadable to anything but a browser.** `status.scalix.world` returns "Enable JavaScript to view this page." with no fallback text, so it cannot be checked programmatically — odd for a platform whose status matters most during an incident.

### Notably honest, and worth crediting

- **SOC 2 stated plainly**: "audit engagement planned for Q4 2026. We hold no third-party certification today — when we do, the report will be available here and on request." Most vendors obfuscate this.
- **Public beta stated in the Terms**, not buried.
- A real vulnerability-disclosure commitment with timelines (24h ack, 7-day triage) and an acknowledged researcher.
- A published subprocessor list at `scalix.world/subprocessors`.

### The three surfaces, ranked

**MCP is best-in-class** (53/53 tools described, 111/111 properties, safety annotations, agent-aware prose). **The CLI reference is good** and documents shapes the REST reference omits, plus `api <tag> <op>` as the authoritative endpoint inventory. **The REST API reference is structurally excellent and incomplete** — the "Service endpoints" table covers 12 of ~45 services, and request schemas are referenced by name but never defined.

### The REST API reference is structurally good and substantively incomplete

Structure is genuinely strong: every operation has a consistent method / path /
auth / parameters table / responses table / operationId, and most errors carry a
`docs_url` pointing at a specific anchor. The **error messages themselves are the
best documentation on the platform** — they name the offending field and often the
accepted values:

```
missing required field `distance_metric`       field: "distance_metric"
unsupported runtime: nodejs22. supported: node, python
invalid target: unknown variant `time`, expected one of `lsn`, `timestamp`, `latest`
Invalid input: expected "ubuntu24"             (path: "image")
action_type must be 'function' or 'webhook'
```

That is better error design than most hyperscalers manage.

The gap is that **request schemas are never published.** Every operation says
`schema WebhookRequest` or `schema VectorUpsertRequest` and then never defines it.
That is what forced trial-and-error probing on Webhooks (never solved), Vectors,
Cron and PITR, and it is the root cause of most of the undocumented-field defects
above.

There are also flat contradictions, all verified:

- `/api-reference/authentication` promises an org-wide key works with
  `X-Scalix-Project` for databases and MCP. Both reject it.
- `/database/sql-queries` instructs "always use parameterized queries" — and
  parameterizing a null is exactly what breaks.
- Extensions are advertised as pre-installed (pgvector) but `CREATE EXTENSION`
  is blocked by the query firewall.
- Events topic endpoints are documented as accepting "Topic id or name", but the
  sub-paths require a UUID.
- Database delete is documented as 200 and returns 202.

### The MCP surface is better documented than the REST reference

Measured across all 53 tools: **53/53 carry a description, 53/53 carry an
`input_schema`, 111/111 declared properties carry their own description, and
53/53 carry safety annotations** (`readOnlyHint`, `destructiveHint`,
`idempotentHint`, `openWorldHint`). It reports `protocol_version 2025-06-18`,
which is the real MCP spec.

More importantly the descriptions are *agent-aware* — they describe correct
behaviour, not just fields. `scalix_crew_board_post` reads:

> "The board is news, not knowledge: set ttl_seconds so routine updates expire
> on their own, pin only what every future task must see, and set
> owner_member_id to hand work off to a specific member. Notes cannot be edited
> from here — post a correction instead."

That is documentation writing for a machine reader, and it is the best-written
text I found anywhere on the platform.

**The actionable conclusion: the REST reference should be generated from the same
schemas the MCP surface already publishes.** They have the information. The REST
docs simply do not show it, which is why I could not construct a valid webhook
body from the reference but could have from MCP.

Minor flaw: `destructiveHint: true` is set on 13 tools including
`scalix_db_query` and `scalix_fn_invoke`. A read-only SELECT is not destructive,
so an agent that gates confirmation on this hint will ask unnecessarily.

### Services discoverable only through MCP

`GET /api/v1/mcp` exposes 16 service groups. Three have no page in the docs
navigation and were absent from my initial audit:

- **Crews** (`scalix_crew_list`, `board_read`, `board_post`) — "a team of AI
  members that share a notice board". `crew_list` returns an empty list and
  works. No docs page found.
- **Projects** (`scalix_project_create`, `project_list`) — both work; listing
  returned the org's projects including Fiat Law. No docs page found.
- **Auth** (`scalix_auth_configure`) — requires an admin key, so untestable with
  the project key. Documented in the description, not the reference.

---

## Things that confused me, and cost time

This is the most useful section for the Scalix team. Each of these is a place
where the platform did not tell me something I needed, and I lost time or nearly
drew the wrong conclusion. Ordered by how much they cost.

### 1. `/api/v1/*` versus `/v1/*` — the one that mattered

Nova lives under `/api/v1/*`. Almost everything else lives under `/v1/*`. I
learned Nova first, generalised the prefix, and then spent most of the session
concluding that **fifteen services did not exist**. Search, Shield, Compliance,
Integrations, Load Balancer, Encryption, Migrations, Realtime, Metering and
Environment were all sitting at `/v1/*` the whole time.

The root cause is the API reference's "Service endpoints" table, which lists
twelve services and their paths. The other thirty-three have full pages in the
same navigation but no entry in that table. I trusted the table as the
inventory. It is not.

What would have fixed it: one line in the overview saying "most services are
under `/v1/*`; Nova, Encryption, Migrations and Realtime are under
`/api/v1/*`", or better, fixing the table to cover all forty-five.

### 2. Enums that are internally tagged, with no hint

Three separate APIs needed a shape I could not guess:

- PITR: `target` must be `{"type": "latest"}` or `{"type": "lsn", ...}` —
  the error eventually said `expected one of lsn, timestamp, latest`, which is
  how I found it. But only after four failed attempts.
- Cron: needs the odd pair `action_type` (a bare string) *plus* a separate
  `action_config` object. Nothing suggests these are a pair.
- Vectors: `batch/upsert` takes `entries[{..., embedding}]` — and the write and
  search paths are tenant-level, not collection-scoped, which is the opposite of
  what the resource naming implies.

The pattern is that these are Rust internally-tagged enums leaking through as
JSON. That's a fine server design; it's a poor API contract unless documented.

### 3. `command` plus `args`, not one string

`POST /v1/computers/{id}/exec` and Sandboxes' `/commands` both reject any command
containing arguments. `/usr/bin/id -u` returns
`No such file or directory (os error 2)`, which reads as "the binary is missing"
rather than "you passed a string where I wanted a split". The working shape is
`{command: "/usr/bin/id", args: ["-u"]}`.

I spent four attempts convinced the container simply had no `echo`.

### 4. The confirmation gate is invisible until it bites

Destructive SQL returns `428 CONFIRMATION_REQUIRED` with a `confirmation_token`
and an `X-Scalix-Confirm` header, expiring in 300s. Nowhere in the API
reference. Then, when I hit the free plan's **two destructive operations per
hour**, a `429 DESTRUCTIVE_RATE_LIMIT` told me `retry_after: 662`.

The interaction is the problem: I was doing cleanup, the limit silently exhausted,
and my own housekeeping blocked itself for eleven minutes. The gate is a good
safety feature. Surfacing it only after failure is not.

### 5. Success shapes that lie

Three separate places returned a success status while not doing the thing:

- `POST /v1/sandboxes/{id}/files` → 204, but the file never appeared.
- `PUT /v1/computers/{id}/files` → 200, then `GET .../files` returned
  `{"exists": false}`.
- `DELETE /v1/sandboxes/{id}` → 204, and the sandbox stayed in `STOPPED` forever.
- Storage `PUT` → 201 with a plausible `size_bytes`, but the stored object was
  the JSON encoding of a Node Buffer, so the number was wrong too.

A 204 or 201 that means "accepted, unverified" is worse than an error, because
the natural next step is to trust it.

### 6. `scalix` and `scalix-cloud` are two different products

I assumed the global `scalix` binary and `scalix-cloud` were competing Cloud
CLIs and wrote that up as a defect. It is not a Scalix Cloud issue at all: the
npm package `scalix@1.5.1` describes itself as "AI coding agent for the
terminal", which is **Scalix Coder**. The Cloud CLI is `scalix-cloud`, as the
CLI reference says.

This is still a documentation gap, but a different one: nothing in the Cloud
docs mentions that a separate product installs a similarly-named binary, which
is exactly how someone ends up confused. The local symlink also points at an
unbuilt checkout, but that is my environment's problem, not the platform's.

### 7. Endpoints that accept "id or name" but only accept ids

The Events reference says topic sub-paths take "Topic id or name". Publish,
subscriptions and events all reject a name with `Cannot parse 'id' with value
'fltest-events': UUID parsing failed`. `scalix-cloud run logs` is the same
story: every other `run` subcommand takes a name, `logs` needs the UUID.

### 8. Advertised but absent, and absent but advertised

- `/v1/me` lists 47 tools including `scalix_search` and `scalix_usage`. Calling
  either returns `tool ... is not available on this deployment`.
- Search's *query* endpoint works and returns good results, while its
  *management* endpoints (`/sources`, `/stats`, `/ingest/run`) all return 500.
- `scalix-cloud deploy` says "not yet available — builds run from a connected
  Git repo", while `POST /v1/build/upload` works and is how the site was built.
- Extensions are advertised as pre-installed (`pgvector`, `pg_trgm`,
  `uuid-ossp`) and the query firewall blocks `CREATE EXTENSION`.

### 9. The documented response envelope is not the actual one

The reference says responses look like `{"data": ..., "request_id": ...}`.
Success responses are bare JSON — `GET /v1/storage/buckets` returns `[]`.
`request_id` appears only on errors, which is backwards from the documentation
and means a client cannot correlate a successful call.

### 10. Minor mismatches

- Database delete documented as 200, actually 202.
- `/v1/usage` (summary) requires platform-operator privilege and 403s, while
  `scalix-cloud usage current` returns the same data fine. The successful path
  is the CLI, which is not where a developer would look first.
- `WebhookRequest` and `CronSchedule` schemas are referenced by name and never
  defined, so neither can be constructed from the reference alone.

---

## Feedback list, prioritised

**P0 — Storage corrupts every object it stores.** Binary round-trips fail; the
payload is wrapped in a JSON Buffer. Nothing binary can be stored safely, which
takes an S3-compatible store out of scope for documents, images and archives.

**P0 — Sandboxes cannot be deleted.** `DELETE /v1/sandboxes/{id}` returns 204
and the sandbox remains, permanently in `STOPPED`. Since a sandbox holds a
compute worker and there are only 20, this leaks the pool.

**P1 — Nova branches cannot be queried.** A branch returns an endpoint, but
connecting with that database name lands you on the parent; wire routing is by
API key, not database name. Branching therefore creates data you can never read.
This is also the strongest feature on the platform for CI/preview use cases.

**P1 — `exec` and `/commands` require an undocumented split.** Passing
`/usr/bin/id -u` fails with "No such file or directory". The working shape is
`{command, args}` (Computers) or `{cmd, args}` (Sandboxes). Neither is in the
docs, and neither error message hints at it.

**P2 — MCP `db_query` silently returns empty on `query`.** Should be an
explicit error, not a plausible-looking zero-row result.

**P2 — Undocumented confirmation gate.** Destructive SQL returns 428 with a
`X-Scalix-Confirm` header and a 2-per-hour limit on the free plan. The limit bit
me during cleanup and it is invisible until you hit it.

**P2 — Docs describe fields the API rejects, or omit fields it requires.**
`CREATE EXTENSION` is blocked although pgvector is advertised as pre-installed;
`display_name` on a topic 500s; advisory endpoints require `sql`, `query_rate`,
`error_rate`, `avg_response_time_ms`.

**P3 — `run deploy` cannot update in place.** A name collision returns 409
because names become DNS labels, so every rollout is delete-and-recreate.

**P3 — DELETE of a database returns 202; the reference says 200.**

**P1 — No uptime SLA, stated explicitly in Terms §6.** "We do not currently
offer contractual uptime guarantees. Availability commitments for Enterprise
agreements are available on request." No percentage appears in docs, terms,
pricing or DPA. More material to a hyperscaler-alternative evaluation than any
single bug, because it is a contract question rather than a code question.

**P2 — No RTO, and no completed restore drill.** RPO is documented (five-minute
WAL bound, seven-day default retention); a recovery *time* objective appears
nowhere, and `/database/backups` says "routine restore drills are being
operationalized". The recovery path is unproven.

**P2 — No changelog and no API deprecation policy.** `scalix.world/changelog` is
a placeholder ("in development / ETA: soon"). Terms offer only "Features may
evolve as the platform matures" and "Scalix Cloud is in public beta".

**P2 — The status page cannot be read programmatically.** `status.scalix.world`
returns "Enable JavaScript to view this page." with no text or JSON fallback.

**P3 — Undocumented hard limits.** Destructive-op rate, worker-pool size and
maximum sandbox/computer/function counts appear on no page, yet all three fail
hard when exceeded. Only per-instance resource ranges are published.

**P3 — Scope catalogue incomplete.** 64 scopes exist, ~17 documented, full list
only inside the console's key form.

**P0 — The API reference's "Service endpoints" table lists 12 of ~45 services.** Shield, Compliance, Search, Integrations, Load Balancer, Encryption, Migrations, Realtime, Metering and Environment have no entry in it, so an integrator building from that table concludes they do not exist. This table is the single most damaging documentation defect, and it caused roughly fifteen false negatives in the first draft of this audit.

**P1 — Search management endpoints all return 500.** `GET /v1/search/sources`, `GET /v1/search/stats` and `POST /v1/search/ingest/run` each return `INTERNAL_ERROR`, while `GET /v1/search?q=` returns correct results. The query path is complete; the admin path is dead, so a source cannot be configured at all.

**P2 — Two products install similarly-named binaries and the Cloud docs never say so.** `scalix@1.5.1` is Scalix Coder ("AI coding agent for the terminal"); `scalix-cloud@1.4.0` is the Cloud CLI. An earlier draft of this report wrongly called them competing Cloud CLIs. A single line in the Cloud CLI reference disambiguating them would prevent exactly that mistake.

**P3 — `scalix-cloud deploy` is stubbed out while the REST path it duplicates works.** It reports "not yet available — builds run from a connected Git repo", yet `POST /v1/build/upload` works and is how the Fiat Law image was built. `scalix-cloud logs <name>` also fails where every other run subcommand accepts a name.

**P3 — Migrations register body is unconstructible.** `name`, `id`, `version`, `sql`, `statements` and `operations` are all rejected; the plan endpoint works, so only the write path is affected.

**P2 — The success path for usage data is the CLI, not the API.** `GET /api/v1/usage` returns 403 "platform-operator privilege required", while `scalix-cloud usage current` returns 49 itemised metrics including `api_request_count`, `build_minutes`, `computer_starts`, `cu_seconds`, `db_egress_bytes` and per-model AI token counts. A developer reaching for the REST API first will conclude the data is unavailable. Consider documenting the CLI as the primary surface for metering, or granting the summary to project admins.

**P3 — `/v1/me` advertises tools the deployment does not serve.** It lists 47
tools including `scalix_search` and `scalix_usage`, but calling either returns
`tool 'scalix_search' is not available on this deployment`. The token endpoint
should report what is actually reachable, not an aspirational list.

**P3 — `WebhookRequest` is undocumented and unconstructible.** No request body
I could build passed validation, so the whole webhook surface — create, get,
update, test, deliveries — is dead on arrival for anyone reading only the docs.

**P3 — `CronSchedule` request shape is undocumented** (`action_type` +
`action_config` as a pair), though the service itself works correctly once you
guess it.

---

## What has to happen before this is really usable

Two lists: what blocks technical use, and what blocks a decision to trust it.
Then what to ask for, split by owner.

### Blocks technical use (their bugs, in order)

1. **Storage binary corruption** — P0. Every object comes back as a JSON-wrapped
   Node Buffer, so no PDF, image or archive can be stored safely. Blocks any
   document workflow.
2. **Nova branch queryability** — P1. Branches are created but unreachable, so
   the one feature that would let us test with production-shaped data cannot be
   used. This is the highest-value fix on the platform.
3. **`exec` / `commands` argument split** — P1. `{command, args}` is
   undocumented, so Computers and Sandboxes look broken to a first-time user.
4. **Sandbox delete** — P0 in general (leaks workers), but irrelevant to Fiat
   Law's actual workload. Ask, don't block on.
5. **MCP `db_query` silent empty** — P2 for us, P0 for agent use.

### Blocks a decision to trust it (documentation and contract)

1. **No uptime SLA** — Terms §6 disclaims contractual uptime. For a database
   holding client enquiries, this is the single biggest gap.
2. **No RTO, no demonstrated restore** — RPO is documented; recovery time is
   not, and "routine restore drills are being operationalized."
3. **Undocumented hard limits** — destructive-op rate, worker-pool size, max
   sandbox/computer counts. All three bit me as hard failures.
4. **Incomplete scope catalogue** — 64 scopes exist, ~17 documented, full list
   only inside the console.
5. **No changelog, no API deprecation policy**, and a JS-only status page.

### What we should ask them for

Ordered by what unblocks the most, phrased as requests:

**Fix-level**
1. Fix Storage's byte round-trip and add a binary round-trip assertion to CI, so
   a PNG in equals the same PNG out. Confirm the intended fix is at write time,
   not read time — the stored `size_bytes` was wrong too.
2. Make a branch reachable, or document the intended path. Currently
   `endpoint.database` does not connect to the branch, and the two doc pages
   contradict each other.
3. Fix sandbox `DELETE` returning 204 without deleting.
4. Document the `{command, args}` shape on both exec endpoints, and make the
   error message say "did you mean to split the arguments?" rather than
   "No such file or directory".

**Contract-level**
5. An Enterprise availability commitment in the agreement — a percentage, a
   measurement method, and a credit regime. Terms §6 says this is "available on
   request", so ask.
6. A stated RTO, plus the result of one documented restore drill. We should be
   allowed to run our own before go-live.
7. A limits table: destructive ops per hour per plan, worker-pool size, and
   maximum sandboxes, computers, functions and services per plan.
8. The full scope catalogue in the docs, or a machine-readable endpoint-to-scope
   mapping. We specifically need to know the minimum scope set for a production
   runtime key.
9. Written confirmation of the DPA and UK/EU transfer position for a UK law
   firm holding client personal data — the `/dpa` page exists but we should have
   it countersigned, not just published.
10. SOC 2 status and timeline (documented as "planned for Q4 2026"), plus whether
    an interim attestation exists.
11. Support ownership and response times on the plan we would actually buy, not
    the marketing tier.

**Docs-level (cheap fixes, high leverage)**
12. Generate the REST API reference from the OpenAPI schemas the CLI already
    ships. This fixes the missing-request-schema problem wholesale and would have
    prevented Webhooks, Cron, Vectors and PITR being unconstructible from the
    docs alone.
13. Fix the "Service endpoints" table in `/api-reference` to cover all ~45
    services. Its omission of 33 of them caused fifteen false negatives in the
    first draft of this audit.
14. Stand up a real changelog with an API deprecation and breaking-change notice
    policy.
15. Make `status.scalix.world` render a text or JSON fallback so it can be
    monitored programmatically.

### What we do ourselves, regardless

None of these need anything from Scalix:

1. **Mint a scoped-down runtime key.** The deployed service currently holds an
   owner-scope key with all 69 scopes including `database:admin`. The code's own
   design intent is `database:read` + `database:query` for the runtime, with
   `database:admin` used once for the migration. This is the most serious
   privilege problem we have and it is entirely ours to fix.
2. **Replace the admin password** I generated for the console test, which sits
   in plaintext in the service environment.
3. **Delete the six mock leads** from Nova.
4. **Clean up the second project** in the org (`xenolix-2025-4f96e682-default`)
   or confirm it is intentional.
5. **Run our own restore drill** once PITR works, before go-live.
6. **Schedule a nightly `pg_dump`** to our own storage, independent of Scalix, as
   insurance while we are on a beta platform with no uptime commitment. Export is
   documented and works, so this is cheap.
7. **Get Taylor Rose sign-off** on removing the SRA numbers before the boutique
   positioning goes live.

### A proportionate plan

Fiat Law's real load is one table and a handful of enquiries a week, so the
honest sequencing is not "reach enterprise parity":

**Phase 0 — this week, ours alone.** Scoped key, admin password, delete mock
leads, project hygiene, nightly pg_dump to our own storage. After Phase 0 the
site is safely running on Scalix for real traffic, with an independent backup and
a least-privilege key. **This phase needs nothing from them.**

**Phase 1 — on their blockers.** Storage round-trip fix and branch queryability.
Until Storage is fixed, we keep documents out of Scalix Storage and use our own
backing store. Until branches work, we test with synthetic data only.

**Phase 2 — before any real client data at rest.** Enterprise availability
commitment, stated RTO, our own restore drill passed, DPA countersigned. This is
the gate for the `leads` table holding genuine enquiries rather than test rows.

**Phase 3 — before depending on it day to day.** Limits table, scope catalogue,
changelog, fix the REST reference. This is what turns it from "works" into
"supportable", and it is mostly documentation, so it should be the cheapest phase
for them.

My recommendation: **run Phase 0 now and take their fixes as they land.** There
is no reason to wait for Phase 2/3 to start, because Phase 0 gives us the
insurance that makes a beta platform acceptable — least privilege, independent
backups, and a tested exit. That is the same posture we would take with any
pre-GA vendor, and it costs an afternoon.

---

## Coverage

Tested against endpoints: Nova (SQL, batch, branches, PITR, firewall,
extensions, 10 MCP tools, per-query cost metering), Storage, KV, Events,
Functions, AI, Domains, Registry, Build, Run, Compute, Sandboxes, Computers,
Vectors, Schema, Cron, Webhooks, PITR, platform health, Encryption, Compliance,
Environment, Metering, Load Balancer, Search, Shield, Integrations, Realtime and
Migrations.

**Still not located:** Prime appears as a healthy component in `scalix_status`
but I never found its API path. Auth (MCP only) and Crews (MCP only) are present
but not exercised. The SDK was not installed. The rest may exist under
prefixes I did not guess.

**Cleanup state:** computers, functions, cron schedules, event topics, domains,
KV keys, vector collections, webhooks, and storage buckets are all empty. Two
sandboxes remain in `STOPPED` because `DELETE` returns 204 without removing
them — see P0. The `fiat-law` Run service and the six mock leads are left in
place deliberately.
