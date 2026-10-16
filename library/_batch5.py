import sys, os, time, json, shutil, hashlib, subprocess, re
sys.path.insert(0,'.')
from _fetch import fetch, load_manifest, save_manifest, LIB, curl, UA
m = load_manifest()

def content_api(path, sub, fn, note):
    """Fetch gov.uk Content API JSON; accept short bodies that are valid JSON."""
    url = "https://www.gov.uk/api/content" + path
    outdir = os.path.join(LIB, sub); os.makedirs(outdir, exist_ok=True)
    dest = os.path.join(outdir, fn); rel = os.path.join(sub, fn)
    if rel in m and os.path.exists(dest): return "skip", rel
    if not curl(url, dest): return "FAIL", rel
    raw = open(dest,'rb').read()
    try: j = json.loads(raw)
    except Exception: os.remove(dest); return "NOTJSON", rel
    if j.get("document_type") in ("gone","redirect") or (not j.get("details") and not j.get("title")):
        os.remove(dest); return "GONE(%s)" % j.get("document_type"), rel
    m[rel] = {"url":url,"sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw),
              "retrieved":time.strftime("%Y-%m-%d"),"via_proxy":False,"note":note}
    return "ok(%dk)" % (len(raw)//1024), rel

print("--- gov.uk publications that have no PDF attachment (HTML-only) ---", flush=True)
HTML_PUBS = [
 ("/government/publications/uk-india-trade-deal-conclusion-summary","02-ceta-official-analysis","DBT-conclusion-summary.json","DBT conclusion summary of the CETA negotiation outcome"),
 ("/government/publications/uk-india-free-trade-agreement-technical-note","02-ceta-official-analysis","DBT-technical-note.json","DBT technical note - chapter-by-chapter summary"),
 ("/government/publications/uk-india-trade-deal-double-contributions-convention-explainer","02-ceta-official-analysis","DBT-DCC-explainer.json","DBT explainer on the Double Contribution Convention"),
 ("/government/publications/uk-india-free-trade-agreement-business-mobility-explainer","02-ceta-official-analysis","DBT-business-mobility-explainer.json","DBT business mobility explainer - NOTE: salary figures on this page are stale, use the Immigration Rules"),
 ("/government/publications/joint-section-42-advice-uk-india-free-trade-agreement","02-ceta-official-analysis","s42-joint-advice-FSA-FSS.json","Joint FSA/FSS s42 Agriculture Act advice"),
 ("/government/publications/national-treatment-of-conformity-assessment-bodies-ntcabs-with-india","02-ceta-official-analysis","NTCAB-conformity-assessment-india.json","National treatment of conformity assessment bodies with India"),
 ("/government/publications/india-uk-virtual-summit-may-2021-roadmap-2030-for-a-comprehensive-strategic-partnership","02-ceta-official-analysis","Roadmap-2030-UK-India.json","2021 Roadmap 2030 - the political frame the CETA sits in"),
]
for p, s, f, n in HTML_PUBS:
    st, rel = content_api(p, s, f, n); print(f"  {st:12} {rel}", flush=True); save_manifest(m); time.sleep(1)

print("--- UK market-entry guidance and directories (04) ---", flush=True)
GUIDE = [
 ("/guidance/money-laundering-regulations-who-needs-to-register","06-uk-regulatory","hmrc-mlr-tcsp-who-registers.json","HMRC MLR - TCSP definition: forming companies, registered office, acting as director, nominee shareholder"),
 ("/guidance/money-laundering-regulations-trust-or-company-service-provider-registration","06-uk-regulatory","hmrc-tcsp-registration.json","HMRC TCSP registration - 'must not run your business until HMRC has confirmed'"),
 ("/guidance/register-of-people-with-significant-control","06-uk-regulatory","ch-psc-register.json","PSC register requirements"),
 ("/guidance/register-as-an-overseas-company","06-uk-regulatory","ch-register-overseas-company-branch.json","UK establishment (branch) registration - GBP124 paper only"),
 ("/government/organisations/companies-house/about-our-services","04-uk-guidance","ch-about-our-services.json","Companies House service overview"),
 ("/guidance/immigration-rules/immigration-rules-appendix-global-business-mobility-uk-expansion-worker","05-mobility-immigration","APP-GBM-UK-Expansion-Worker-rules.json","Immigration Rules Appendix GBM UK Expansion Worker - salary GBP52,500 / high earner GBP73,900"),
 ("/guidance/immigration-rules/immigration-rules-appendix-global-business-mobility-senior-or-specialist-worker","05-mobility-immigration","APP-GBM-Senior-or-Specialist-Worker-rules.json","Immigration Rules Appendix GBM Senior or Specialist Worker"),
 ("/guidance/immigration-rules/immigration-rules-appendix-global-business-mobility-service-supplier","05-mobility-immigration","APP-GBM-Service-Supplier-rules.json","Appendix GBM Service Supplier - SSU 5.2-5.4 UK client must be the A-rated sponsor; SSU 3.3 India 1,800/yr cultural cap"),
 ("/guidance/immigration-rules/immigration-rules-appendix-global-business-mobility-graduate-trainee","05-mobility-immigration","APP-GBM-Graduate-Trainee-rules.json","Appendix GBM Graduate Trainee - salary GBP27,300"),
 ("/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations","05-mobility-immigration","APP-Skilled-Occupations-going-rates.json","Appendix Skilled Occupations - going rates by SOC code"),
 ("/government/publications/visa-regulations-revised-table","05-mobility-immigration","home-office-fees-table.json","Home Office fees table - sponsor licence, CoS, visa fees"),
 ("/government/publications/immigration-skills-charge","05-mobility-immigration","immigration-skills-charge.json","ISC GBP480 small / GBP1,320 large per 12 months; not payable on UK Expansion Worker"),
 ("/guidance/immigration-advice-and-services","06-uk-regulatory","immigration-advice-authority-regulation.json","IAA (formerly OISC) regulation of immigration advice - s84 IAA 1999 offence"),
 ("/guidance/set-up-a-business","04-uk-guidance","set-up-a-business.json","Setting up a business in the UK - the free public guidance your clients will read first"),
 ("/browse/business/setting-up","04-uk-guidance","browse-setting-up-business.json","gov.uk setting-up-a-business browse page"),
 ("/guidance/vat-registration-for-overseas-sellers","08-tax-customs","vat-overseas-sellers.json","VAT for overseas sellers"),
 ("/guidance/paye-and-payroll-for-employers","08-tax-customs","paye-payroll-employers.json","PAYE and payroll obligations"),
 ("/guidance/rules-of-origin-for-goods-moving-between-the-uk-and-india","08-tax-customs","rules-of-origin-uk-india.json","HMRC rules of origin guidance for UK-India CETA"),
 ("/guidance/claiming-preferential-rates-of-duty-between-the-uk-and-india","08-tax-customs","claiming-preference-uk-india.json","HMRC claiming preferential rates UK-India"),
 ("/government/collections/uk-india-trade-agreement","02-ceta-official-analysis","DBT-collection-uk-india-trade-agreement.json","The DBT collection page - master index of all official CETA publications"),
]
for p, s, f, n in GUIDE:
    st, rel = content_api(p, s, f, n); print(f"  {st:12} {rel}", flush=True); save_manifest(m); time.sleep(1)

print("--- Grant Thornton / market data ---", flush=True)
DIRECT = [
 ("https://www.grantthornton.co.uk/globalassets/1.-member-firms/united-kingdom/pdf/documents/doing-business-in-the-uk.pdf","07-market-data","GT-Doing-business-in-the-UK.pdf","Grant Thornton Doing Business in the UK - competitor collateral"),
 ("https://assets.publishing.service.gov.uk/media/6857d0cd4b0e39ba39ba7a2b/DBT_Inward_Investment_Results_2024_to_2025.ods","07-market-data","DBT-inward-investment-results-2024-25.ods","DBT inward investment results 2024-25"),
]
for u, s, f, n in DIRECT:
    st, rel = fetch(u, s, f, note=n, manifest=m); print(f"  {st:12} {rel}", flush=True); save_manifest(m)

print("--- copying this session's research reports ---", flush=True)
REPORTS = {
 "a8c7a33290c14cb22":("competitive-landscape-6-tiers.md","Competitive landscape: Big4/mid-tier India desks, 35 law firms, Indian firms with UK arms, CSPs with published prices, boutiques, government. Contains the only published price points in the corridor."),
 "a44415ed47a3fa21b":("free-and-subsidised-alternatives-WTP.md","Free/subsidised competition (DBT, L&P, 6 regional agencies, Innovate UK, BBB, UKIBC, CII, FICCI, ASSOCHAM, NASSCOM, TiE) and the willingness-to-pay compression analysis by layer."),
 "a7a64120039a7324d":("london-and-partners-and-regional-IPAs.md","London & Partners and regional inward-investment agencies: what is free, verbatim disclaimers, India offices, partner directories."),
 "a25e7278fc1880371":("indian-trade-bodies-uk-presence.md","Indian trade bodies with UK presence - membership fee ladders and what they actually deliver."),
 "aee0f0a52ad631906":("innovate-uk-and-visa-endorsing-bodies.md","Innovate UK, British Business Bank, Global Talent and Innovator Founder endorsing bodies - fees and eligibility."),
 "ae29311f54e7ba26d":("ceta-procurement-and-investment.md","CETA Chapter 15 procurement and the absence of an investment chapter/ISDS; 1994 BIPA sunset."),
 "acc869f145947e4e8":("ceta-agent-report-acc869f.md","CETA research thread."),
 "a5e8200ca36e2e7c3":("ceta-agent-report-a5e8200.md","CETA research thread."),
 "a2b57aa41920998cc":("ceta-agent-report-a2b57aa.md","CETA research thread."),
 "a3ebe39c259fdf1c6":("ceta-agent-report-a3ebe39.md","CETA research thread."),
 "a498f1b03a96ce344":("ceta-agent-report-a498f1b.md","CETA research thread."),
 "a8cdb9386088c6452":("ceta-agent-report-a8cdb93.md","CETA research thread."),
 "a94816298e5e203bc":("ceta-agent-report-a948162.md","CETA research thread."),
 "ac79781f3b5754c40":("ceta-agent-report-ac79781.md","CETA research thread."),
 "af95ed6b7874d8487":("ceta-agent-report-af95ed6.md","CETA research thread."),
}
rd = os.path.join(LIB,"00-research-reports"); os.makedirs(rd, exist_ok=True)
for aid,(fn,note) in REPORTS.items():
    src = f"/tmp/agentreports/{aid}.md"
    if not os.path.exists(src) or os.path.getsize(src) < 2000: continue
    dst = os.path.join(rd, fn); shutil.copy2(src, dst)
    data = open(dst,'rb').read(); rel = os.path.join("00-research-reports", fn)
    m[rel] = {"url":"(derived: research agent report, this session)","sha256":hashlib.sha256(data).hexdigest(),
              "bytes":len(data),"retrieved":time.strftime("%Y-%m-%d"),"via_proxy":False,"note":note}
    print(f"  report  {fn} ({len(data):,})", flush=True)
save_manifest(m)
print("batch5 done, manifest =", len(m))
