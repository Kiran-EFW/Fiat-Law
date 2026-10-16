# Fiat Law — Website Vision

**Version 1.0 · 4 August 2026**

The brief: a world-class website for Fiat Law that attracts high-value clients,
understands what each visitor actually needs, categorises them, and delivers a
personalised service scope at a custom cost. Same logo, Janeevan front and centre.

This document is the reasoning behind the build. The build follows it.

---

## 1. What is wrong with the site today

The current fiatlaw.co.uk is a Carrd one-pager. Measured against the standard the
brief sets, it fails on every axis at once:

| | Today |
|---|---|
| Page title | `Janeevan` |
| Meta description | `Jon` |
| Postcode | `1G2 7HU` — typo for IG2 7HU |
| Contact email | `user@domain.ext` — an unedited placeholder |
| Social links | Dead |
| Service copy | Truncated mid-word: *"Share purchase agreemen"* |
| SRA number | Absent |
| Privacy policy, cookie notice, complaints procedure, terms | All absent |
| Last modified | October 2024 |

For a firm asking Indian corporates to trust it with their UK entity, their directors'
identities and their money, this is disqualifying before a word of the pitch is read.
An Indian general counsel doing supplier diligence closes that tab.

Two assets on the page are genuinely good and both carry forward: the logo — crimson
concentric arcs, "FIAT LAW | LEGAL SERVICES" — and Janeevan's portrait, shot against
classical London stone. Editorial quality, correct register. Everything else is replaced.

---

## 2. Positioning

Research into the India–UK corridor produced three findings that decide the positioning.

**The stated bundle is not differentiated.** Incorporation, registered office, director
services, legal, accounting and M&A are already sold as a package by Goodwille,
Elemental CoSec, Oury Clark, MHA and Child & Child. Incorporation alone is a £99.99
commodity from ACSP-registered agents with better UX than any law firm will build.
Leading with the bundle is an argument lost on every call.

**Two ideas in the original brief are actively unsafe to market.** A UK company does
not require a UK-resident director — Companies Act 2006 s.155 requires a natural
person, not a resident — so selling "UK resident director" as a requirement is
misleading. And a nominee cannot be a sponsor licence Authorising Officer: sponsor
guidance L4.33 says the AO must be a paid member of staff or office holder and "you
cannot appoint a representative or somebody from another organisation to fill this
role." Marketing it that way fails, and fails visibly.

**The defensible position is the seam nobody owns.** The Global Business Mobility UK
Expansion Worker route requires a UK footprint, and sponsor guidance GBM3.4 says a
Companies House reference number is sufficient to show it. So immigration and
incorporation are literally the same transaction — and almost nobody sells them as one.
Layer on what changed this year: the CETA entered into force 15 July 2026, the Double
Contribution Convention now runs 60 months, and ECCTA identity verification is a dated,
non-optional obligation falling on the directors of ~1,912 Indian-owned UK companies,
most of them resident in India.

### The positioning line

> **The UK entry practice for Indian businesses — where the immigration route, the
> entity and the compliance are handled as one instruction, not three suppliers.**

### What the site must never claim

Free public bodies — DBT, London & Partners, Invest NI, Scottish Development
International — give away market intelligence, introductions, site visits and salary
benchmarking, and DBT's Investment Support Directory trains every inbound Indian
corporate to expect a **free first hour** from a professional firm. Willingness to pay
for orientation has been compressed to roughly zero.

So the site gives orientation away deliberately and generously, and never implies it is
the product. The product is execution, signature and liability: the things every one of
those bodies disclaims in writing.

---

## 3. The regulatory frame the site is built inside

This is not decoration. It determines the copy.

Companies House shows **FIAT LAW UK LTD, company 13662562** — not an SRA-regulated
firm. **Janeevan John, SRA ID 443287**, admitted 2 July 2007, practises as a consultant
at **Taylor Rose Limited, SRA 623604**, a licensed ABS.

The site therefore presents **two distinct capacities, always distinguishable**:

- **Fiat Law** — corporate services and advisory: entity structuring support, registered
  office, company secretarial, coordination, project management of a UK entry.
- **Janeevan John, solicitor, practising through Taylor Rose Limited** — reserved and
  regulated legal work, under Taylor Rose's authorisation, insurance and complaints
  procedure.

Holding the company out as a solicitors' practice when it is not authorised engages
Legal Services Act 2007 s.14. The site will not do it. Every page footer carries both
identities; the engagement pages state which entity is instructed for what; and the
qualification flow labels each recommended step with the capacity it is delivered in.

Four further constraints are wired into the build rather than left to memory:

1. **Immigration advice** — giving it unregistered is a criminal offence under
   Immigration and Asylum Act 1999 s.84. Every immigration page names the authorised
   capacity it is given in.
2. **M&A** — arranging deals in investments is FSMA-regulated. Corporate work is
   described as legal advice on transaction documents, not as arranging or advising on
   investments.
3. **TCSP** — registered office, company formation, and acting as or arranging a
   director are MLR 2017 activities requiring HMRC supervision. MLR reg 56 prohibits
   trading before HMRC confirms registration. The site does not offer these until the
   supervision position is confirmed; they sit behind a config flag.
4. **Registered office** — Companies Act 2006 s.86 requires an "appropriate address".
   PO boxes are banned. Any address offered must be real and inspectable, because Home
   Office compliance officers visit it under sponsor guidance L8.20.

A single file, `src/config/firm.ts`, holds every regulatory identifier, and a
`capabilities` block switches whole sections on and off. Nothing about the firm's
regulated status is hardcoded into a component.

---

## 4. Who the clients are — the segmentation model

Personalisation is only as good as the segmentation underneath it. Seven segments, each
with a genuinely different problem, sequence and buying trigger.

### A · Bridgehead
*Indian company, no UK presence, testing the market.*
Wants one or two people in London and a credible address. Trigger: a first UK customer
or a pilot contract. Needs incorporation, an appropriate registered office, bank
account introduction, PAYE/VAT, first hire. The Expansion Worker route is usually the
right vehicle and they do not know it exists.

### B · Establisher — *the core segment*
*Indian mid-cap committing to a UK subsidiary with staff.*
Trigger: board approval, or a contract too large to service remotely. Needs the
subsidiary, a sponsor licence, Expansion Worker converting to Senior or Specialist
Worker, payroll, VAT and PAYE, statutory accounts, and DCC planning. This is where the
immigration-plus-entity thesis pays, and where the two-year Expansion Worker cliff
(GBM3.38) makes sequencing genuinely valuable.

### C · Exporter
*Indian manufacturer or exporter using CETA tariff preference.*
May need little or no UK footprint. Needs rules of origin and self-certification,
customs classification, VAT — and the point they always miss, that the registration
threshold for a non-established taxable person is **nil**, so they register from the
first pound. Plus distributor and agency contracts, and product compliance. Watch UK
CBAM from 1 January 2027: five sectors, no India exemption.

### D · Acquirer
*Indian corporate buying a UK business.*
Trigger: an identified target or a mandate. Needs transaction legal work, due
diligence, warranties and indemnities, employment and TUPE, National Security and
Investment Act screening, and post-completion integration. Highest value per
instruction, lowest frequency. Regulated-capacity work, and the FSMA perimeter is
respected in the copy.

### E · Established operator
*Already one of the ~1,912 Indian-owned UK companies.*
Trigger is a **date**, not an ambition: ECCTA identity verification for directors and
PSCs who are sitting in Pune and Bengaluru. Also ongoing company secretarial,
confirmation statements, compliance remediation, restructuring, disputes. The most
reachable segment because the obligation is externally imposed.

### F · Founder or principal
*An individual moving, investing or relocating a family.*
Global Talent, Innovator Founder, Skilled Worker, ILR and naturalisation; plus private
client — wills, property, family. Note that Global Talent requires no UK entity, no
address, no sponsor and no job offer, so this segment can bypass the corporate product
entirely. The site says so honestly; that honesty is what wins the rest of the work.

### G · Referral partner
*Indian law firms, chartered accountants, chambers of commerce, investment promotion
agencies.*
Not buying for themselves. Needs a completely different page: how the referral works,
what stays with them, what Fiat Law will and will not do, and — because Indian firms
cannot practise English law and UK firms got nothing reciprocal in India — a clean
statement of the professional boundary.

### Cross-cutting attributes

Captured alongside the segment, because they change the recommendation more than the
segment does:

- **Urgency** — exploring / this quarter / within 30 days / already late
- **UK entity status** — none / branch / subsidiary / dormant / non-compliant
- **People in the UK** — none / need to move / already here / hiring locally
- **Sector** — mapped to the CETA sector analysis
- **Scale** — headcount and turnover band of the Indian parent
- **Origin** — city and state, so follow-up runs on the right clock

---

## 5. The personalisation engine

### What the visitor gets

A short, well-made intake — the **UK Entry Brief**. Six to nine questions depending on
the path, adaptive, no dead ends, no wall of fields. It never asks anything it can
infer.

It produces a personalised brief on screen and by email:

1. **Your position, restated.** Proof we listened. Segment, entity status, people
   position, sector, timing.
2. **The route that fits, and why.** Named. Expansion Worker versus Senior or Specialist
   versus Global Talent versus no visa at all.
3. **The sequence, in order, with realistic elapsed time.** Including the constraints
   nobody volunteers: bank account opening runs six to eight weeks and is the true
   critical path; a sponsor licence is about eight weeks standard, ten working days with
   the £750 priority service; the Expansion Worker licence is non-renewable and expires
   after four years, with the CoS allocation dropping to zero if there is no full UK
   trading presence within two years.
4. **The specific obstacles this profile will hit.** Segment-specific and precise. The
   nil VAT threshold for non-established taxable persons. The DCC transitional trap for
   anyone already on assignment on 15 July 2026. The fact that India did not receive the
   Japan/Australia waiver of the twelve-month prior-employment condition. That Service
   Supplier requires the *UK client* to be the A-rated sponsor.
5. **What Fiat Law does at each step — and in which capacity.** Fiat Law, or Janeevan
   as a solicitor at Taylor Rose. Labelled every time.
6. **What we need from you.** Documents, decisions, lead times.
7. **A single call to action:** request a written proposal.

**No prices anywhere.** Per the decision taken: the brief builds a personalised scope;
the fee arrives in the written proposal, priced to that scope. What the brief gives
away is the sequence and the traps, which is worth more than a number and costs
nothing to give.

### Why this earns its place

DBT has trained the market to expect a free first hour. This *is* that free first hour,
delivered before anyone spends it, at zero marginal cost, at three in the morning
Bengaluru time. The prospect arrives at the call already qualified and already holding
a scope. The call is about fee and start date.

### What the firm gets

Every submission is stored structured, scored and routed:

- **Segment** and all cross-cutting attributes
- **Priority score** — weighted on segment value, urgency, scale and completeness
- **Recommended route and scope** — exactly what the client saw, so the proposal starts
  from the same page
- **Provenance** — referrer, UTM, landing page, timestamps, time-to-complete
- **Follow-up state** — new / contacted / proposal sent / instructed / declined

Stored in SQLite behind a narrow adapter interface, so moving to a real CRM is one file.
An authenticated `/admin` view lists, filters and exports. That is the "organising the
data" half of the brief, and it is what makes the personalisation compound: the more
briefs completed, the better the segment model gets.

---

## 6. Service architecture

Six practice areas, each mapped to the segments that buy it and labelled with the
capacity it is delivered in.

| Service | Primary segments | Capacity |
|---|---|---|
| **UK entry & entity** — branch vs subsidiary, incorporation, ECCTA identity verification, registered office, company secretarial | A, B, E | Fiat Law · TCSP items gated on supervision |
| **Business immigration** — sponsor licence, UK Expansion Worker, Senior or Specialist Worker, Global Talent, Innovator Founder, compliance | A, B, F | Authorised capacity, named |
| **Corporate & commercial** — shareholders' agreements, share purchase, distribution and agency, commercial contracts | B, C, D | Solicitor · Taylor Rose |
| **Mergers & acquisitions** — transaction documents, due diligence, warranties, NSIA, integration | D | Solicitor · Taylor Rose · FSMA perimeter respected |
| **Accounting & compliance** — PAYE, VAT including the NETP nil threshold, payroll, statutory accounts, confirmation statements | A, B, C, E | Fiat Law + named partners |
| **Trade under CETA** — rules of origin, self-certification, tariff preference, customs, CBAM readiness | C | Fiat Law |

Each page is structured the same way: *the problem in this client's words → what
actually happens → the specific traps → what we do → how to start*. No stock imagery,
no "we are passionate about". Concrete provisions, named routes, real timelines.

---

## 7. The India–UK CETA hub

A substantial, genuinely useful public resource built from the 306-document primary
source library already assembled — the full CETA legal text, the Impact Assessment, the
Immigration Rules, the implementing statutory instruments, the Indian customs
notifications.

This is the credibility engine and the organic acquisition channel. Nobody else in this
corridor has the sources on hand. Concretely:

- What entered into force on 15 July 2026, and what did not
- Mobility: what changed versus what the bound floor merely permits
- The Double Contribution Convention: 60 months, and why the marginal value is months
  13 to 60 — the UK already gave a unilateral 52-week exemption under SSCR 2001
  regs 145(2) and 146
- Rules of origin, and the live drafting conflict between DGFT PN 19/2026-27 condition 3
  and Rule 16(1)(b) of Notification 62/2026-Customs (N.T.)
- Sector-by-sector: who benefits, and when
- What CETA does **not** contain — no investment chapter, no ISDS, no CBAM provision

Every claim cites its primary source. Nothing sourced from a competitor's blog.

---

## 8. Information architecture

```
/                          Home — positioning, segment doors, Janeevan, CTA
/services                  Overview
  /services/[slug]         Six practice areas
/uk-entry-brief            The qualification flow
  /uk-entry-brief/result   Personalised brief
/india-uk                  CETA hub
  /india-uk/[slug]         Deep-dive articles
/about                     Janeevan — the practitioner page
/insights                  Editorial
  /insights/[slug]
/partners                  Referral partners (segment G)
/contact
/legal/regulatory          Regulatory information — both entities, both SRA numbers
/legal/complaints          Complaints procedure, Legal Ombudsman route
/legal/privacy
/legal/cookies
/legal/terms
/admin/leads               Authenticated lead intelligence
```

Two navigation modes, deliberately. **By need** — "I need to set up in the UK", "I need
to move people", "I need to buy a business", "I already have a UK company". And **by
service**, for people who know what they want. Segment doors on the homepage route
straight into the brief with the segment pre-selected.

---

## 9. Design system

The register is *senior counsel*, not *startup*. Restraint reads as expensive.

**Colour**, taken from the existing logo, which grades from `#480000` to `#983040`:

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0B0B0C` | Primary text, dark sections |
| `crimson-700` | `#6E141F` | Deep brand |
| `crimson-600` | `#8B1E2D` | **Primary** — the logo's core red |
| `crimson-500` | `#A5293A` | Hover, accents |
| `bone` | `#F7F5F2` | Page ground — warm, never pure white |
| `stone-*` | greys | Borders, secondary text |
| `gold` | `#B08D57` | Rare. Rules and marks only |

**Type.** Newsreader for display and editorial body — a serif with real authority at
large sizes and genuine readability at 18px. Inter for UI, labels and navigation.
Loaded through `next/font` so there is no layout shift and no external request.

**Layout.** A generous editorial grid, wide margins, a 68-character measure for body
text. Space is the primary luxury signal. Content-first: no hero carousel, no stock
photography of handshakes, no glass buildings.

**Motion.** Restrained. Short fades on scroll entry, honest focus states, and
`prefers-reduced-motion` respected throughout.

**Photography.** Janeevan's existing portrait, used large and properly, is the only
person on the site. That is the point — the brief says he is driving it. A boutique's
credibility is a named human being, not a stock photo of a boardroom.

**Accessibility** is a requirement, not a nice-to-have: WCAG 2.2 AA contrast, full
keyboard navigation, visible focus rings, semantic landmarks, labelled form controls,
live-region announcements on step change in the brief.

---

## 10. Data model

```
Lead
  id, createdAt, updatedAt
  segment            A–G
  urgency            exploring | this_quarter | 30_days | overdue
  entityStatus       none | branch | subsidiary | dormant | non_compliant
  peoplePosition     none | need_to_move | already_here | hiring_locally
  sector             CETA sector taxonomy
  scale              headcount band, turnover band
  origin             city, state
  contact            name, role, company, email, phone, preferred channel
  recommendation     JSON — the route, sequence and traps the client was shown
  services[]         the scope assembled for them
  score              0–100
  status             new | contacted | proposal_sent | instructed | declined
  source             referrer, utm_*, landingPath
  timing             startedAt, completedAt, durationMs
  consent            marketing opt-in, privacy version accepted
```

SQLite via `better-sqlite3`, behind `src/lib/leads/store.ts`. Swapping to Postgres or a
CRM means reimplementing one interface. Data protection is designed in, not retrofitted:
explicit consent capture, a stated retention period, and export and deletion by ID.

---

## 11. Technology

Next.js 15 App Router · TypeScript · Tailwind CSS v4 · SQLite. Server components by
default; client components only for the brief flow and the admin filters. Deploys to
Vercel, or to any Node host.

- **Performance** — target Lighthouse ≥95 across the board. Static rendering wherever
  possible; fonts self-hosted; images through `next/image` with correct sizing.
- **SEO** — per-page metadata, Open Graph, JSON-LD `LegalService` and `Person`, a real
  sitemap and robots. The current site's `<title>Janeevan</title>` and
  `<meta description="Jon">` are the baseline being replaced.
- **Security** — no secrets in the client; admin behind an env-var-configured
  credential; input validated with Zod on the server; a rate limit on submissions.

---

## 12. What "done" looks like

1. An Indian GC can establish in under thirty seconds who this firm is, what it does,
   who is regulated for what, and whether it has handled their situation before.
2. A visitor with a real need completes the brief in under four minutes and receives
   something they would have paid for.
3. Every submission arrives structured, scored and actionable, with the client's own
   scope attached.
4. Every regulatory identifier is correct, current and in one file.
5. Nothing on the site claims a capability, an authorisation or a legal requirement
   that does not exist.

---

## 13. Explicitly out of scope for v1

Payment collection · a client portal or document exchange · live chat · multilingual
content, though the type stack supports Devanagari if it is added later · CRM
integration beyond the export · booking-calendar integration. Each is a clean addition
once the core is live and the lead data shows which is actually needed.

---

## 14. Open items requiring Janeevan's input before launch

1. **Correct registered office address.** The current site shows "1G2 7HU", a typo for
   IG2 7HU. Confirm the full address.
2. **A real contact email.** The current site shows `user@domain.ext`.
3. **HMRC AML/TCSP supervision status.** Determines whether registered office, company
   formation and director services can be offered at all — MLR 2017 reg 56 prohibits
   trading before HMRC confirms registration. Sections are gated on a config flag until
   confirmed.
4. **ACSP registration status** with Companies House — determines whether Fiat Law can
   file for clients and perform identity verification.
5. **Immigration advice capacity.** Confirm the basis: Taylor Rose's SRA authorisation,
   or separate IAA registration.
6. **Professional indemnity** — insurer and limit, for the regulatory information page.
7. **Complaints procedure** — Taylor Rose's, and the Legal Ombudsman route and time
   limits.
8. **Named accounting and banking partners**, if any, for the services that are
   coordinated rather than delivered in-house.
9. **Three to five case studies or matter descriptions**, anonymised. Nothing signals
   competence like a specific matter, and the site currently has none.
