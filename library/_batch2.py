import sys, os, time
sys.path.insert(0,'.')
from _fetch import fetch, load_manifest, save_manifest
m = load_manifest()

# UK legislation - via reader proxy, saved as text (greppable full statute)
LEGISLATION = [
 ("https://www.legislation.gov.uk/uksi/2017/692/data.xht?view=snippet&wrap=true","06-uk-regulatory","MLR-2017-money-laundering-regs.txt","Money Laundering Regs 2017 - reg 12(2) TCSP, reg 56 no-trading, reg 86 offences"),
 ("https://www.legislation.gov.uk/ukpga/2023/56/data.xht?view=snippet&wrap=true","06-uk-regulatory","ECCTA-2023.txt","Economic Crime and Corporate Transparency Act 2023 - ACSP, IDV"),
 ("https://www.legislation.gov.uk/ukpga/2006/46/data.xht?view=snippet&wrap=true","06-uk-regulatory","Companies-Act-2006.txt","CA 2006 - s86 appropriate address, ss154-156A directors, ss171-177 duties, s251 shadow, s1098A-H ACSP"),
 ("https://www.legislation.gov.uk/ukpga/2007/29/data.xht?view=snippet&wrap=true","06-uk-regulatory","Legal-Services-Act-2007.txt","LSA 2007 - s12/Sch2 reserved activities, s14 offence, s15(4) separate business trap"),
 ("https://www.legislation.gov.uk/ukpga/1999/33/data.xht?view=snippet&wrap=true","06-uk-regulatory","Immigration-Asylum-Act-1999.txt","IAA 1999 Part V - s82 immigration advice, s84 qualified persons, s86A, s91 offences"),
 ("https://www.legislation.gov.uk/ukpga/2000/8/data.xht?view=snippet&wrap=true","06-uk-regulatory","FSMA-2000.txt","FSMA 2000 - s19 general prohibition, s23 offence, ss26-27, s21 promotions, Part XX"),
 ("https://www.legislation.gov.uk/uksi/2001/544/data.xht?view=snippet&wrap=true","06-uk-regulatory","RAO-2001-regulated-activities.txt","Regulated Activities Order 2001 - art 25 arranging, art 53 advising, art 70 exclusion"),
 ("https://www.legislation.gov.uk/ukpga/1974/47/data.xht?view=snippet&wrap=true","06-uk-regulatory","Solicitors-Act-1974.txt","Solicitors Act 1974 - s21 pretending to be a solicitor"),
 ("https://www.legislation.gov.uk/ukpga/2002/29/data.xht?view=snippet&wrap=true","06-uk-regulatory","POCA-2002.txt","Proceeds of Crime Act 2002 - SAR obligations"),
 # CETA implementing SIs
 ("https://www.legislation.gov.uk/uksi/2026/36/data.xht?view=snippet&wrap=true","08-tax-customs","SI-2026-36-customs-tariff-CETA.txt","SI 2026/36 - inserts India Preferential Tariff + Origin Reference Document"),
 ("https://www.legislation.gov.uk/uksi/2026/40/data.xht?view=snippet&wrap=true","08-tax-customs","SI-2026-40-conformity-assessment.txt","SI 2026/40 - NTCABs, CETA Art 7.7.9"),
 ("https://www.legislation.gov.uk/uksi/2026/297/data.xht?view=snippet&wrap=true","08-tax-customs","SI-2026-297-procurement.txt","SI 2026/297 - Procurement Act Sch 9 para 28, treaty state suppliers"),
 ("https://www.legislation.gov.uk/uksi/2026/274/data.xht?view=snippet&wrap=true","08-tax-customs","SI-2026-274-DCC-order.txt","SI 2026/274 - Double Contributions Convention Order in Council"),
 ("https://www.legislation.gov.uk/uksi/2026/794/data.xht?view=snippet&wrap=true","08-tax-customs","SI-2026-794-DCC-amendment.txt","SI 2026/794 - amends DCC schedule"),
 ("https://www.legislation.gov.uk/uksi/2026/703/data.xht?view=snippet&wrap=true","08-tax-customs","SI-2026-703-steel-quota.txt","SI 2026/703 - steel trade measure quota table"),
]

ok=fail=0
for url, sub, fn, note in LEGISLATION:
    st, rel = fetch(url, sub, fn, note=note, manifest=m)
    print(f"  {st:8} {rel}")
    if st=="ok": ok+=1
    elif st!="skip": fail+=1
    save_manifest(m)
    time.sleep(8)
save_manifest(m)
print(f"legislation: {ok} ok, {fail} failed, manifest={len(m)}")
