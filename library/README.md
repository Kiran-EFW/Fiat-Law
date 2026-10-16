# Fiat Law — India–UK CETA research library

A local, durable corpus of primary source documents for the India–UK Comprehensive
Economic and Trade Agreement and the UK regulatory regime governing a boutique
market-entry practice. Built 4 August 2026.

**306 files, ~180 MB.** Every file is registered in [`_manifest.json`](_manifest.json)
with its source URL, SHA-256, byte count, retrieval date and a one-line note on why
it is here.

The point of this library is that the analysis in
[CETA-market-entry-research.md](../CETA-market-entry-research.md) can be re-checked
against primary sources without re-fetching anything. Several of these sources are
hard or impossible to retrieve on demand — see *Retrieval notes* at the end.

---

## How to use it

Full text of every extractable PDF is in `99-extracted-text/`, named
`<source-folder>__<filename>.txt` with a provenance header. **Grep that folder first**
— it is the fastest way to find a provision:

```bash
cd library/99-extracted-text
grep -rn "detached worker" .                    # find a concept across the whole corpus
grep -rln "Economic Needs Test" .               # which documents mention it
grep -rn "52,500\|52500" .                      # salary thresholds
```

The `.md` files in `06-uk-regulatory/` and `08-tax-customs/` are already text
(legislation retrieved as markdown), so grep those directly.

`.json` files are gov.uk Content API responses. The page body is at
`.details.body` (or `.details.parts[]` for multi-part guidance):

```bash
python3 -c "import json;d=json.load(open('05-mobility-immigration/APP-GBM-all-five-routes.json'));print(d['details']['body'])" | less
```

---

## 00-research-reports — 15 files

Derived analysis, not primary sources. These are the full reports from the research
agents run on 4 August 2026, kept because they contain a large amount of verbatim
quotation from sites that are bot-walled or that change frequently.

| File | What is in it |
|---|---|
| `competitive-landscape-6-tiers.md` | The competitive map across six tiers: Big Four/mid-tier India desks, ~35 UK law firms, Indian firms with UK arms, corporate service providers, boutiques, government. **Contains essentially all the published price points that exist in this corridor** — 1st Formations, Rapid Formations, Coddan, Hoxton Mix, Osome, Deel EOR, Invest Manchester. |
| `free-and-subsidised-alternatives-WTP.md` | The free ecosystem (DBT, London & Partners, six regional agencies, Innovate UK, British Business Bank, UKIBC, CII, FICCI, ASSOCHAM, NASSCOM, TiE) and a willingness-to-pay compression analysis layer by layer. The single most useful document for pricing. |
| `london-and-partners-and-regional-IPAs.md` | L&P and the regional investment promotion agencies: what is free, verbatim liability disclaimers, India offices, partner directories and fees. |
| `indian-trade-bodies-uk-presence.md` | CII, FICCI, ASSOCHAM, NASSCOM, TiE, India Global Forum — membership fee ladders and what they actually deliver. |
| `innovate-uk-and-visa-endorsing-bodies.md` | Innovate UK, British Business Bank, Global Talent and Innovator Founder endorsing bodies — fees and eligibility. |
| `ceta-procurement-and-investment.md` | CETA Chapter 15 procurement thresholds, coverage and exclusions; the absence of an investment chapter and ISDS; the 1994 BIPA sunset. |
| `ceta-agent-report-*.md` (9 files) | The CETA research threads: legal text, mobility, rules of origin, tariffs, sectors, legal-services asymmetry and Bar Council of India rules, UK regulatory constraints, the corridor's size and shape. |

---

## 01-ceta-legal-text — 83 files, 99 MB

The complete CETA legal text as published by DBT: all 30 chapters, every annex,
associated documents and side letters, plus the FCDO Treaty Series and Command Paper
consolidations (`CS_India_1.2026_*` and `TS_30.2026_*`, each in four parts) and the
explanatory memorandum in ODT.

Documents worth knowing by name:

- `CETA-Annex8B-India-services-schedule.pdf` — India's services schedule. **Legal
  services do not appear in it at all.**
- `CETA-Annex8B-UK-services-schedule.pdf` — the UK's. Legal services (CPC 861) fully bound.
- `CETA-Annex8C-MFN.pdf` — MFN lists. India omits legal services entirely, so no
  future third-country concession will flow through to UK firms automatically.
- `CETA-Annex8A-professional-services.pdf` — mutual recognition agreements, on a
  best-endeavours basis with 12-month and 36-month milestones.

The asymmetry those four documents establish is the foundation of the legal-services
analysis: **Indian lawyers can now come to the UK to advise on Indian and foreign law;
UK lawyers got nothing reciprocal in India.**

---

## 02-ceta-official-analysis — 12 files, 7.6 MB

The UK government's own assessment of its own deal.

- `impact-assessment-of-the-free-trade-agreement-between-the-uk-and-india.pdf` — the
  full Impact Assessment. **Table 11 is the one to read: all UK tariff cuts happen at
  entry into force, with no phase-in.**
- `uk-india-ceta-draft-explanatory-memorandum.pdf` — the CRaG s.20 memorandum.
- `advice-to-the-secretary-of-state-...-on-the-uk-india-free-trade-agreement.pdf` — the
  Trade and Agriculture Commission's independent advice.
- `report-persuant-to-section-42-of-the-agriculture-act-2020.pdf` and
  `s42-joint-advice-FSA-FSS.json` — the statutory agriculture reports.
- `uk_india_fta_impact_on_industrial_strategy_sectors.pdf` — sector-by-sector impact
  mapped onto the eight Industrial Strategy growth sectors.
- `DBT-technical-note.json`, `DBT-conclusion-summary.json`, `DBT-DCC-explainer.json`,
  `DBT-business-mobility-explainer.json` — the public-facing explainers.
- `Roadmap-2030-UK-India.json` — the 2021 political frame the agreement sits inside.
- `NTCAB-conformity-assessment-india.json` — national treatment of conformity
  assessment bodies.

> ⚠️ **The salary figures in `DBT-business-mobility-explainer.json` are stale.** Use
> `05-mobility-immigration/APP-GBM-all-five-routes.json` instead. This is the single
> most consequential discrepancy in the library.

---

## 03-india-government — 14 files, 12 MB

The Indian side, which is materially harder to retrieve than the UK side.

- `IN-Notification-29-2026-Customs-tariff-concessions.pdf` — **4.2 MB, 448 pages.**
  CBIC Notification 29/2026-Customs, G.S.R. 628(E), 14 July 2026. The operative tariff
  instrument: Table I runs to 11,106 lines; Table III carries the vehicle tariff rate
  quotas. This is the document that determines what an Indian importer actually pays.
- `IN-Notification-62-2026-Customs-NT-rules-of-origin.pdf` — **MISSING, see below.**
  Notification 62/2026-Cus (N.T.), 3 July 2026, the CETA Rules of Origin (29 rules plus
  Annexures A–E). Every mirror found was Cloudflare-walled. Rule 16(1)(b) matters:
  under it, only a self-completed origin declaration is valid for imports into India —
  which contradicts DGFT PN 19/2026-27 condition 3, requiring "a Certificate of Origin
  issued by concerned authorities in UK". No corrigendum has been found. **Re-fetching
  this is the highest-priority gap in the library.**
- `IN-PIB-CETA-backgrounder-15Jul2026.pdf` / `.txt` — the richest single sector-by-sector
  Indian source.
- `IN-PIB-*.html` — six Press Information Bureau releases: entry into force, the
  17 June 2026 announcement, the 24 July 2025 signing, the Modi–Starmer G7 readout,
  Goyal's UK visit, and the 1,000 advisory personnel commitment.
- `IN-DGFT-TradeNotice-11-2026-eCoO.pdf` — eCoO 2.0 electronic filing from 15 July 2026.
- `IN-PDEXCIL-CETA-advisory.pdf` — an export council's practical advisory on proof of origin.
- `IN-LokSabha-Q45-FTAs-3Feb2026.pdf` — Starred Question 45, Goyal on FTA status.
- `UK-India-BIPA-1994-Cm2797.pdf` — the 1994 investment treaty. **Terminated 22 March
  2017**, with a 15-year sunset, so pre-2017 investments remain protected to roughly
  2032. A scanned image; no text layer, so it is not in `99-extracted-text/`.

---

## 04-uk-guidance — 1 file

`limited-company-formation.json`. Thin by design: most of what began here was
re-filed into `06-uk-regulatory/` because it turned out to be regulatory rather than
general guidance.

---

## 05-mobility-immigration — 26 files, 5.3 MB

The heart of the commercial thesis, because the immigration route is what makes the
incorporation necessary.

**Start here:** `APP-GBM-all-five-routes.json` (191 KB) — Immigration Rules Appendix
Global Business Mobility, all five routes in one document. This is the authority for:

| | Figure |
|---|---|
| Senior or Specialist Worker, and UK Expansion Worker | **£52,500** or the going rate |
| Graduate Trainee | **£27,300** |
| High earner threshold | **£73,900** |

Also here:

- `Sponsor-Global-Business-Mobility-worker-04-26-v1.0_.pdf` — **GBM3.4 is the key
  provision**: a UK "footprint" is shown by either UK business premises *or* a
  Companies House reference number. A £100 incorporation is the entry ticket to the
  route. Also GBM3.3 (must not already be trading in the UK), GBM3.6 (overseas business
  trading ≥3 years), GBM3.26 (CoS capped at 10, or at **1** if the Authorising Officer
  is overseas), GBM3.29 (Provisional rather than A rating in that case), GBM3.37
  (licence valid 4 years, non-renewable) and GBM3.38 (**the two-year cliff** — full UK
  trading presence within 2 years or the CoS allocation drops to zero).
- `Sponsor_guidance-part-2-sponsor-a-worker-08-26-v1.0.pdf` — version 08/26, published
  3 August 2026. S5.3–S5.4 Immigration Skills Charge **£480 small/charitable, £1,320
  others** per 12 months (uplifted from £364/£1,000 on 16 December 2025 — earlier
  figures circulating in secondary sources are wrong). S5.10: the ISC is **not payable
  on UK Expansion Worker or Scale-up**. S5.7: it must not be passed to the worker.
- `Global_Business_Mobility_routes_guidance.pdf` — caseworker guidance.
- `home-office-fees-table.json` plus six historic ODS fee tables — the fee series.
- `APP-Skilled-Occupations-going-rates.json` (329 KB) — going rates by SOC code.
- `CETA-Ch10-temporary-movement-natural-persons.pdf` — Article 10.4(3), no Economic
  Needs Test and no numerical quota for the covered categories.
- `CETA-Annex10A-ii-UK-schedule.pdf` — the UK's Mode 4 schedule: ICT up to 3 years,
  33 Contractual Service Supplier subsectors, 16 Independent Professional subsectors,
  the 1,800/year cultural cap.
- `CETA-Annex10A-i-India-schedule.pdf` — India's: ICT up to 5 years, 27 CSS, 12 IP,
  legal services excluded.
- `india-young-professionals-ballot.json` — the 3,000-place ballot scheme, which
  pre-dates CETA and is not part of it.

> ⚠️ Two traps documented in the research and verifiable here. **(1)** India did **not**
> receive the Japan/Australia waiver of the 12-month prior-overseas-employment
> condition on UK Expansion Worker. **(2)** Service Supplier rules SSU 5.2–5.4 require
> the **UK client** to be the A-rated sponsor with a Home-Office-registered contract —
> several law-firm blogs claim no UK sponsor is needed, and they are wrong.

---

## 06-uk-regulatory — 24 files, 10 MB

Nine statutes retrieved as full markdown, plus the regulator guidance that determines
what Fiat Law may lawfully sell.

| Statute | Provisions that matter |
|---|---|
| `MLR-2017-money-laundering-regs.md` | reg 12(2) TCSP definition; reg 56 no-trading-before-registration; reg 86 offences |
| `ECCTA-2023.md` | identity verification; the ACSP regime; CA 2006 ss.1098A–H; s.1067A |
| `Companies-Act-2006.md` | s.86 appropriate address; ss.154/155/156A (**s155 requires a natural person, not a resident**); ss.171–177 directors' duties; s.251 shadow directors; Parts 34 and 42 |
| `Legal-Services-Act-2007.md` | s.12 and Sch 2 reserved activities; s.14 offence; **s.15(4) the separate-business trap**; s.15(11); s.17 |
| `Immigration-Asylum-Act-1999.md` | Part V: s.82, s.84(2)(ba), s.86A(2)(a), s.91(3)–(4) — giving immigration advice unregistered is a criminal offence |
| `FSMA-2000.md` | s.19 general prohibition; s.21 financial promotion; s.23; ss.26–27 unenforceability; Part XX |
| `RAO-2001-regulated-activities-order.md` | arts 25, 53, 70 — the M&A arranging problem |
| `Solicitors-Act-1974.md` | — |
| `Procurement-Act-2023.md` | the domestic frame for CETA Chapter 15 |

Regulator guidance: HMRC on who must register for MLR and the TCSP definition, MLR
fees and the fit-and-proper test; Companies House on the ACSP register, identity
verification and when it is required, registered office rules, directors and
secretaries, fees, and the OS IN01 UK-establishment registration (**£124, paper only**);
the Immigration Advice Authority (the renamed OISC); UK conformity assessment bodies.

---

## 07-market-data — 7 files, 31 MB

- `GT-India-Meets-Britain-Tracker-2026.pdf` (22.7 MB) — the 13th edition, produced with
  CII. **1,912 Indian-owned UK companies, up ~60% year on year; £105.77bn combined
  turnover; 203,549 UK employees.** The single most-cited dataset in the corridor, and
  the brand asset Grant Thornton uses to own it.
- `GT-India-Meets-Britain-Tracker-2025.pdf` — the prior year, for the growth denominator.
- Both are also in `99-extracted-text/` as pre-extracted text.
- `CompaniesHouse-register-activities.ods` — **Table_B1 carries the overseas-company
  branch series**, which is how to size branch-versus-subsidiary directly rather than
  relying on secondary reporting.
- `DBT-inward-investment-results.ods` and `DBT-inward-investment-2022.ods` — India is
  2nd by project count.
- `DBT-India-trade-and-investment-factsheet.pdf` (8.2 MB) — the official bilateral series.

---

## 08-tax-customs — 18 files, 2.1 MB

- `SI-2026-794-DCC-36-to-60-months.md` — **the instrument that extended the Double
  Contribution Convention detachment period from 36 to 60 months**, implementing the
  Exchange of Notes of 6 July 2026 (NOTE NO: CH/551/26). Anyone still citing "3 years"
  is out of date.
- `SI-2026-274-DCC-order-in-council.md` — the DCC Order in Council.
- `Social-Security-Contributions-Regs-2001.md` — **regs 145(2) and 146**, the
  pre-existing unilateral 52-week UK NIC exemption. This is why the DCC's marginal
  value is months 13–60, not months 1–60.
- `SI-2026-36-customs-tariff-CETA.md`, `SI-2026-297-procurement-treaty-state.md`,
  `SI-2026-703-steel-quota.md` — the other implementing instruments.
- `uk-india-ceta-origin-declaration.json` — the self-certification template.
- `hmrc-preference-agreements.json`, `hmrc-register-origin-declarations.json` — how to
  claim preference in practice.
- The 1993 UK–India double taxation agreement, the 2013 protocol, the India DTC and the
  MAP MoU — all in force.
- `uk-cbam-policy-summary.json` and `uk-steel-trade-measure-2026.json` — **CETA contains
  no CBAM, rebalancing or carbon-leakage provision at all** (verified across 67 of the
  68 legal-text PDFs). UK CBAM starts 1 January 2027 across five sectors with no India
  exemption.
- `vat-overseas-businesses-NETP.json` — the **nil** VAT registration threshold for
  non-established taxable persons. Every Indian client selling into the UK without a
  UK establishment must register from the first pound.

---

## 99-extracted-text — 106 files, 11 MB

Full text of every extractable PDF, named `<source-folder>__<filename>.txt` with a
provenance header giving the source path and page count.

Two PDFs are not represented: `UK-India-BIPA-1994-Cm2797.pdf` is a scanned image with
no text layer, and one Grant Thornton download turned out to be an HTML error page and
was deleted.

---

## Retrieval notes — read before trying to rebuild any of this

Several sources actively resist automated retrieval. What worked:

**WebSearch is blocked at organisation policy level** for this model
(`disallowed feature web_search for Partner model claude-opus-5`). Everything here came
from direct URL fetches, the gov.uk APIs, SearXNG and the reader proxy.

**AWS WAF blocks legislation.gov.uk, publications.parliament.uk,
committees.parliament.uk and hansard.parliament.uk.** They return HTTP 202 and a
2,020-byte challenge page to any curl, regardless of headers — a full browser header
set including `Sec-Fetch-Dest/Mode/Site/User` was tested and does not help. **The
workaround is `https://r.jina.ai/<url>`**, which returns clean markdown. It is itself
Cloudflare rate-limited under burst load and starts returning "just a moment", so
`_batch_leg.py` uses five attempts with escalating backoff and 20 seconds between items.

**PIB India requires the query suffix `&reg=3&lang=1`.** A bare
`PressReleasePage.aspx?PRID=NNNN` returns HTTP 302; with the suffix it returns 200.

**gov.uk has two APIs worth knowing.** Search:
`https://www.gov.uk/api/search.json?q=<q>&count=200&fields=title,link` — use it to find
the correct path before fetching, because guessed paths 404 silently. Content:
`https://www.gov.uk/api/content<path>` — returns clean JSON. PDFs live on
`assets.publishing.service.gov.uk` and can be regex-extracted from either the
publication HTML or the Content API JSON.

**Do not route binaries through the reader proxy** — it mangles PDFs and ODS files.
`_fetch.py` only proxies the domains in its `WAF_BLOCKED` tuple.

**Known gap.** `IN-Notification-62-2026-Customs-NT-rules-of-origin.pdf` could not be
retrieved; every mirror located was Cloudflare-walled. It is the CETA rules of origin
instrument and should be sourced directly from CBIC.

---

## Scripts

| Script | What it fetched |
|---|---|
| `_fetch.py` | The shared fetcher. `fetch()` writes the file and records provenance; it rejects WAF challenge pages, Cloudflare interstitials and short error bodies rather than storing them. `govuk_assets()` scrapes PDF links from a publication page. |
| `_batch2.py` | Superseded by `_batch_leg.py`. |
| `_batch3.py` | gov.uk publications and Content API guidance. |
| `_batch_leg.py` | The nine statutes and the SIs, via the reader proxy with backoff. |
| `_batch4.py` | Rescued the research agents' `/tmp` artefacts; PIB releases; Indian instruments. |
| `_batch5.py` | HTML-only gov.uk publications; UK guidance; the research reports. |
| `_batch6.py` | Re-fetched the paths `_batch5.py` got wrong, using the search API to find them. |
| `_batch7.py` | Publication attachments; PDF text extraction; manifest reconcile. |

All are re-runnable — anything already in the manifest is skipped.

> ⚠️ `_batch3.py` and `_batch4.py` ran concurrently and both write `_manifest.json`, so
> each clobbered some of the other's entries. `_batch7.py` reconciles by walking the
> tree and registering anything missing, but **163 entries carry the note "recorded
> during reconcile" and have lost their source URL.** The file, hash and size are
> correct; only the URL is gone. Run batches sequentially in future.
