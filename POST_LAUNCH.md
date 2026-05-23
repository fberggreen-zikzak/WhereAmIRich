# Post-launch checklist

Use this after deploying to [https://www.whereamirich.com](https://www.whereamirich.com).

## AdSense

1. Confirm **ads.txt**: [https://www.whereamirich.com/ads.txt](https://www.whereamirich.com/ads.txt) returns one line with `pub-6644431061410794`.
2. In AdSense → **Sites** → your property → **Check for updates** on ads.txt (can take 15 minutes–24 hours).
3. After approval, verify the homepage ad slot appears when you choose **Accept all** on the cookie banner.
4. Keep one below-the-fold unit until the account is healthy; add more only if performance is good.

## Google Search Console

1. Property: **URL prefix** `https://www.whereamirich.com/` (or domain property if TXT is verified).
2. Submit sitemap: [https://www.whereamirich.com/sitemap.xml](https://www.whereamirich.com/sitemap.xml)
3. Request indexing for `/`, `/guides/remote-work-relocation.html`, `/cities/paris.html`, `/cities/barcelona.html`, `/comparisons/dubai-vs-bangkok.html` if new.
4. After 2–4 weeks, review **Performance** → Queries and **Pages** → filter by `/cities/` and `/comparisons/`.

## Smoke test (mobile + desktop)

- [ ] Salary input, city picker, destination grid update
- [ ] Remove destination (× on card)
- [ ] City guide link on featured destination cards
- [ ] Share URL opens same board
- [ ] Cookie banner: Essential only vs Accept all
- [ ] Privacy and Terms pages load

## Data maintenance

Numbeo cost-of-living indices refresh automatically on the **1st of each month** via the GitHub Actions workflow `.github/workflows/numbeo-refresh.yml`. It runs `npm run numbeo:refresh`, regenerates SEO artifacts, and commits any changes.

Manual refresh (optional):

1. `npm run numbeo:refresh` — fetches live Numbeo rankings and updates `cities-catalog.js` + `DATA_UPDATED` in `data.js`. Use `--dry-run` to preview without writing.
2. `npm run seo` — regenerate sitemap and static pages after data changes.
3. Commit and push if not using the automated workflow.

## Contact email

Legal/privacy contact is **`hello@bulgogi.dk`** in `site.config.js` (`CONTACT_EMAIL`). Change there and regenerate terms/privacy with `npm run seo`.
