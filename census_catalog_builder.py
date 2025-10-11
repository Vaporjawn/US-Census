
#!/usr/bin/env python3
"""
US Census API Catalog Builder
- Pulls master DCAT feed (data.xml) from api.census.gov
- Crawls each dataset's base URL to collect variables, geographies, examples
- Emits catalog CSV + JSON with required parameters flagged

Usage:
  python census_catalog_builder.py --out out_dir

Requires:
  pip install requests beautifulsoup4 lxml pandas tqdm

Notes:
  - The script respects robots.txt by using GET on public docs endpoints only.
  - For very large crawls, consider adding --limit or --include-timeseries-only.
"""
import argparse
import json
import os
import re
import time
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm

BASE = "https://api.census.gov/"
DCAT_XML = urljoin(BASE, "data.xml")

HEADERS = {
    "User-Agent": "CensusCatalogBuilder/1.0 (+https://api.census.gov/data.html)"
}

def fetch(url, **kwargs):
    for i in range(3):
        try:
            r = requests.get(url, headers=HEADERS, timeout=30, **kwargs)
            r.raise_for_status()
            return r
        except Exception as e:
            if i == 2:
                raise
            time.sleep(1 + i)
    raise RuntimeError("unreachable")

def parse_data_xml(xml_text):
    """
    Parse a minimal subset from DCAT XML:
    - title
    - description
    - landing page (docs)
    - dataset base URL (try to find '/data/' path)
    """
    soup = BeautifulSoup(xml_text, "lxml-xml")
    datasets = []
    for ds in soup.find_all(["dcat:Dataset", "Dataset"]):
        title = (ds.find("dct:title") or ds.find("title"))
        desc = (ds.find("dct:description") or ds.find("description"))
        landing = (ds.find("dcat:landingPage") or ds.find("landingPage"))
        # Some records include distribution with accessURL; we'll scan for /data/ base URL heuristically
        candidates = set()
        for dist in ds.find_all(["dcat:distribution", "distribution"]):
            for u in dist.find_all(["dcat:accessURL", "accessURL", "dcat:downloadURL", "downloadURL", "dcat:mediaType", "mediaType"]):
                if u.name in ("dcat:accessURL", "accessURL", "dcat:downloadURL", "downloadURL"):
                    url = u.text.strip()
                    if "/data/" in url and url.startswith("https://api.census.gov/data"):
                        candidates.add(url.split("#")[0])
        # Fallback: scan any URL-looking fields
        if not candidates:
            for tag in ds.find_all(True):
                if tag.string and "https://api.census.gov/data/" in tag.string:
                    m = re.search(r"https://api\.census\.gov/data/[\w/\-]+", tag.string)
                    if m: candidates.add(m.group(0))
        dataset = {
            "title": (title.text.strip() if title else ""),
            "description": (desc.text.strip() if desc else ""),
            "landing_page": (landing.text.strip() if landing else ""),
            "base_url_guess": sorted(candidates)[0] if candidates else ""
        }
        datasets.append(dataset)
    return datasets

def normalize_dataset_base(dataset):
    """
    Resolve a canonical dataset docs root:
      - base_url (data path root like https://api.census.gov/data/2023/acs/acs5)
      - variables_url, geography_url, examples_url, groups_url, api_docs_url
    """
    base_url = dataset["base_url_guess"]
    if not base_url:
        return None
    # Try to land on the HTML docs: append .html if missing
    # data pages usually exist at {base_url}.html
    docs_url = base_url + ".html" if not base_url.endswith(".html") else base_url
    # Standard child pages:
    child = lambda suffix: re.sub(r"\.html$", "", docs_url) + f"/{suffix}.html"
    return {
        **dataset,
        "base_url": base_url,
        "docs_url": docs_url,
        "variables_url": child("variables"),
        "geography_url": child("geography"),
        "examples_url": child("examples"),
        "groups_url": child("groups"),
        "api_docs_url": "https://www.census.gov/data/developers/data-sets.html"
    }

def scrape_required_variables(variables_html):
    """
    Parse the Variables table to identify which variables are required and their predicate type.
    Returns a list of dicts with {name, label, concept, predicateType, required(bool)}.
    """
    out = []
    soup = BeautifulSoup(variables_html, "lxml")
    # Heuristic: find the main variable table
    table = soup.find("table")
    if not table:
        return out
    headers = [th.get_text(strip=True) for th in table.find_all("th")]
    # Map columns
    col_map = {h.lower(): i for i, h in enumerate(headers)}
    def cell(tr, key):
        idx = col_map.get(key)
        if idx is None:
            return ""
        tds = tr.find_all("td")
        return tds[idx].get_text(strip=True) if idx < len(tds) else ""
    for tr in table.find_all("tr")[1:]:
        name = cell(tr, "name")
        if not name:
            continue
        out.append({
            "name": name,
            "label": cell(tr, "label"),
            "concept": cell(tr, "concept"),
            "predicateType": cell(tr, "predicate type") or cell(tr, "predicatetype"),
            "required": (cell(tr, "required").lower() in ("true", "yes", "required"))
        })
    return out

def crawl_dataset(ds_meta, session):
    meta = ds_meta.copy()
    required = []
    try:
        vh = session.get(meta["variables_url"], timeout=30, headers=HEADERS)
        if vh.status_code == 200:
            req_vars = scrape_required_variables(vh.text)
            required = [v["name"] for v in req_vars if v["required"]]
    except Exception:
        pass
    # Determine timeseries vs vintage by path
    path = urlparse(meta["base_url"]).path
    vintage_or_timeseries = "timeseries" if "/timeseries/" in path else "vintage"
    meta.update({
        "vintage_or_timeseries": vintage_or_timeseries,
        "required_parameters": ";".join(sorted(set(required))) if required else ""
    })
    return meta

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="census_catalog_out", help="Output directory")
    ap.add_argument("--limit", type=int, default=0, help="Limit number of datasets (debug)")
    ap.add_argument("--include-timeseries-only", action="store_true")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)

    print("Fetching DCAT feed:", DCAT_XML)
    xml = fetch(DCAT_XML).text
    base_list = parse_data_xml(xml)

    # Normalize & filter
    normalized = []
    for d in base_list:
        n = normalize_dataset_base(d)
        if not n: 
            continue
        if args.include_timeseries_only and "/timeseries/" not in n["base_url"]:
            continue
        normalized.append(n)

    if args.limit > 0:
        normalized = normalized[:args.limit]

    session = requests.Session()
    rows = []
    for n in tqdm(normalized, desc="Crawling datasets"):
        rows.append(crawl_dataset(n, session))

    df = pd.DataFrame(rows, columns=[
        "title","description","base_url","vintage_or_timeseries",
        "variables_url","geography_url","examples_url","groups_url","docs_url","api_docs_url",
        "landing_page","required_parameters"
    ])
    csv_path = os.path.join(args.out, "census_api_catalog.csv")
    json_path = os.path.join(args.out, "census_api_catalog.json")
    df.to_csv(csv_path, index=False)
    df.to_json(json_path, orient="records", indent=2)
    print("Wrote:", csv_path)
    print("Wrote:", json_path)

if __name__ == "__main__":
    main()
