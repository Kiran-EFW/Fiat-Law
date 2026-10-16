import sys, os, time, json, hashlib
sys.path.insert(0,'.')
from _fetch import fetch, load_manifest, save_manifest, LIB, curl
m = load_manifest()

def api(path, sub, fn, note):
    url = "https://www.gov.uk/api/content" + path
    outdir = os.path.join(LIB, sub); os.makedirs(outdir, exist_ok=True)
    dest = os.path.join(outdir, fn); rel = os.path.join(sub, fn)
    if rel in m and os.path.exists(dest): return "skip", rel
    if not curl(url, dest): return "FAIL", rel
    raw = open(dest,'rb').read()
    try: j = json.loads(raw)
    except Exception: os.remove(dest); return "NOTJSON", rel
    if j.get("document_type") in ("gone","redirect"): os.remove(dest); return "GONE", rel
    m[rel] = {"url":url,"sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw),
              "retrieved":time.strftime("%Y-%m-%d"),"via_proxy":False,"note":note}
    return "ok(%dk)" % (len(raw)//1024), rel

T = [
 # corrected paths found via the gov.uk search API
 ("/guidance/immigration-rules/immigration-rules-appendix-global-business-mobility-routes","05-mobility-immigration","APP-GBM-all-five-routes.json","Immigration Rules Appendix GBM - ALL FIVE ROUTES in one document. THE authority for salary thresholds: Senior/Specialist and Expansion Worker GBP52,500, Graduate Trainee GBP27,300, high earner GBP73,900. Also SSU 3.3/5.2-5.4 Service Supplier rules."),
 ("/guidance/immigration-rules/immigration-rules-index","05-mobility-immigration","immigration-rules-index.json","Immigration Rules index"),
 ("/government/publications/sponsor-a-global-business-mobility-worker","05-mobility-immigration","sponsor-a-GBM-worker-guidance.json","Sponsor a GBM Worker guidance - GBM3.4 UK footprint test, GBM3.26 CoS cap, GBM3.29 provisional rating, GBM3.37/3.38 the 2-year cliff"),
 ("/government/publications/workers-and-temporary-workers-guidance-for-sponsors-part-2-sponsor-a-worker","05-mobility-immigration","sponsor-guidance-part2.json","Sponsor guidance Part 2 - S5.3/5.4 Immigration Skills Charge GBP480 small / GBP1,320 large; S5.10 not payable on Expansion Worker"),
 ("/uk-visa-sponsorship-employers","05-mobility-immigration","uk-visa-sponsorship-employers-fees.json","Sponsor licence fees and process"),
 ("/government/organisations/immigration-advice-authority","06-uk-regulatory","immigration-advice-authority.json","IAA - the renamed OISC; registration required to give immigration advice"),
 ("/government/publications/register-a-uk-establishment-of-an-overseas-company-os-in01","06-uk-regulatory","ch-OS-IN01-register-uk-establishment.json","OS IN01 - register a UK establishment of an overseas company, GBP124 paper only"),
 ("/guidance/when-you-need-to-verify-your-identity-for-companies-house","06-uk-regulatory","ch-when-verify-identity.json","ECCTA identity verification - who must verify and when"),
 ("/guidance/import-and-export-goods-using-preference-agreements","08-tax-customs","hmrc-preference-agreements.json","HMRC preference agreements - how to claim CETA preferential duty"),
 ("/government/publications/uk-india-ceta-origin-declaration","08-tax-customs","uk-india-ceta-origin-declaration.json","UK-India CETA origin declaration - the self-certification template"),
 ("/guidance/india-young-professionals-scheme-visa-ballot-system","05-mobility-immigration","india-young-professionals-ballot.json","India Young Professionals Scheme ballot - 3,000 places/yr, pre-dates CETA"),
 ("/government/publications/global-business-mobility-routes-caseworker-guidance","05-mobility-immigration","gbm-caseworker-guidance-pub.json","GBM caseworker guidance publication page"),
 ("/guidance/set-up-a-business","04-uk-guidance","set-up-a-business.json","gov.uk set up a business"),
 ("/limited-company-formation","04-uk-guidance","limited-company-formation.json","gov.uk limited company formation"),
 ("/government/publications/uk-india-free-trade-agreement-explainer","02-ceta-official-analysis","DBT-ceta-explainer.json","DBT CETA explainer"),
]
for p,s,f,n in T:
    st, rel = api(p,s,f,n); print(f"  {st:12} {rel}", flush=True); save_manifest(m); time.sleep(1)

# DBT inward investment 2024-25 ODS - direct, no proxy (proxy mangles binaries)
u="https://assets.publishing.service.gov.uk/media/6857d0cd4b0e39ba39ba7a2b/DBT_Inward_Investment_Results_2024_to_2025.ods"
d=os.path.join(LIB,"07-market-data","DBT-inward-investment-results-2024-25.ods")
if curl(u,d) and os.path.getsize(d)>10000:
    raw=open(d,'rb').read()
    m["07-market-data/DBT-inward-investment-results-2024-25.ods"]={"url":u,"sha256":hashlib.sha256(raw).hexdigest(),
      "bytes":len(raw),"retrieved":time.strftime("%Y-%m-%d"),"via_proxy":False,
      "note":"DBT inward investment results 2024-25 - India 93 projects (2nd), 12,687 jobs"}
    print("  ok           07-market-data/DBT-inward-investment-results-2024-25.ods")
else:
    print("  FAIL         DBT inward investment 2024-25")
save_manifest(m)
print("batch6 done, manifest =", len(m))
