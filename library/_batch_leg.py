import sys, os, time, subprocess, json, hashlib
sys.path.insert(0,'.')
from _fetch import load_manifest, save_manifest, LIB

TARGETS = [
 # (url, subdir, filename, note)
 ("https://www.legislation.gov.uk/uksi/2017/692","06-uk-regulatory","MLR-2017-money-laundering-regs.md","Money Laundering Regs 2017 - reg 12(2) TCSP definition, reg 56 no-trading-before-approval, reg 86 offences (2yrs)"),
 ("https://www.legislation.gov.uk/ukpga/2023/56","06-uk-regulatory","ECCTA-2023.md","Economic Crime and Corporate Transparency Act 2023 - ACSP regime, identity verification"),
 ("https://www.legislation.gov.uk/ukpga/2006/46","06-uk-regulatory","Companies-Act-2006.md","CA 2006 - s86 appropriate address, ss154-156A directors, ss171-177 duties, s251 shadow director, ss1098A-H ACSP, s1067A"),
 ("https://www.legislation.gov.uk/ukpga/2007/29","06-uk-regulatory","Legal-Services-Act-2007.md","LSA 2007 - s12+Sch2 reserved activities, s14 offence, s15(4) separate-business trap, s17"),
 ("https://www.legislation.gov.uk/ukpga/1999/33","06-uk-regulatory","Immigration-Asylum-Act-1999.md","IAA 1999 Part V - s82 immigration advice, s84 qualified persons, s86A regulators, s91 offences+officer liability"),
 ("https://www.legislation.gov.uk/ukpga/2000/8","06-uk-regulatory","FSMA-2000.md","FSMA 2000 - s19 general prohibition, s21 promotions, s23 offence, ss26-27 unenforceability, Part XX exempt professional firms"),
 ("https://www.legislation.gov.uk/uksi/2001/544","06-uk-regulatory","RAO-2001-regulated-activities-order.md","RAO 2001 - art 25 arranging deals in investments, art 53 advising, art 70 sale-of-body-corporate exclusion"),
 ("https://www.legislation.gov.uk/ukpga/1974/47","06-uk-regulatory","Solicitors-Act-1974.md","Solicitors Act 1974 - s21 pretending to be a solicitor"),
 ("https://www.legislation.gov.uk/uksi/2026/36","08-tax-customs","SI-2026-36-customs-tariff-CETA.md","SI 2026/36 - India Preferential Tariff + Origin Reference Document v1.0"),
 ("https://www.legislation.gov.uk/uksi/2026/297","08-tax-customs","SI-2026-297-procurement-treaty-state.md","SI 2026/297 - Procurement Act 2023 Sch 9 para 28, Indian treaty state suppliers"),
 ("https://www.legislation.gov.uk/uksi/2026/274","08-tax-customs","SI-2026-274-DCC-order-in-council.md","SI 2026/274 - Double Contributions Convention Order in Council"),
 ("https://www.legislation.gov.uk/uksi/2026/794","08-tax-customs","SI-2026-794-DCC-36-to-60-months.md","SI 2026/794 - raises detached worker period 36 to 60 months KEY"),
 ("https://www.legislation.gov.uk/uksi/2001/1004","08-tax-customs","Social-Security-Contributions-Regs-2001.md","SSCR 2001 regs 145(2)/146 - the pre-existing 52-week NIC exemption the DCC extends"),
 ("https://www.legislation.gov.uk/uksi/2026/703","08-tax-customs","SI-2026-703-steel-quota.md","SI 2026/703 - steel trade measure quota table, 40pc single-country cap"),
 ("https://www.legislation.gov.uk/ukpga/2023/54","06-uk-regulatory","Procurement-Act-2023.md","Procurement Act 2023 - s89 treaty state suppliers"),
]

m = load_manifest()
delay = 20
for url, sub, fn, note in TARGETS:
    rel = os.path.join(sub, fn)
    dest = os.path.join(LIB, rel)
    if rel in m and os.path.exists(dest):
        print(f"  skip     {rel}", flush=True); continue
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    got = False
    for attempt in range(5):
        r = subprocess.run(["curl","-sL","--max-time","180","https://r.jina.ai/"+url,"-o",dest],
                           capture_output=True)
        if os.path.exists(dest):
            data = open(dest,'rb').read()
            low = data[:3000].lower()
            if len(data) > 5000 and b"just a moment" not in low and b"rate limit" not in low:
                m[rel] = {"url": url, "sha256": hashlib.sha256(data).hexdigest(),
                          "bytes": len(data), "retrieved": time.strftime("%Y-%m-%d"),
                          "via_proxy": True, "note": note}
                save_manifest(m)
                print(f"  ok       {rel} ({len(data):,} bytes)", flush=True)
                got = True
                break
        wait = delay * (attempt + 1)
        print(f"  retry {attempt+1} in {wait}s: {fn}", flush=True)
        time.sleep(wait)
    if not got:
        print(f"  FAILED   {rel}", flush=True)
        if os.path.exists(dest): os.remove(dest)
    time.sleep(delay)
save_manifest(m)
print("legislation batch done, manifest =", len(m))
