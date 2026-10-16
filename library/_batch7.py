import sys, os, json, re, time, hashlib, subprocess
sys.path.insert(0,'.')
from _fetch import load_manifest, save_manifest, LIB, curl
m = load_manifest()

# 1. Pull attachment assets referenced inside the publication JSONs we already have
print("--- attachments from publication JSONs ---", flush=True)
SRC = [
 ("05-mobility-immigration/sponsor-a-GBM-worker-guidance.json","05-mobility-immigration","Sponsor a GBM Worker guidance attachment"),
 ("05-mobility-immigration/sponsor-guidance-part2.json","05-mobility-immigration","Sponsor guidance Part 2 attachment - Immigration Skills Charge S5.3-5.10"),
 ("05-mobility-immigration/gbm-caseworker-guidance-pub.json","05-mobility-immigration","GBM caseworker guidance attachment"),
 ("05-mobility-immigration/home-office-fees-table.json","05-mobility-immigration","Home Office fees table attachment"),
 ("02-ceta-official-analysis/DBT-collection-uk-india-trade-agreement.json","02-ceta-official-analysis","DBT collection attachment"),
]
for rel, sub, note in SRC:
    p = os.path.join(LIB, rel)
    if not os.path.exists(p): continue
    txt = open(p, encoding="utf-8", errors="replace").read()
    urls = sorted(set(re.findall(r'https://assets\.publishing\.service\.gov\.uk/[^"\\\s<>]+\.(?:pdf|odt|ods|docx|csv)', txt)))
    for u in urls[:6]:
        fn = os.path.basename(u)
        dest = os.path.join(LIB, sub, fn); r2 = os.path.join(sub, fn)
        if r2 in m and os.path.exists(dest): continue
        if curl(u, dest) and os.path.getsize(dest) > 5000:
            raw = open(dest,'rb').read()
            m[r2] = {"url":u,"sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw),
                     "retrieved":time.strftime("%Y-%m-%d"),"via_proxy":False,"note":note}
            print(f"  ok  {r2} ({len(raw):,})", flush=True)
        elif os.path.exists(dest): os.remove(dest)
save_manifest(m)

# 2. Extract text from the PDFs that matter most for future grepping
print("--- text extraction ---", flush=True)
try:
    from pypdf import PdfReader
except ImportError:
    subprocess.run([sys.executable,"-m","pip","install","-q","pypdf"])
    from pypdf import PdfReader

OUT = os.path.join(LIB, "99-extracted-text"); os.makedirs(OUT, exist_ok=True)
targets = []
for sub in ("01-ceta-legal-text","02-ceta-official-analysis","03-india-government",
            "05-mobility-immigration","07-market-data","08-tax-customs"):
    d = os.path.join(LIB, sub)
    if not os.path.isdir(d): continue
    for fn in sorted(os.listdir(d)):
        if fn.lower().endswith(".pdf"): targets.append((sub, fn))
print(f"  {len(targets)} PDFs to extract", flush=True)
done = 0
for sub, fn in targets:
    dest = os.path.join(OUT, sub + "__" + fn[:-4] + ".txt")
    if os.path.exists(dest) and os.path.getsize(dest) > 200: continue
    src = os.path.join(LIB, sub, fn)
    try:
        r = PdfReader(src)
        parts = []
        for i, pg in enumerate(r.pages):
            try: parts.append(pg.extract_text() or "")
            except Exception: parts.append("")
        txt = "\n".join(parts)
        if len(txt.strip()) < 100: 
            print(f"  SCANNED/EMPTY {sub}/{fn}", flush=True); continue
        with open(dest,"w",encoding="utf-8") as f:
            f.write(f"# SOURCE: library/{sub}/{fn}\n# pages: {len(r.pages)}\n\n{txt}")
        done += 1
        if done % 15 == 0: print(f"  ...{done} extracted", flush=True)
    except Exception as e:
        print(f"  ERR {sub}/{fn}: {type(e).__name__}", flush=True)
print(f"  extracted {done} PDFs to 99-extracted-text/", flush=True)

# 3. Reconcile: register every file on disk that the concurrent batches lost from the manifest
print("--- manifest reconcile ---", flush=True)
added = 0
for sub in sorted(os.listdir(LIB)):
    d = os.path.join(LIB, sub)
    if not os.path.isdir(d) or sub.startswith("_") or sub == "__pycache__": continue
    for fn in sorted(os.listdir(d)):
        rel = os.path.join(sub, fn); p = os.path.join(d, fn)
        if not os.path.isfile(p) or rel in m: continue
        raw = open(p,'rb').read()
        m[rel] = {"url":"(recorded during reconcile; concurrent batch lost the URL)",
                  "sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw),
                  "retrieved":time.strftime("%Y-%m-%d"),"via_proxy":None,"note":""}
        added += 1
save_manifest(m)
print(f"  reconciled {added} files; manifest now {len(m)} entries", flush=True)
tot = sum(v["bytes"] for v in m.values())
print(f"  total {tot/1024/1024:.0f} MB", flush=True)
