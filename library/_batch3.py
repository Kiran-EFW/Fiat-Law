import sys, os, time, json, subprocess
sys.path.insert(0,'.')
from _fetch import fetch, govuk_assets, load_manifest, save_manifest, UA
m = load_manifest()

# --- gov.uk publication pages: grab their PDF/ODS/DOCX attachments ---
PUBS = [
 ("/government/publications/uk-india-free-trade-agreement-impact-assessment","02-ceta-official-analysis","Official Impact Assessment 129pp - CGE modelling, +£4.8bn UK GDP"),
 ("/government/publications/uk-india-trade-deal-conclusion-summary","02-ceta-official-analysis","Conclusion summary - chapter-by-chapter outcomes"),
 ("/government/publications/uk-india-free-trade-agreement-technical-note","02-ceta-official-analysis","Technical notes"),
 ("/government/publications/uk-india-trade-deal-double-contributions-convention-explainer","02-ceta-official-analysis","DCC explainer - 60-month exemption KEY"),
 ("/government/publications/uk-india-free-trade-agreement-business-mobility-explainer","05-mobility-immigration","Business mobility explainer KEY"),
 ("/government/publications/uk-india-ceta-draft-explanatory-memorandum","02-ceta-official-analysis","Draft explanatory memorandum"),
 ("/government/publications/uk-india-fta-report-under-section-42-of-agriculture-act-2020","02-ceta-official-analysis","s42 Agriculture Act report + FSA/FSS Annex A - SPS border checks"),
 ("/government/publications/joint-section-42-advice-uk-india-free-trade-agreement","02-ceta-official-analysis","Joint s42 advice Jun 2026"),
 ("/government/publications/uk-india-fta-advice-from-trade-and-agriculture-commission","02-ceta-official-analysis","Trade and Agriculture Commission advice"),
 ("/government/publications/uk-india-trade-deal-impact-on-industrial-strategy-sectors","02-ceta-official-analysis","Impact on industrial strategy sectors"),
 ("/government/publications/ukindia-comprehensive-economic-and-trade-agreement-cs-india-no12026","01-ceta-legal-text","Command Paper CP1496 CS India No.1/2026 - treaty laid under CRaG"),
 ("/government/publications/ukindia-comprehensive-economic-and-trade-agreement-ts-no302026","01-ceta-legal-text","Treaty Series No.30/2026 - in-force text"),
 ("/government/publications/national-treatment-of-conformity-assessment-bodies-ntcabs-with-india","02-ceta-official-analysis","NTCABs with India"),
 ("/government/publications/india-uk-vision-2035","03-india-government","India-UK Vision 2035"),
 ("/government/publications/india-uk-virtual-summit-may-2021-roadmap-2030-for-a-comprehensive-strategic-partnership","03-india-government","Roadmap 2030"),
 ("/government/publications/india-tax-treaties","08-tax-customs","India-UK double taxation convention"),
]
ok=0; fails=[]
for path, sub, note in PUBS:
    assets = govuk_assets(path, m)
    if not assets:
        fails.append("no-assets:"+path); continue
    for a in assets:
        st, rel = fetch(a, sub, note=note, manifest=m)
        print(f"  {st:12} {rel}", flush=True)
        if st=="ok": ok+=1
        elif st!="skip": fails.append(a)
    save_manifest(m)

# --- gov.uk guidance / news pages via Content API (clean JSON+HTML body) ---
GUIDANCE = [
 ("/guidance/register-to-complete-origin-declarations-under-the-uk-india-free-trade-agreement","08-tax-customs","hmrc-register-origin-declarations.json","HMRC exporter registration - EORI, CBIC email mechanics"),
 ("/government/publications/uks-steel-trade-measure-from-1-july-2026","08-tax-customs","uk-steel-trade-measure-2026.json","Steel trade measure - 51pc quota cut, 50pc out-of-quota"),
 ("/government/publications/carbon-border-adjustment-mechanism-cbam-policy-summary","08-tax-customs","uk-cbam-policy-summary.json","UK CBAM from 1 Jan 2027 - no India exemption"),
 # Companies House / ECCTA
 ("/guidance/registered-office-address-rules-for-limited-companies","06-uk-regulatory","ch-registered-office-rules.json","CA2006 s86 appropriate address - PO boxes banned"),
 ("/guidance/changes-to-uk-company-law","06-uk-regulatory","ch-changes-to-company-law.json","ECCTA implementation timeline"),
 ("/guidance/register-as-a-companies-house-authorised-agent","06-uk-regulatory","ch-acsp-register-authorised-agent.json","ACSP registration - AML supervision precondition"),
 ("/guidance/identity-verification-at-companies-house","06-uk-regulatory","ch-identity-verification.json","IDV mandatory from 18 Nov 2025"),
 ("/guidance/company-directors-and-secretaries","06-uk-regulatory","ch-directors-and-secretaries.json","Director requirements - NO UK residency requirement"),
 ("/government/publications/companies-house-fees","06-uk-regulatory","ch-fees.json","Companies House fee schedule"),
 # HMRC AML / TCSP
 ("/guidance/money-laundering-regulations-who-needs-to-register","06-uk-regulatory","hmrc-mlr-who-must-register.json","Who must register - TCSP scope"),
 ("/guidance/money-laundering-regulations-trust-or-company-service-provider-registration","06-uk-regulatory","hmrc-tcsp-registration.json","TCSP registration - must NOT trade before approval"),
 ("/guidance/money-laundering-regulations-registration-fees","06-uk-regulatory","hmrc-mlr-fees.json","MLR fees from 1 Dec 2025 - 300 app, 400 premises, 500 fit-and-proper"),
 ("/guidance/money-laundering-regulations-apply-for-the-fit-and-proper-test-or-approval","06-uk-regulatory","hmrc-fit-and-proper.json","Fit and proper test"),
 # Immigration / sponsor
 ("/uk-expansion-worker-visa","05-mobility-immigration","uk-expansion-worker-visa.json","Expansion Worker - 2yr cap, no settlement"),
 ("/intracompany-transfer-worker-visa","05-mobility-immigration","senior-or-specialist-worker-visa.json","Senior or Specialist Worker (ICT)"),
 ("/skilled-worker-visa","05-mobility-immigration","skilled-worker-visa.json","Skilled Worker - salary thresholds"),
 ("/uk-visa-sponsorship-employers","05-mobility-immigration","sponsor-licence-employers.json","Sponsor licence - fees and process"),
 ("/government/publications/workers-and-temporary-workers-guidance-for-sponsors-part-1-apply-for-a-licence","05-mobility-immigration","sponsor-guidance-part1.json","Sponsor guidance Part 1"),
 ("/government/publications/global-business-mobility-routes","05-mobility-immigration","gbm-routes-caseworker-guidance.json","GBM routes caseworker guidance"),
 # Tax / VAT for overseas businesses
 ("/guidance/vat-registration-for-overseas-businesses","08-tax-customs","vat-overseas-businesses-NETP.json","NETP nil VAT threshold - register from first supply"),
 ("/guidance/register-for-vat","08-tax-customs","vat-registration.json","VAT registration"),
 ("/guidance/social-security-contributions-for-workers-coming-to-the-uk-from-india","08-tax-customs","dcc-social-security-india.json","DCC operational guidance"),
 # Setting up
 ("/limited-company-formation","06-uk-regulatory","limited-company-formation.json","Company formation"),
 ("/set-up-business-uk","06-uk-regulatory","set-up-business-uk-overseas.json","Overseas company setting up in UK"),
 ("/guidance/uk-market-conformity-assessment-bodies","06-uk-regulatory","uk-conformity-assessment-bodies.json","UKCA / conformity"),
]
for path, sub, fn, note in GUIDANCE:
    url = "https://www.gov.uk/api/content" + path
    st, rel = fetch(url, sub, fn, note=note, manifest=m)
    print(f"  {st:12} {rel}", flush=True)
    if st=="ok": ok+=1
    elif st!="skip": fails.append(url)
    save_manifest(m)

save_manifest(m)
print(f"\nbatch3: {ok} new, {len(fails)} failed, manifest={len(m)}")
for f in fails: print("  FAIL", f)
