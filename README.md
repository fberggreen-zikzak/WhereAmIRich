# WhereAmIRich.com

Compare your salary’s purchasing power across major cities. Enter your monthly pay and **current city**; see how it translates elsewhere using cost-of-living indices.

## Run locally (no install)

```bash
python3 -m http.server 8765
```

Open http://localhost:8765 — ES modules require a local server (not `file://`).

Share a result: `?salary=50000&city=london&dest=paris,tokyo,bangkok` is added to the URL automatically. Use the **Add destination** tile in the grid to search and add cities.

## SEO & deployment

See **[SEO.md](./SEO.md)** for Search Console setup, monitoring, and content guidelines.

Before going live:

1. Set **`SITE_URL`** in `site.config.js`
2. Run `npm run seo` (regenerates `sitemap.xml`, `robots.txt`, and `cities/*.html`)
3. Align homepage canonical/OG URLs in `index.html` with `SITE_URL`

Included:

- Supporting pages: `how-it-works.html`, `methodology.html`, `faq.html`, featured `cities/*.html`
- Per-page titles, descriptions, canonicals, breadcrumbs, JSON-LD
- `sitemap.xml`, `robots.txt`, `favicon.svg`, `og-image.svg`

Submit `https://www.whereamirich.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

**Custom domain setup:** see **[DEPLOY.md](./DEPLOY.md)**.

## Run with Vite (when npm is available)

```bash
npm install
npm run dev
```

## How it’s calculated

For each city:

```
factor(base → city) = base.numbeoColIndex / city.numbeoColIndex
equivalentSalary    = yourSalary × factor
```

Amounts are shown in **your city’s currency** (same units you typed). A factor **above 1** means your money goes further there; **below 1** means less.

| Status | Factor |
|--------|--------|
| Rich | ≥ 1.55 |
| Middle | 0.75 – 1.55 |
| Poor | ≤ 0.75 |

## Add or refresh cities

1. Look up the city’s **Cost of Living Index (Excl. Rent)** on [Numbeo](https://www.numbeo.com/cost-of-living/) (use the same scale as Copenhagen ≈ 100).
2. Add or update a row in `CITY_RAW` inside `data.js`:

```js
{ id: "milan", name: "Milan", country: "Italy", countryCode: "it", numbeoColIndex: 78.0, currencyCode: "EUR", currencyLabel: "€" },
```

3. Check factors from a base city:

```bash
node scripts/print-factors.js
node scripts/print-factors.js --from copenhagen --to london
```

Set `DATA_UPDATED` in `data.js` when you refresh indices.

### Live Numbeo API?

Numbeo does not offer a reliable free public API for COL indices. For production you could scrape periodically (check their terms), use a paid data vendor, or refresh indices manually every few months — the script above keeps that lightweight.

## Files

| File | Purpose |
|------|---------|
| `cities-catalog.js` | ~100 global cities with Numbeo COL indices |
| `data.js` | City exports, search helper, status config |
| `calc.js` | Math, formatting, URL parsing |
| `app.js` | UI and live updates |
| `scripts/print-factors.js` | CLI helper when updating data |
| `index.html` / `styles.css` | Layout and theme |
