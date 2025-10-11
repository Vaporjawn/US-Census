
# US Census API — Full Catalog Builder

This package gives you two things:
1. **A fully automated crawler (`census_catalog_builder.py`)** that builds a complete catalog of Census datasets (including deprecated/experimental if present in the DCAT feed), and extracts **required parameters** from each dataset’s Variables page.
2. **A small `census_api_catalog_SAMPLE.csv`** with 10 representative datasets so you can see the schema immediately.

## How to build the full catalog

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install requests beautifulsoup4 lxml pandas tqdm

python census_catalog_builder.py --out out
# Optional flags:
#   --limit 250                  # crawl only first 250 datasets for testing
#   --include-timeseries-only    # restrict to /timeseries/ datasets
```

Outputs:
- `out/census_api_catalog.csv`
- `out/census_api_catalog.json`

Columns:
- `title, description, base_url, vintage_or_timeseries, variables_url, geography_url, examples_url, groups_url, docs_url, api_docs_url, landing_page, required_parameters`

### Notes
- The script pulls the official DCAT feed at `https://api.census.gov/data.xml` and walks each dataset’s docs pages (`variables.html`, `geography.html`, `examples.html`) to extract required fields.
- “Required parameters” are inferred from the **Required** column on each dataset’s Variables table.
- Expect a long run for the complete crawl (there are 1k+ datasets). Use `--limit` first.

## Sample CSV
A ready-to-use sample with core programs (ACS, Decennial, SAIPE/SAHIE, EITS, Intl Trade, CBP) is included as `census_api_catalog_SAMPLE.csv`.
