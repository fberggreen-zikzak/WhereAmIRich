# SEO & Google Search Console

WhereAmIRich.com is a static site. SEO metadata is centralized in **`site.config.js`**; public URLs are listed in **`SITEMAP_PAGES`**.

## Before deploy

1. Set production URL in `site.config.js` (`SITE_URL`).
2. Regenerate crawl files and generated pages:

```bash
npm run seo
```

This updates `sitemap.xml`, `robots.txt`, `og-image.png` (from `og-image.svg` via `resvg`), `cities/*.html`, `cities/index.html`, and `comparisons/*.html`.

3. Confirm `index.html` canonical/OG URLs match `SITE_URL`.
4. **Social previews** use `og-image.png` (1200×630). iMessage, Slack, and LinkedIn do not render SVG — commit the PNG after editing `og-image.svg` (`npm run seo:og` or `node scripts/generate-og-image.js`).
5. **Default preview text** lives in `site.config.js` as `DEFAULT_SHARE` (`ogTitle` + `ogDescription`). Pages without their own `ogTitle` / `ogDescription` in `PAGE_SEO` inherit these for Open Graph and Twitter. Homepage copy is overridden via `HOME_SHARE`. Run `npm run seo` (includes `sync-static-seo.js`) to refresh hand-edited HTML.
6. **`ads.txt`** at the site root for AdSense (`google.com, pub-…`). Deploy with the rest of the static files.
7. **Privacy** — `privacy.html` + `consent.js` gate Google Analytics and AdSense until the user chooses “Accept all”.

## Sitemap

- **URL:** `https://www.whereamirich.com/sitemap.xml` (14 URLs as of last build)
- **robots.txt** allows full crawl and points to the sitemap

Submit in [Google Search Console](https://search.google.com/search-console) → **Sitemaps**.

## Indexed page types

| Type | Examples | Notes |
|------|----------|--------|
| Calculator | `/` | WebSite + SoftwareApplication JSON-LD |
| Supporting | `/how-it-works.html`, `/methodology.html`, `/faq.html` | People-first copy; FAQPage schema on FAQ only |
| City hub | `/cities/index.html` | Links to featured guides |
| City guides | `/cities/london.html`, … | Generated from catalog; unique tables per city |
| Comparisons | `/comparisons/london-vs-lisbon.html`, … | Hand-authored angles in `FEATURED_COMPARISONS` |

## Verify ownership

Uncomment in `index.html`:

```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

## What to monitor (first 4–8 weeks)

| Area | What to check |
|------|----------------|
| **Coverage** | All sitemap URLs indexed; no accidental noindex |
| **Enhancements** | Valid FAQ rich results on `/faq.html` |
| **Core Web Vitals** | Mobile LCP on homepage (fonts + JS) |
| **Queries** | Branded vs intent (`salary purchasing power`, `cost of living salary`, city + comparison terms) |
| **Landing pages** | Which city guides and comparison pages earn impressions |

## Adding SEO pages safely

1. **City guide:** add to `FEATURED_CITIES` + `PAGE_SEO` + `SITEMAP_PAGES`, run `npm run seo`.
2. **Head-to-head:** add to `FEATURED_COMPARISONS` with a real `angle` string, run `npm run seo`.
3. Do **not** generate 180+ thin city pages — only add guides with unique, useful copy.

## Primary search intents (homepage)

| Intent | How the page addresses it |
|--------|---------------------------|
| Where does my salary go furthest | H1, title, hero lead, calculator outcome |
| Cost of living salary comparison | Destinations grid, methodology block, city guides |
| Salary purchasing power by city | Meta description, SoftwareApplication schema |
| Monthly salary comparison across cities | Calculator inputs, share links |
| Compare salary in [city] vs [city] | Featured comparison pages + city guides (internal links) |

Target phrases are woven into visible copy — not repeated unnaturally in hidden text.

## Homepage SEO blocks (2026)

- **`content/home-seo.js`** — people-first How it works / Methodology / FAQ copy
- **`scripts/sync-home-seo.js`** — injects learn section, FAQPage JSON-LD (matches visible FAQ), title/meta from `PAGE_SEO`
- Run via `npm run seo` after editing config or content

## Technical notes / blockers

| Item | Status |
|------|--------|
| Canonical, OG, Twitter | Set per page; homepage synced from `PAGE_SEO` |
| robots | `index, follow` on public pages; invite/share private flows excluded from sitemap |
| FAQ rich results | Homepage FAQPage schema matches visible `<details>` answers only |
| SearchAction (`?city=`) | Pre-selects home city — not full site search; monitor in Rich Results Test |
| Calculator | Requires JS; `<noscript>` fallback + static supporting pages for crawlers |
| Sitemap | Submit `https://www.whereamirich.com/sitemap.xml` in Search Console |

## Highest-priority pages to build next

1. **Tokyo or Madrid city guide** — high search volume, unique COL vs Western hubs
2. **Singapore vs Hong Kong comparison** — distinct angle from existing pairs
3. **“How far does $5,000 go in …”** programmatic page — only with real tables + editorial intro per city (avoid thin duplicates)
4. **Expand remote work guide** with links to calculator + 2–3 comparison pages
5. Monitor **Paris / Barcelona** guides already live — iterate copy from Search Console queries

## Content principles

| File | Role |
|------|------|
| `site.config.js` | URLs, titles, featured cities/comparisons |
| `scripts/sync-home-seo.js` | Homepage learn section, FAQ schema, title/meta |
| `content/home-seo.js` | Homepage FAQ + learn copy (must match schema) |
| `scripts/generate-sitemap.js` | `sitemap.xml`, `robots.txt` |
| `scripts/generate-city-pages.js` | `cities/{id}.html` |
| `scripts/generate-cities-index.js` | `cities/index.html` |
| `scripts/generate-compare-pages.js` | `comparisons/*.html` |
| `scripts/seo-html.js` | Shared head, header, footer, breadcrumbs |

## Content principles

- People-first copy; no keyword stuffing or doorway pages.
- Schema must match visible content.
- Descriptive internal links (“London salary guide”, not “click here”).
