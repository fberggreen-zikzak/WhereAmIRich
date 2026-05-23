# SEO & Google Search Console

Where Am I Rich is a static site. SEO metadata is centralized in **`site.config.js`**; public URLs are listed in **`SITEMAP_PAGES`**.

## Before deploy

1. Set production URL in `site.config.js` (`SITE_URL`).
2. Regenerate crawl files and generated pages:

```bash
npm run seo
```

This updates `sitemap.xml`, `robots.txt`, `cities/*.html`, `cities/index.html`, and `comparisons/*.html`.

3. Confirm `index.html` canonical/OG URLs match `SITE_URL`.
4. Optional: export `og-image.svg` to **1200×630 PNG** as `og-image.png` and point social `og:image` tags to it.

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

## Highest-priority content to build next

1. **Singapore / Berlin** — already live; monitor Search Console performance.
2. **Paris** or **Barcelona** city guide (high travel intent).
3. **One more comparison** (e.g. Dubai vs Bangkok) only if the angle is genuinely different.
4. **Remote work relocation** article (1,000+ words, links to calculator + methodology).
5. **OG PNG** for better social crawl previews.

## Files

| File | Role |
|------|------|
| `site.config.js` | URLs, titles, featured cities/comparisons |
| `scripts/generate-sitemap.js` | `sitemap.xml`, `robots.txt` |
| `scripts/generate-city-pages.js` | `cities/{id}.html` |
| `scripts/generate-cities-index.js` | `cities/index.html` |
| `scripts/generate-compare-pages.js` | `comparisons/*.html` |
| `scripts/seo-html.js` | Shared head, header, footer, breadcrumbs |

## Content principles

- People-first copy; no keyword stuffing or doorway pages.
- Schema must match visible content.
- Descriptive internal links (“London salary guide”, not “click here”).
