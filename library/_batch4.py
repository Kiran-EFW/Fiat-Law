import sys, os, time, shutil, hashlib
sys.path.insert(0,'.')
from _fetch import fetch, load_manifest, save_manifest, LIB
m = load_manifest()

# ---- 1. Rescue artefacts already retrieved by research agents in /tmp ----
RESCUE = [
 ("/tmp/indiaceta/cus29.pdf","03-india-government","IN-Notification-29-2026-Customs-tariff-concessions.pdf","CBIC Notn 29/2026-Customs G.S.R.628(E) 14 Jul 2026 - 448pp, Table I 11,106 lines, Table III vehicle TRQ"),
 ("/tmp/indiaceta/ls45.pdf","03-india-government","IN-LokSabha-Q45-FTAs-3Feb2026.pdf","Lok Sabha Starred Q45 3 Feb 2026 - Goyal on FTAs; no ratification column"),
 ("/tmp/ceta_pib.txt","03-india-government","IN-PIB-CETA-backgrounder-15Jul2026.txt","PIB India CETA backgrounder - richest single sector-by-sector source"),
 ("/tmp/imb2026.pdf","07-market-data","GT-India-Meets-Britain-Tracker-2026.pdf","Grant Thornton IMB 2026 - 1,912 companies, GBP105.77bn, 203,549 employees"),
 ("/tmp/imb2025.pdf","07-market-data","GT-India-Meets-Britain-Tracker-2025.pdf","Grant Thornton IMB 2025 - 1,197 companies baseline"),
 ("/tmp/imb2026.txt","99-extracted-text","GT-India-Meets-Britain-Tracker-2026.txt","IMB 2026 extracted text"),
 ("/tmp/imb2025.txt","99-extracted-text","GT-India-Meets-Britain-Tracker-2025.txt","IMB 2025 extracted text"),
 ("/tmp/ch.ods","07-market-data","CompaniesHouse-register-activities.ods","Companies House Register Activities - Table_B1 has the India branch series (313)"),
 ("/tmp/dbt_iir.ods","07-market-data","DBT-inward-investment-results.ods","DBT inward investment results - India 2nd by project count FY2025-26"),
 ("/tmp/dbt22.ods","07-market-data","DBT-inward-investment-2022.ods","DBT inward investment earlier series"),
 ("/tmp/india_fs.pdf","07-market-data","DBT-India-trade-and-investment-factsheet.pdf","DBT India trade and investment factsheet"),
 ("/tmp/ceta_ch10.pdf","05-mobility-immigration","CETA-Ch10-temporary-movement-natural-persons.pdf","CETA Ch10 mobility - Art 10.4(3) no ENT/quota"),
 ("/tmp/ceta_annex10aii_uk.pdf","05-mobility-immigration","CETA-Annex10A-ii-UK-schedule.pdf","UK Mode 4 schedule - ICT 3yrs, CSS 33 subsectors, IP 16, 1800 cultural cap"),
 ("/tmp/ceta_annex10ai_india.pdf","05-mobility-immigration","CETA-Annex10A-i-India-schedule.pdf","India Mode 4 schedule - ICT up to 5 yrs, CSS 27, IP 12, legal services excluded"),
 ("/tmp/an8b_india.pdf","01-ceta-legal-text","CETA-Annex8B-India-services-schedule.pdf","India services schedule - NO legal services entry at all"),
 ("/tmp/an8b_uk.pdf","01-ceta-legal-text","CETA-Annex8B-UK-services-schedule.pdf","UK services schedule - legal services fully bound"),
 ("/tmp/an8c_mfn.pdf","01-ceta-legal-text","CETA-Annex8C-MFN.pdf","MFN lists - India omits legal services entirely"),
 ("/tmp/an8a.pdf","01-ceta-legal-text","CETA-Annex8A-professional-services.pdf","Annex 8A professional services - MRAs best-endeavours, 12mo/36mo"),
]
copied=0
for src, sub, fn, note in RESCUE:
    if not os.path.exists(src): print(f"  missing  {src}"); continue
    dstdir = os.path.join(LIB, sub); os.makedirs(dstdir, exist_ok=True)
    dst = os.path.join(dstdir, fn); rel = os.path.join(sub, fn)
    if rel in m and os.path.exists(dst): continue
    shutil.copy2(src, dst)
    data = open(dst,'rb').read()
    m[rel] = {"url":"(retrieved during research session; see note)","sha256":hashlib.sha256(data).hexdigest(),
              "bytes":len(data),"retrieved":time.strftime("%Y-%m-%d"),"via_proxy":False,"note":note}
    copied+=1; print(f"  copied   {rel} ({len(data):,})", flush=True)
save_manifest(m)
print(f"rescued {copied}")

# ---- 2. PIB India press releases ----
PIB = [
 ("2274280","03-india-government","IN-PIB-2274280-EIF-announcement-17Jun2026.html","PIB 17 Jun 2026 - EIF date announced, DCC signed 10 Feb 2026, steel resolution 85pc"),
 ("2285085","03-india-government","IN-PIB-2285085-CETA-enters-into-force-15Jul2026.html","PIB 15 Jul 2026 - EIF, eCoO 2.0 self-certification, 50+ consignments USD140m"),
 ("2147805","03-india-government","IN-PIB-2147805-CETA-signed-24Jul2025.html","PIB 24 Jul 2025 - signing"),
 ("2273817","03-india-government","IN-PIB-2273817-Modi-Starmer-G7-17Jun2026.html","PMO readout G7 bilateral"),
 ("2277503","03-india-government","IN-PIB-2277503-Goyal-UK-visit-Jun2026.html","Goyal UK visit to finalise mechanisms"),
 ("2278276","03-india-government","IN-PIB-2278276-1000-advisory-personnel.html","Goyal - 1,000 advisory personnel to help businesses use CETA"),
]
for prid, sub, fn, note in PIB:
    url = f"https://www.pib.gov.in/PressReleasePage.aspx?PRID={prid}&reg=3&lang=1"
    st, rel = fetch(url, sub, fn, note=note, manifest=m)
    print(f"  {st:12} {rel}", flush=True); save_manifest(m); time.sleep(3)

# ---- 3. Direct-URL documents ----
DIRECT = [
 ("https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/jul/doc2026715921801.pdf","03-india-government","IN-PIB-CETA-backgrounder-15Jul2026.pdf","PIB CETA backgrounder PDF - sector-by-sector"),
 ("https://gstclub.in/storage/documents/gst_1783768350NotificationNo62-2026-CustomsNT.pdf","03-india-government","IN-Notification-62-2026-Customs-NT-rules-of-origin.pdf","CBIC Notn 62/2026-Cus(N.T.) 3 Jul 2026 - Rules of Origin, 29 rules + Annexures A-E"),
 ("https://www.pdexcil.org/assets/img/notifications/IMPORTANT%20ADVISORY%20%E2%80%93%20India%E2%80%93UK%20CETA.pdf","03-india-government","IN-PDEXCIL-CETA-advisory.pdf","PDEXCIL export council advisory on proof of origin"),
 ("https://www.epces.in/uploads/highlight/Trade%20notice%2011_2026-2027202607191784473647.pdf","03-india-government","IN-DGFT-TradeNotice-11-2026-eCoO.pdf","DGFT Trade Notice 11/2026-27 - eCoO 2.0 electronic filing from 15 Jul 2026"),
 ("https://assets.publishing.service.gov.uk/media/5a7c083ded915d01ba1cab5a/2797.pdf","03-india-government","UK-India-BIPA-1994-Cm2797.pdf","1994 India-UK investment promotion agreement - TERMINATED 22 Mar 2017, 15yr sunset to 2032"),
]
for url, sub, fn, note in DIRECT:
    st, rel = fetch(url, sub, fn, note=note, manifest=m)
    print(f"  {st:12} {rel}", flush=True); save_manifest(m); time.sleep(2)

save_manifest(m)
print("batch4 done, manifest =", len(m))
