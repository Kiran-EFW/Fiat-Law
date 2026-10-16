#!/usr/bin/env python3
"""Library fetcher for the Fiat Law CETA research corpus.

Downloads official source documents into the library tree and records
provenance (URL, SHA-256, size, retrieval date) in _manifest.json.

Re-runnable: already-downloaded files are skipped unless --force.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse

LIB = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(LIB, "_manifest.json")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

# Domains behind a WAF that reject direct curl; reachable via the jina.ai reader proxy.
WAF_BLOCKED = ("legislation.gov.uk", "publications.parliament.uk",
               "committees.parliament.uk", "hansard.parliament.uk",
               "solicitors.lawsociety.org.uk")


def load_manifest():
    if os.path.exists(MANIFEST):
        with open(MANIFEST) as f:
            return json.load(f)
    return {}


def save_manifest(m):
    with open(MANIFEST, "w") as f:
        json.dump(m, f, indent=2, sort_keys=True)


def curl(url, dest, proxy=False, timeout=120):
    target = url
    if proxy:
        target = "https://r.jina.ai/" + url
    cmd = ["curl", "-sL", "--max-time", str(timeout), "--retry", "2",
           "-A", UA, "-H", "Accept-Language: en-GB,en;q=0.9", target, "-o", dest]
    r = subprocess.run(cmd, capture_output=True)
    return r.returncode == 0 and os.path.exists(dest) and os.path.getsize(dest) > 512


def fetch(url, subdir, filename=None, note="", manifest=None, force=False):
    """Fetch one URL into library/<subdir>/<filename>."""
    if filename is None:
        filename = os.path.basename(urllib.parse.urlparse(url).path) or "index.html"
    outdir = os.path.join(LIB, subdir)
    os.makedirs(outdir, exist_ok=True)
    dest = os.path.join(outdir, filename)
    rel = os.path.join(subdir, filename)

    if os.path.exists(dest) and not force and rel in manifest:
        return "skip", rel

    proxy = any(d in url for d in WAF_BLOCKED)
    ok = curl(url, dest, proxy=proxy)
    if not ok and not proxy:
        # retry through the reader proxy on failure
        ok = curl(url, dest, proxy=True)
    if not ok:
        if os.path.exists(dest):
            os.remove(dest)
        return "FAIL", rel

    with open(dest, "rb") as f:
        data = f.read()

    # Reject WAF challenge pages / error pages masquerading as content
    head = data[:3000].lower()
    bad = None
    for pat in (b"x-amzn-waf", b"just a moment", b"attention required! | cloudflare",
                b"rate limit exceeded", b"<title>404", b"error 1015", b"too many requests"):
        if pat in head:
            bad = pat.decode()
            break
    if bad is None and len(data) < 3000 and b"%pdf" not in head:
        bad = "short:%d:%s" % (len(data), head[:120].decode("utf-8", "replace").replace("\n", " "))
    if bad:
        os.remove(dest)
        return "BLOCKED(%s)" % bad, rel

    manifest[rel] = {
        "url": url,
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
        "retrieved": time.strftime("%Y-%m-%d"),
        "via_proxy": proxy,
        "note": note,
    }
    return "ok", rel


def govuk_assets(page_path, manifest):
    """Given a gov.uk publication path, return list of (asset_url, title)."""
    url = "https://www.gov.uk" + page_path
    tmp = "/tmp/_govuk_page.html"
    if not curl(url, tmp):
        return []
    html = open(tmp, encoding="utf-8", errors="replace").read()
    urls = re.findall(r'https://assets\.publishing\.service\.gov\.uk/[^"\'\s<>\\]+', html)
    seen, out = set(), []
    for u in urls:
        u = u.rstrip('.,)')
        if u in seen:
            continue
        seen.add(u)
        if re.search(r'\.(pdf|docx|xlsx|ods|csv|odt)$', u, re.I):
            out.append(u)
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("mode", nargs="?", default="all")
    args = ap.parse_args()
    m = load_manifest()
    print(f"manifest has {len(m)} entries")
    save_manifest(m)
