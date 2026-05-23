# Deploy `www.whereamirich.com`

This site is static HTML on **GitHub Pages** with a custom domain.

## 1. Push the latest code

```bash
npm run seo    # updates sitemap, robots.txt, generated pages, static SEO URLs
git add -A && git commit -m "Deploy: whereamirich.com" && git push
```

The repo includes **`CNAME`** with `www.whereamirich.com` so GitHub Pages keeps the domain after each deploy.

## 2. Enable GitHub Pages

1. Open [github.com/fberggreen-zikzak/WhereAmIRich/settings/pages](https://github.com/fberggreen-zikzak/WhereAmIRich/settings/pages)
2. **Build and deployment → Source:** Deploy from a branch
3. **Branch:** `main` / **Folder:** `/ (root)`
4. Save and wait 1–3 minutes for the first deploy

## 3. DNS at your domain registrar

Add these records for **whereamirich.com** (exact UI varies by registrar: GoDaddy, Namecheap, Cloudflare, etc.).

### `www` (primary site)

| Type  | Host / name | Value                         |
|-------|-------------|-------------------------------|
| CNAME | `www`       | `fberggreen-zikzak.github.io` |

### Apex `whereamirich.com` (optional but recommended)

Either redirect apex → `www` in your registrar’s “domain forwarding”, **or** use GitHub’s apex A records:

| Type | Host / name | Value            |
|------|-------------|------------------|
| A    | `@`         | `185.199.108.153` |
| A    | `@`         | `185.199.109.153` |
| A    | `@`         | `185.199.110.153` |
| A    | `@`         | `185.199.111.153` |

Then in GitHub Pages settings, set custom domain to **`www.whereamirich.com`** and enable **Enforce HTTPS** once DNS verifies.

## 4. Verify

- https://www.whereamirich.com/ loads the calculator
- https://www.whereamirich.com/sitemap.xml returns XML
- No certificate warnings (can take up to 24h after DNS)

Check DNS propagation: [https://www.whatsmydns.net/#CNAME/www.whereamirich.com](https://www.whatsmydns.net/#CNAME/www.whereamirich.com)

## 5. Google Search Console

1. Add property: **URL prefix** `https://www.whereamirich.com/`
2. Verify via HTML tag in `index.html` (uncomment `google-site-verification`)
3. Submit sitemap: `https://www.whereamirich.com/sitemap.xml`

## 6. After any domain change

1. Edit `SITE_URL` in `site.config.js`
2. Run `npm run seo`
3. Commit and push

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 on custom domain | Confirm `CNAME` file is on `main`; Pages source is root |
| DNS not verified | Wait up to 48h; remove conflicting A/CNAME on `www` |
| Apex works but not `www` | CNAME must point to `fberggreen-zikzak.github.io` |
| Mixed content / wrong canonicals | Run `npm run seo` and redeploy |
