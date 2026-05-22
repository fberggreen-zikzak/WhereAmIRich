# SEO & Google Search Console

Rich or Poor is a static site. SEO metadata is centralized in **`site.config.js`**; public URLs are listed in **`SITEMAP_PAGES`**.

## Before deploy

1. Set production URL in `site.config.js` (`SITE_URL`).
2. Regenerate crawl files and city landings:

```bash
npm run seo
```

This updates `sitemap.xml`, `robots.txt`, and `cities/*.html`.

3. Confirm `index.html` canonical/OG URLs match `SITE_URL` (homepage meta is hand-edited; subpages use the same domain in canonical tags).
4. Optional: export `og-image.svg` to **1200×630 PNG** as `og-image.png` and point social `og:image` tags to it (many crawlers prefer PNG).

## Sitemap

- **URL:** `https://richorpoor.com/sitemap.xml` (replace host if you use another domain)
- **robots.txt** points crawlers to the sitemap and allows full site crawl (`Allow: /`)

Submit the sitemap in [Google Search Console](https://search.google.com/search-console) → **Sitemaps** → add the full sitemap URL.

## Verify ownership

1. Search Console → **Settings** → **Ownership verification**
2. Choose **HTML tag** method
3. Uncomment and fill in `index.html`:

```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

4. Deploy, then click **Verify**

## What to monitor (first 4–8 weeks)

| Area | What to check |
|------|----------------|
| **Pages** | Homepage, `/how-it-works.html`, `/methodology.html`, `/faq.html`, and featured `/cities/*` indexed without “Excluded by noindex” |
| **Enhancements** | FAQ rich results on `/faq.html` (valid FAQPage schema) |
| **Core Web Vitals** | LCP on mobile — calculator is JS-heavy; watch field data |
| **Queries** | Branded (`rich or poor`) vs intent (`salary purchasing power`, `cost of living salary comparison`) |
| **Crawl** | Sitemap “Success” and no spike in 404s after deploy |

## Content principles

- People-first copy on every indexed page (no doorway/thin city spam).
- FAQ schema only on **`faq.html`** where questions and answers are visible.
- Add new city landings only with unique, useful copy — extend `FEATURED_CITIES` and re-run `npm run seo`.

## Files

| File | Role |
|------|------|
| `site.config.js` | `SITE_URL`, page titles/descriptions, sitemap list |
| `scripts/generate-sitemap.js` | Writes `sitemap.xml` + `robots.txt` |
| `scripts/generate-city-pages.js` | Writes `cities/*.html` from catalog |
| `how-it-works.html`, `methodology.html`, `faq.html` | Supporting content (edit manually) |
