Research complete. Findings below, organised against the nine items.

---

# INDIA-SIDE LEGAL IMPLEMENTATION OF THE INDIA–UK CETA

Method note: WebSearch was not used. Searches ran through the local SearXNG instance (yandex / bing news / quark); pages via WebFetch or `curl -skL`; PDFs downloaded to `/tmp/indiaceta/` and extracted with pypdf. Several DGFT PDFs are image-only scans with no OCR available — flagged where relevant.

---

## 1. Union Cabinet approval (~22 July 2025) — NO OFFICIAL RECORD EXISTS

**Verified negative.** I queried PIB's own release archive (`https://www.pib.gov.in/allRel.aspx`, ASP.NET postback with ministry/day/month/year) directly:

| Query | Result |
|---|---|
| "Cabinet" (code 61), 22 Jul 2025 | *Displaying 0 Press Releases — No Release Found* |
| "Cabinet" (61), 23 Jul 2025 | 0 |
| "Cabinet Committee Decisions" (62), 22 & 23 Jul 2025 | 0 |
| "CCEA" (63), 22 & 23 Jul 2025 | 0 |
| Ministry of Commerce & Industry (16), 22 Jul 2025 | 2 releases — IP filings surge; ONDC. Neither on CETA |
| Ministry of Commerce & Industry (16), 23 Jul 2025 | 2 releases — NPG meeting; CTIL/IIFT workshop. Neither on CETA |
| Ministry of Commerce & Industry (16), 24 Jul 2025 | 1 release — **PRID 2147805, "India and UK Sign Comprehensive Economic and Trade Agreement (CETA)"** |

**Conclusion: there is no PIB press release, Cabinet communiqué or any other Government of India document announcing Cabinet approval of CETA.** The first official Indian acknowledgement is the signing release of 24 July 2025 (https://www.pib.gov.in/PressReleasePage.aspx?PRID=2147805).

The 22 July 2025 date rests **entirely on PTI "sources"** reporting:
- News18, "Cabinet Approves India-UK Free Trade Deal, To Be Signed During PM Modi's Visit To London", Last Updated **July 23, 2025, 07:08 IST**: *"The Cabinet on Tuesday approved the Free Trade Agreement between India and the United Kingdom, which will be signed during Prime Minister Narendra Modi's visit to London on July 24, according to sources."* — https://www.news18.com/india/india-uk-free-trade-deal-cabinet-approval-pm-modi-visit-london-keir-starmer-taxes-leather-agriculture-labour-ws-l-9457109.html
- NDTV/PTI live blog, same wording — https://www.ndtv.com/world-news/pm-modi-uk-maldives-visit-live-updates-narendra-modi-india-uk-free-trade-deal-meet-british-pm-keir-starmer-king-charles-khalistani-threat-mohamed-muiz-8930160

Tuesday before Thursday 24 July 2025 = **22 July 2025**. **UNVERIFIED against any primary source.** This is itself telling: FTA approvals are taken by Cabinet as a routine executive decision and are not published in the Cabinet decisions series.

---

## 2. No parliamentary ratification required — NO DEDICATED OFFICIAL STATEMENT FOUND

**Could not verify with a direct parliamentary question or ministerial statement.** What I did find:

- **Lok Sabha Starred Question No. 45, answered 03/02/2026**, "FREE TRADE AGREEMENTS", asked by Shri Mukeshkumar Chandrakaant Dalal and Shri Atul Garg, answered by Commerce & Industry Minister Shri Piyush Goyal — https://sansad.in/getFile/loksabhaquestions/annex/187/AS45_3nBiTI.pdf?source=pqals
  It tabulates India's FTAs with **signing date and implementation date only** (Mauritius CECPA 22 Feb 2021 / 1 Apr 2021; UAE CEPA 18 Feb 2022 / 1 May 2022; India–Australia ECTA 2 Apr 2022 / 29 Dec 2022; EFTA TEPA 10 Mar 2024 / 1 Oct 2025) and states: *"The India – United Kingdom (UK) Comprehensive Economic and Trade Agreement (CETA) signed on 24 July 2025 secures duty-free access for 99% of India's exports to the UK."* **It says nothing about ratification or parliamentary approval.** The very structure of the answer — "signed" / "implemented", with no ratification column — reflects the executive-only route.

- **Structural confirmation from the instruments themselves.** The entire Indian legal implementation of CETA consists of *delegated legislation and executive orders*: two Ministry of Finance notifications (s.25(1) Customs Act 1962; s.5(1) Customs Tariff Act 1975), four DGFT public notices and one DGFT trade notice. **No Act of Parliament, no resolution, no laying requirement.** This is the practical proof that Article 73 (executive power co-extensive with Parliament's legislative power, read with Entry 14 of List I — "entering into treaties and agreements with foreign countries") supplied the treaty-making authority.

- The PIB entry-into-force release (below) uses the phrase *"internal procedures and ratifications by both governments"* — note "governments", not legislatures.

**Contrast with the UK**, where the treaty went through CRaG scrutiny; House of Commons Library briefing **CBP-10258, published 26 June 2026** — https://commonslibrary.parliament.uk/research-briefings/cbp-10258/ (Cloudflare-blocked to automated fetch; listing metadata only).

**FLAGGED UNVERIFIED:** no Rajya Sabha or Lok Sabha starred/unstarred question specifically on why CETA did not require parliamentary ratification was located.

---

## 3. CBIC tariff-concession notification — VERIFIED (primary PDF obtained)

**Notification No. 29/2026-Customs, dated 14th July, 2026 — G.S.R. 628(E)**
- Issued under **sub-section (1) of section 25 of the Customs Act, 1962 (52 of 1962)**
- Ministry of Finance, Department of Revenue
- File: **[F. No. CBIC-190341/131/2025-TRU]**; signed **DHEERAJ SHARMA, Under Secy.**; digitally signed 2026.07.14 23:50:26 +05'30'
- **"2. This notification shall come into force with effect from 15th day of July, 2026."**
- 448 pages
- Primary PDF: https://a2ztaxcorp.net/wp-content/uploads/2026/07/India-UK-CETA-Customs-Notification.pdf
- Summary: https://a2ztaxcorp.net/india-gives-effect-to-first-tranche-of-tariff-concessions-under-india-uk-ceta-tariff-rate-quota-framework-notified-for-specified-motor-vehicles-concessions-effective-from-15-july-2026/

Structure:
- **Table I — 11,106 entries**: tariff item / description / BCD rate / AIDC rate / Health cess rate.
- **Table II — 28 entries**: alcoholic beverages, HS 2206 / 2207 / 2208. Examples: 22071011 → BCD 110%, AIDC 0; 22083011 → BCD 60%, AIDC 50%; several CIF-value-conditioned lines at BCD 10% / AIDC 100%.
- **Table III**: motor-vehicle TRQ. Year-1 (CY2026 pro-rated) figures, HS 8703 ICE CBU unregistered — ≤1500cc: in-quota BCD 25 / AIDC 25, qty **2,329**, out-of-quota 30/30; 1500–3000cc petrol or 1500–2500cc diesel: 25/25, qty **2,329**, out-of-quota 30/30; >3000cc petrol or >2500cc diesel: 15/15, qty **4,658**, out-of-quota 45/50. HS 8704 goods vehicles CBU: 17/20, qty **1,164**, out-of-quota 20/20.

**Origin proviso (verbatim):**
> "Provided that the exemption shall be available only if importer proves to the satisfaction of the Deputy Commissioner of Customs or Assistant Commissioner of Customs … that the goods … are of the origin of United Kingdom, in terms of the Customs (Administration of Rules of Origin under Trade Agreements) Rules, 2020 and rules as may be notified in this regard by the Central Government by publication in the Official Gazette."

**Annexure conditions (a)–(d):** TRQ allotted by DGFT per HBP 2023; the authorisation carries importer name/address, IEC, Customs notification number, tariff item, quantity and validity; issued **electronically by DGFT and transmitted to ICES**; imports allowed only on electronic debit in ICES.

---

## 4. Rules of origin notification — VERIFIED (primary PDF obtained)

**Notification No. 62/2026-Customs (N.T.), New Delhi, the 3rd July, 2026**
- Ministry of Finance, Department of Revenue, CBIC
- Made under **sub-section (1) of section 5 of the Customs Tariff Act, 1975 (51 of 1975)**
- **Correct title:** *"Customs Tariff (Determination of Origin of Goods under Comprehensive Economic and Trade Agreement between India and the United Kingdom of Great Britain and Northern Ireland) Rules, 2026"*
- **"(2) They shall come into force on the 15th July, 2026."**
- File **[F.No. CBIC-15020/2/2021-ICD-CBEC- PART-I]**; signed **(Indrajit Panda) Under Secretary to the Government of India**
- 72 pages
- Primary PDF: https://gstclub.in/storage/documents/gst_1783768350NotificationNo62-2026-CustomsNT.pdf

**Correction of a widely reproduced error:** jurishour.in and some other outlets rendered the title as "Customs (Administration of Rules of Origin under the CETA between the Republic of India and the UK…) Rules, 2026", conflating it with CAROTAR. That is wrong — the rules are made under the *Customs Tariff Act*, not the Customs Act, and are "Determination of Origin of Goods" rules.

**29 rules + Annexures A–E:** 1 Short title; 2 Definitions; 3 Origin Criteria; 4 Wholly Obtained; 5 Value of the Good; 6 Qualifying Value Content; 7 Materials Used in Production; 8 Non-Qualifying Operations; 9 Cumulation; 10 Tolerance; 11 Fungible Goods; 12 Accessories/Spare Parts/Tools; 13 Packaging; 14 Indirect Materials; 15 Non-Alteration; 16 Proof of Origin; 17 Basis of a Claim; 18 Certificate of Origin; 19 Exemptions from Proof of Origin Requirements; 20 Determinations of Claims; 21 Refunds and Claims After Importation; 22 Incorrect Claims; 23 Errors and Discrepancies; 24 Penalties; 25 Record Keeping; 26 Verification of Origin; 27 Temporary Suspension; 28 Confidentiality; 29 Working Group on Rules of Origin. Annexure A (Product-Specific Rules), B (Origin Declaration Template), C (Certificate of Origin), D (electronic authentication framework), E (personal data protection, 18 paragraphs).

**THE KEY LEGAL DESIGN POINT — Rule 16(1), verbatim:**
> "(a) for importers in the United Kingdom, an applicable proof of origin shall be:
>  (i) an origin declaration completed by the exporter or producer;
>  (ii) a certificate of origin issued by an issuing authority; or
>  (iii) the importer's knowledge that the good is originating; and
> **(b) for importers in India, an applicable proof of origin shall be an origin declaration completed by the exporter or producer.**"

So **for imports into India there is only ONE acceptable proof of origin: a self-completed origin declaration by the UK exporter or producer.** No third-party certificate of origin, no "importer's knowledge". This is a deliberate asymmetry.

Other operative provisions:
- **Rule 16(2):** valid **12 months** from date of completion (origin declaration) / date of issue (certificate); must follow Annexure-B or C format; in writing including electronic; accompanied by invoice or other commercial document; covers a single shipment; **English language**.
- **Rule 16(3):** multiple shipments of identical goods within ≤12 months — **UK importers only**.
- **Rule 16(4):** force-majeure acceptance after expiry. **16(5):** third-country invoicing permitted. **16(6)–(7):** must be issued/completed prior to or at importation; retrospective completion allowed but must bear **"completed retrospectively"** with an explanation.
- **Rule 17(6)–(8):** an **authentication process** for India to verify the authenticity of origin declarations *before* an Indian importer claims preference; modalities to be agreed on entry into force; electronic exchange per **Annexure-D**; data protection per **Annexure-E**.
- **Rule 18:** CoO issued by an issuing authority; India to exchange names of issuing authorities and specimen seals with HMRC.
- **Rule 19:** de minimis waiver for consignments **≤ £1,000 — UK only**.
- **Rule 9:** bilateral cumulation only.
- **Rule 10 Tolerance:** 7.5% (value or net weight) for HS Ch. 1–3, 5, 6, 10, 14; 12.5% for Ch. 4, 7–9, 11–13, 15–24; 12.5% of value for Ch. 25–98.
- **Rule 21(3):** post-importation refund claims limited to one year.
- **Rule 25:** importer keeps records ≥4 years from importation; producer/exporter 5 years (Explanation: for India this also binds the issuing authority).
- **Rule 26:** verification request to the competent authority of the exporting Party within **2 years** of the claim; beyond that via the **India–UK Agreement on Cooperation and Mutual Administrative Assistance in Customs Matters, signed London 31 May 2021**; fraud within 5 years; response within 12 months (+6). Explanation: *"Requests for information from the United Kingdom shall be made to the Department of Commerce in India."*
- **"Competent authority"** = for India, exports: Department of Commerce or notified agencies; imports: CBIC. For the UK: its customs authority.
- **Annexure-B origin declaration fields:** signatory (exporter/producer), exporter/producer/importer details, reference number, HS 6-digit, description, invoice no./date, origin-criterion checkboxes (WO / PE / PSR), non-alteration checkbox, an **HS 2208 bottling-in-a-non-Party checkbox**, roll-up/absorption, single or multiple shipment (multiple marked **"For Indian exporters and producers only"**), declaration, signature, date, "Completed retrospectively" checkbox.

**CAROTAR interaction — important finding:** the strings "CAROTAR", "Administration of Rules of Origin" and "2020" appear **zero times** in Notification 62/2026-Customs (N.T.). The CAROTAR 2020 link is made **only** by the proviso in Notification 29/2026-Customs. So CAROTAR's procedural apparatus (Form I information, s.28DA verification, denial of preference) applies by cross-reference from the exemption notification, not from the origin rules themselves.

Corroborating trade-body advisory: **PDEXCIL** (Powerloom Development & Export Promotion Council), "IMPORTANT ADVISORY – India–UK CETA", by Executive Director Mahesh N. Sanil — https://www.pdexcil.org/assets/img/notifications/IMPORTANT%20ADVISORY%20%E2%80%93%20India%E2%80%93UK%20CETA.pdf. Confirms the notification number and date, discusses Rule 20(1), Rule 16(7) retrospective PoO and Rule 21 delayed claims, and records that at the date of the advisory the eCoO facility for CETA on DGFT's platform was **"yet to become operational"**.

---

## 5. DGFT instruments — FIVE INSTRUMENTS IDENTIFIED

All listed on https://www.dgft.gov.in/CP/?opt=public-notice

**(a) Public Notice No. 09/2026-27, dated 11/05/2026** — "Amendments in Para 2.88 and Para 2.91 of Handbook of Procedures-reg."
- Amends **Para 2.88(a) HBP 2023** to add India–UK CETA to the list of FTAs covered by the Certificate of Origin procedures.
- Amends **Para 2.91(e)** to permit exporters to obtain CoOs by **self-declaration** under both India–EFTA TEPA and India–UK CETA, in addition to issuance through authorised agencies.
- Official PDF (scanned image, no extractable text): `https://content.dgft.gov.in/Website/dgftprod/73ccd1f5-48c6-4721-9c8c-7d6672d7ee81/Amendment in Para 2.88_0001-1.pdf`
- Text source: https://prefaceventure.com/dgft-allows-coo-self-declaration-under-india-uk-ceta/

**(b) Public Notice No. 10/2026-27, dated 11/05/2026** — "Amendment of Appendix 2B [List of Agencies Authorised to issue Certificate of Origin (Preferential)] of Foreign Trade Policy, 2023-reg."
- Official PDF (scan): `https://content.dgft.gov.in/Website/dgftprod/a0167d79-70f4-4212-93f7-b05eb8dd84c9/Amendment of Appendix 2B_0001-1-3.pdf`
- Note: APEDA's mirror lists this as "14 May, 2026" (https://apeda.gov.in/dgft-public-notice); DGFT's own table gives **11/05/2026** — I have taken DGFT's date. **The specific agencies added are UNVERIFIED** (PDF is a scan, no OCR available).

**(c) Public Notice No. 19/2026-27, dated 9th July, 2026** — "Amendments under Para 2.92 and Appendix-2A of Handbook of Procedure 2023 for inclusion of TRQs under India – United Kingdom CETA-reg."
- **F. No. 01/89/180/110/AM-25/PC-2(A)/E-45719**; issued under paragraph 1.03 read with 2.04 FTP 2023; signed **LAV AGARWAL, Director General of Foreign Trade & Addl. Secy.**
- Full text: https://taxguru.in/dgft/dgft-notifies-india-uk-ceta-tariff-rate-quota-procedure.html ; official PDF (scan): `https://content.dgft.gov.in/Website/dgftprod/41e45167-bb9c-4362-8984-6c8ad89c89e3/PN no. 19-English (4) (1).pdf`
- **Full 15-year TRQ schedules inserted into Para 2.92:**
  - **(I) ICE Passenger Cars (HS 8703) CBU.** Base BCD 110.0% for >3000cc petrol / >2500cc diesel; 66.0% for the two smaller bands. Year 1: 30.0% in-quota on 10,000 units (large), 50.0% on 5,000 (mid), 50.0% on 5,000 (≤1500cc) — **total quota 20,000**. Rising to Year 5: 10% / 19,000 + 10% / 9,000 + 10% / 9,000 = 37,000. Then declining: Year 10 → 23,800; Year 15 and onwards → 10% on 7,500 + 3,750 + 3,750 = **15,000**. 21 HS codes listed.
  - **(II) Electric/Hybrid/Hydrogen Passenger Cars (HS 8703) CBU — starts Year 6.** Below £40,000 CIF: "No" quota. £40,000–£80,000 CIF: Year 6 50.0% on 400 units → Year 15 10.0% on 2,000. Above £80,000 CIF: Year 6 40.0% on 4,000 → Year 15 10.0% on 20,000. Base rate 110.0%. 16 HS codes.
  - **(III) ICE Goods Vehicles (HS 8704) CBU.** Base rate 44.0%. Year 1: in-quota 37.0%, out-of-quota 41.8%, quota 2,500 → Year 10 and onwards: 8.8% / 22.0% / 3,500. 6 HS codes.
- **20 operating conditions**, including: para 3 — *"At the time of clearance of the import consignment, the importer in India must produce a Certificate of Origin issued by concerned authorities in UK"*; para 5 — applications online via dgft.gov.in → Import Management System → Tariff Rate Quota (TRQ); para 6 — **only OEMs and OEM-authorised dealers/channel partners** eligible; para 7 — pre-purchase agreement from the UK OEM required; paras 8–9 — pro-rata allocation if oversubscribed; para 10 — under-utilisation penalised in the next year's allocation; para 11 — **calendar year (1 Jan–31 Dec)**; paras 13–15 — TRQ carries importer name/address, IEC, Customs notification number, tariff item, quantity, validity; issued electronically and transmitted to **ICES**; imports only on electronic debit; para 16 — validity max 12 months or end of calendar year, whichever earlier; para 17 — importers to endeavour to pass the benefit to the final consumer; para 18 — **modalities reviewable from CY 2028**; para 19 — inserted at **Annexure VII of Appendix 2A HBP 2023**.

> **DRAFTING INCONSISTENCY WORTH FLAGGING:** PN 19 para 3 requires "a Certificate of Origin issued by concerned authorities in UK", which is **irreconcilable with Rule 16(1)(b) of Notification 62/2026-Customs (N.T.)**, under which the only acceptable proof of origin for imports into India is a self-completed origin declaration by the UK exporter or producer. This looks like boilerplate carried over from earlier FTA public notices. Importers of UK vehicles under TRQ face conflicting documentary instructions from DGFT and CBIC. I found no corrigendum.

**(d) Public Notice No. 22/2026-27, dated 20 July 2026** — "Inviting TRQ Applications under India – United Kingdom CETA for Calendar Year (CY) 2026-reg."
- Issued under FTP 2023 paras 1.03 and 2.04, in continuation of PN 19/2026-27.
- **Application window: 21 July 2026 to 4 August 2026** (i.e., it closed today).
- CY2026 quantities: **2,329** (≤1500cc CBU), **2,329** (1500–3000cc petrol / 1500–2500cc diesel), **4,658** (>3000cc petrol / >2500cc diesel), **1,164** (HS 8704 goods vehicles, non-EV/non-hydrogen). These match Table III of Notification 29/2026-Customs exactly.
- Source: https://a2ztaxcorp.net/dgft-invites-trq-applications-for-automobile-imports-under-india-uk-ceta-for-calendar-year-2026/ ; official PDF (scan): `https://content.dgft.gov.in/Website/dgftprod/2f56be4e-71bd-4ad0-a6ab-3b1ce23484f6/PN dated 20.07.2026.pdf`

**(e) Trade Notice No. 11/2026-2027, dated July 13, 2026** — "Electronic filing and Issuance of Preferential Certificate of Origin (CoO) under India-UK CETA with effect from July 15, 2026"
- File No. 01/02/S4/AMZI/EG&TF; signed **(Kamble), Deputy DGFT**
- Full PDF: https://www.epces.in/uploads/highlight/Trade%20notice%2011_2026-2027202607191784473647.pdf
- eCoO rolled out on the **Trade Connect ePlatform, www.trade.gov.in**. **Two routes:** (i) self-declaration — select agreement "**India UK CETA (Self-Declaration)**"; (ii) authorised agency — select "**India-UK CETA (Agency Issued)**".
- Self-declaration mechanics: **DSC mandatory**; scanned ink-signed signature upload mandatory; **no fee**; jurisdictional DGFT RA / SEZ auto-mapped for verification; status shown as "**Auto Approved Pending Issuance**"; generates two copies (Electronic Copy + Physical Copy) bearing a **QR code and digital signature**.
- Verification at https://trade.gov.in → Certificate of Origin → Verify Certificate. Helpdesk: **coo-dgft@gov.in**.

**Approved-exporter question — answered:** **India does NOT operate an "approved exporter" or registered-exporter (REX-style) system under CETA.** For Indian exports to the UK, *any* exporter or producer may self-declare (subject to DSC and DGFT platform registration) or use an Appendix-2B agency. For imports into India, *any* UK exporter or producer may complete an origin declaration — with no registration or approval — backed instead by the **bilateral electronic authentication mechanism in Rule 17(6)–(8) and Annexures D & E**. Assurance is delivered by *ex post* authentication and verification, not by *ex ante* exporter accreditation.

---

## 6. Exchange of diplomatic notes / notes verbales — NOT FOUND

**No date, text or reference to an exchange of notes or notes verbales has been published by either side that I could locate.** What exists:

- **PIB, Ministry of Commerce & Industry, PRID 2274280, posted 17 JUN 2026 8:47PM** states only: *"Following the successful completion of internal procedures and ratifications by both governments, the agreements will formally enter into force on 15th July 2026."* No mention of an exchange of instruments or its date.
- **MEA published nothing through PIB.** PIB archive query for Ministry of External Affairs returned **0 releases for June 2026** and **0 for February 2026**.
- **No joint statement was issued.** The only official bilateral readout is **PMO, PIB PRID 2273817, posted 17 JUN 2026 12:36AM**, "Prime Minister's meeting with Prime Minister of UK on the sidelines of the G7 Summit" — https://www.pib.gov.in/PressReleasePage.aspx?PRID=2273817. Notably it does **not** mention 15 July, does **not** mention steel, and does **not** mention any exchange of notes. It says only: *"The leaders looked forward to the early entry into force of the Comprehensive Economic and Trade Agreement."* (It also records the Liverpool/Bengaluru, York/Mumbai and Bristol/Mumbai campus progress and the India–UK Critical Minerals Global Supply Chain Observatory.)

**Legal inference (not directly evidenced):** CETA **Article 30.6** provides for entry into force 60 days after the exchange of written notifications confirming completion of domestic requirements, **"or on such other date as the Parties may agree."** Because the 15 July date was fixed politically on 16–17 June — only 28–29 days ahead — the agreement almost certainly entered into force under the **"other date as agreed"** limb rather than the 60-day default. This is consistent with the PIB 15 July release recording that "the decision to operationalise the Agreement on 15 July 2026 was taken by the leaders of both countries during their meeting on the sidelines of the G7 Summit in France thirty days earlier."

**FLAGGED UNVERIFIED:** the date of the exchange of notes; whether the UK has laid a Treaty Series command paper recording entry into force.

---

## 7. The 17 June 2026 announcement and the entry-into-force timeline — VERIFIED

**Who announced it:**
- **India — PIB, Ministry of Commerce & Industry, Release ID 2274280, posted 17 JUN 2026 8:47PM by PIB Delhi**, headed *"India and the United Kingdom Unleash a Next Generation Economic Corridor: Comprehensive Economic and Trade Agreement (CETA) and Agreement on Social Security Contributions Set to Enter into Force on 15th July 2026"* — https://www.pib.gov.in/PressReleasePage.aspx?PRID=2274280
- **India — PMO, PIB Release ID 2274338, 17 June 2026**, "Prime Minister hails India-UK Comprehensive Economic and Trade Agreement as a historic milestone for bilateral relations".
- **UK — the UK Government announced it on Wednesday 17 June 2026**, with Business and Trade Secretary **Peter Kyle** quoted: *"We are bringing our landmark trade deal with India into force as quickly as we can, because we want businesses and the public to feel the benefits immediately, including cuts to tariffs of £400m within the first year alone."* — https://www.livemint.com/news/india/indiauk-trade-pact-cepa-social-security-agreement-15-july-11781710046311.html (17 Jun 2026, 10:33 PM IST) and https://www.livemint.com/news/india/ukindia-fta-worth-6-5-billion-to-come-into-force-on-july-15-after-starmer-modi-talks-at-g7-11781708515283.html
- **Foreign Secretary Vikram Misri** described the announcement as among the key outcomes of the G7 engagement.

**Precise timeline:**

| Date | Event |
|---|---|
| May 2021 | Enhanced Trade Partnership and India–UK Roadmap 2030 adopted (PIB 2274280) |
| 31 May 2021 | India–UK Agreement on Cooperation and Mutual Administrative Assistance in Customs Matters signed, London (cited in Rule 26) |
| 6 May 2025 | Negotiations concluded after **14 formal rounds / 800+ technical sessions** |
| **22 July 2025** | Union Cabinet approval — **PTI-sourced only, no official record** |
| **24 July 2025** | CETA signed in London by **Piyush Goyal** and UK Secretary of State for Business and Trade **Jonathan Reynolds**, in the presence of PM Modi and PM Starmer (PIB 2147805; PIB 2274280) |
| **10 February 2026** | **Double Contribution Convention signed** (PIB 2274280) |
| **1 July 2026** | UK steel safeguard measures take effect — tariff-free steel import quota volumes cut ~60%; 188 tariff lines affected. This was the proximate cause of the delay |
| ~mid-June 2026 | Last-minute talks in London resolve the steel differences (Indian Express) |
| **16 June 2026** | Modi–Starmer bilateral, **52nd G7 Summit, Evian-les-Bains, France**; "We did it" hot-mic moment (Bloomberg, 17 June 2026) |
| **17 June 2026** | Both governments announce EIF date of 15 July 2026 |
| **25–27 June 2026** | Goyal visits the UK to finalise customs/regulatory/administrative mechanisms (PIB 2277503) |
| **26 June 2026** | Goyal announces **1,000 advisory personnel** across India to help businesses use CETA (PIB 2278276) |
| **3 July 2026** | Rules of origin notified — 62/2026-Customs (N.T.) |
| **9 July 2026** | DGFT PN 19/2026-27 — TRQ procedure |
| **13 July 2026** | DGFT Trade Notice 11/2026-27 — eCoO |
| **14 July 2026** | Tariff notification 29/2026-Customs |
| **15 July 2026** | **CETA and DCC enter into force** |
| **20 July 2026** | DGFT PN 22/2026-27 — TRQ applications invited for CY2026 |

**On the steel resolution, PIB 2274280 states verbatim:**
> "Following constructive deliberations regarding the UK's upcoming steel measures effective July 1, 2026, both sides mutually agreed to protect commercial interests, minimize market disruptions, and ensure an overall balanced and stable trading environment for exporters. **85% of India's exports are out of the Steel measures. On the lines under the Steel measures India's interest has been protected through a mix of CSQ, residual quota and access under Authorised Use Scheme (AUS).**"

**Was an earlier EIF date expected? — PARTLY VERIFIED.** No earlier date was ever *officially announced* by either government (I found none). Reporting describes implementation as having been "initially delayed due to regulatory approval delays" and then by the steel dispute; the working industry expectation had been roughly one year from signature. **FLAGGED: no officially announced earlier EIF date exists to have been missed.**

---

## 8. The "master implementation list" of 15,000+ UK-origin tariff lines — VERIFIED (secondary)

Source: **Zee Business, published 2026-07-15T03:05:55Z**, "India-UK CETA explained: 15,000+ UK-origin tariff lines qualify for tariff benefits—what's in it for Indian consumers?" — https://www.zeebiz.com/economy-infra/news-india-uk-ceta-explained-15000-uk-origin-products-qualify-for-tariff-benefits-whats-in-it-for-indian-consumers-398842 (403 to direct fetch; full text retrieved via the MSN content API mirror, https://assets.msn.com/content/view/v2/Detail/en-in/AA27VoiA).

Key content:
> "India has listed more than 15,000 items, categorised under over 20 broad merchandise sectors, in a master implementation list of individual tariff-line entries (HS codes) … The list outlines all the tariff commitments India has made to the UK under the deal, **not just the products that become duty-free from July 15 itself** … this list specifies the exact UK-origin goods that are now eligible for preferential import duty rates when imported into India, as per the Rules of Origin prescribed under the trade deal. Indian importers will be required to furnish proof of origin to claim the benefits."

> "An important distinction to draw from the **Ministry of Finance-issued list** is that these products have **not** been made duty-free. Instead, the notification places them across **five tariff buckets, prescribing seven preferential customs duty rates ranging from nil to 80 per cent**." The five buckets: **Immediate zero duty / Lower duty / Phased cuts / TRQ / Protected**.

The 22 sectors named: Agriculture; Livestock and animal products; Fisheries and seafood; Dairy; Fruits and vegetables; Cereals, grains and pulses; Processed food; Beverages; Spices; Chemicals and petrochemicals; Pharmaceuticals; Plastics and rubber; Textiles and apparel; Leather and footwear; Wood, paper and furniture; Metals and metal products; Machinery and industrial equipment; Electrical and electronic goods; Automobiles and auto components; Medical devices and scientific instruments; Gems and jewellery; Miscellaneous manufactured goods.

**Reconciliation caveat (my own analysis, flagged):** Notification 29/2026-Customs Table I contains **11,106 entries**, not 15,000+. The "15,000+" figure appears to describe India's *full tariff-commitment schedule* under CETA Annex 2A / Appendix 2A-a (which spans all staging years and all buckets including excluded and TRQ lines), rather than the count of lines in the exemption notification's Table I. I could not obtain any Government of India document actually titled or described as a "master implementation list" — **the phrase appears to be the reporter's, not the government's. FLAGGED UNVERIFIED.**

**Launch / rollout events — PIB Release ID 2285085, Ministry of Commerce & Industry, "India–UK CETA and Agreement on Social Security Enter into Force", posted 15 JUL 2026 7:54PM by PIB Delhi** — https://www.pib.gov.in/PressReleasePage.aspx?PRID=2285085:
- Inauguration at **Vanijya Bhawan, New Delhi**, attended by British High Commissioner **Lindy Cameron**, Commerce Secretary **Rajesh Agrawal**, and the DGFT.
- **50+ consignments worth over USD 140 million** flagged off from **20+ ports, airports, ICDs, SEZs and factories** (Mundra, Nhava Sheva and Chennai seaports; Mumbai Sahar, Kolkata and Hyderabad air cargo).
- *"the first Certificates of Origin under the Agreement were distributed to exporters. The certificates were issued through the **eCoO 2.0 platform on a self-certification basis**."*
- Parallel ceremonial event in Mumbai by Maharashtra CM **Devendra Fadnavis**.
- *"the decision to operationalise the Agreement on 15 July 2026 was taken by the leaders of both countries during their meeting on the sidelines of the G7 Summit in France thirty days earlier. He stated that all pending issues had been resolved within the stipulated timeline and that all requisite notifications had been issued by both sides."*
- Headline figures: India duty-free on ~99% of tariff lines covering nearly 100% of trade value; UK reductions on 90% of tariff lines covering 92% of current UK exports to India; India 11th-largest UK trading partner in 2025, ~£48bn bilateral trade, 700,000+ jobs, +£25bn/yr trade and ~£5bn/yr GDP in the long run.

---

## 9. Double Contribution Convention — IN FORCE, BUT NO INDIAN IMPLEMENTING INSTRUMENT FOUND

**Established facts:**
- **Signed 10 February 2026** (PIB 2274280: *"To complete the framework, the companion Double Contribution Convention (DCC) was subsequently signed on 10 February 2026."*)
- **Entered into force 15 July 2026, simultaneously with CETA** (PIB 2274280 and PIB 2285085).
- Officially titled the **"Agreement on Social Security"** in Indian usage; DCC is the UK-side name.
- **Exemption period increased from 3 years to 5 years** — an increase negotiated after signature of CETA and repeatedly emphasised by Goyal as "a major gain for India's temporary workers".
- **75,000+ Indian professionals and 900+ companies** expected to benefit; the UK side reciprocally extends 36→60 months for its nationals in India.

**Verified negatives — no Indian implementing instrument located:**
- **No PIB press release for the 10 February 2026 signing.** Queries: Commerce & Industry 10 Feb 2026 (3 releases — Ease of Doing Business / PM GatiShakti / BIOFACH, none relevant); Commerce & Industry 11 Feb 2026 (3 releases, none relevant); Ministry of Labour & Employment Feb 2026 (17 releases, none mentioning the UK or the Convention); PMO Feb 2026 (204 releases, none on the UK); Ministry of Finance Feb 2026 (49 releases, none matching); MEA Feb 2026 (0 releases).
- **No PIB release from the Ministry of Labour & Employment in July 2026** referring to the UK, the Convention, or certificates of coverage (18 releases scanned, all BRICS/e-Shram/ILO topics).
- **No EPFO circular found.** The EPFO "International Workers" page (`https://www.epfindia.gov.in/site_en/International_worker.php`) returned an empty 246-byte response and the **EPFO International Workers Portal (`https://epfoiwu.epfindia.gov.in/iwu`) returned HTTP 302 with no body**, so I could not confirm whether the UK has been added to the list of SSA countries for Certificate of Coverage purposes.
- **No gazette notification** under the EPF & MP Act 1952 / EPF Scheme 1952 or the Code on Social Security 2020 was located.

**FLAGGED UNVERIFIED:** whether EPFO has issued a Certificate of Coverage circular or a paragraph-83 style notification for the UK. Based on Indian practice with other SSAs (e.g., the India–Australia SSA, where EPFO issued an administrative circular and hosted the text on epfindia.gov.in), such a circular is very likely to exist or be imminent, but I found no evidence of it. The DCC's Indian operationalisation appears, so far, to be purely administrative and undocumented in the public record — a notable contrast with the highly formalised customs side.

---

# CONSOLIDATED LIST OF INDIAN LEGAL INSTRUMENTS

| Instrument | Number | Date | Power | In force |
|---|---|---|---|---|
| Tariff concessions | **29/2026-Customs**, G.S.R. 628(E) | 14 Jul 2026 | s.25(1) Customs Act 1962 | 15 Jul 2026 |
| Rules of origin | **62/2026-Customs (N.T.)** | 3 Jul 2026 | s.5(1) Customs Tariff Act 1975 | 15 Jul 2026 |
| CoO framework / self-declaration | **DGFT PN 09/2026-27** | 11 May 2026 | FTP 2023 | — |
| Appendix 2B agencies | **DGFT PN 10/2026-27** | 11 May 2026 | FTP 2023 | — |
| TRQ procedure (Para 2.92, App. 2A Annex VII) | **DGFT PN 19/2026-27** | 9 Jul 2026 | FTP 2023 paras 1.03, 2.04 | — |
| TRQ applications CY2026 | **DGFT PN 22/2026-27** | 20 Jul 2026 | FTP 2023 paras 1.03, 2.04 | window 21 Jul–4 Aug 2026 |
| eCoO electronic filing | **DGFT Trade Notice 11/2026-2027** | 13 Jul 2026 | — | 15 Jul 2026 |

**No primary legislation. No parliamentary instrument. No DCC instrument found.**

---

# EVERYTHING I COULD NOT VERIFY

1. **Cabinet approval of CETA** — no official record of any kind. The 22 July 2025 date is PTI-sourced. Confirmed absent from PIB's Cabinet, Cabinet Committee Decisions and CCEA archives for 22–23 July 2025.
2. **Exchange of diplomatic notes / notes verbales** — no date, text or reference published by either side. No joint statement issued at the G7 bilateral.
3. **Any parliamentary question or ministerial statement specifically addressing why CETA required no parliamentary ratification.**
4. **Contents of DGFT PN 10/2026-27** (which agencies were added to Appendix 2B) — official PDF is a scanned image; no OCR tooling available in this environment.
5. **Any Indian notification, gazette entry or EPFO circular implementing the Double Contribution Convention** — none found across PIB (Labour, Commerce, PMO, Finance, MEA), and EPFO's own pages were unreachable.
6. **Whether a Government of India document actually exists under the name "master implementation list"** — the phrase appears only in Zee Business's reporting, and the 15,000+ count does not match the 11,106 entries in Table I of Notification 29/2026-Customs.
7. **UK Treaty Series / command paper recording entry into force** — not located.

# ONE SUBSTANTIVE PROBLEM IDENTIFIED

**DGFT Public Notice 19/2026-27, condition 3** requires vehicle importers under TRQ to produce "a Certificate of Origin issued by concerned authorities in UK". **Rule 16(1)(b) of Notification 62/2026-Customs (N.T.) permits only an origin declaration completed by the UK exporter or producer for imports into India** — a UK-authority-issued certificate is *not* an applicable proof of origin on the Indian import side. The two instruments give contradictory documentary instructions to the same importer. No corrigendum located as at 4 August 2026.