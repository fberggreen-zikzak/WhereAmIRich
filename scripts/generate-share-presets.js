/**
 * Static share landing pages with custom Open Graph tags (for social crawlers).
 * Usage: node scripts/generate-share-presets.js
 */
import { mkdirSync, writeFileSync } from "fs";
import { CITIES, DEFAULT_SALARY } from "../data.js";
import {
  computeResults,
  defaultComparisonIds,
  formatMoney,
} from "../calc.js";
import {
  FEATURED_CITIES,
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  SITE_NAME,
  SITE_URL,
} from "../site.config.js";
import { escapeHtml } from "./seo-html.js";

const OUT = new URL("../share/", import.meta.url);
mkdirSync(OUT, { recursive: true });

function shareHook(baseCityId, salary = DEFAULT_SALARY) {
  const ids = defaultComparisonIds(baseCityId);
  const results = computeResults(CITIES, salary, baseCityId, ids);
  if (!results.totalCities) {
    return {
      title: `${SITE_NAME} — Salary purchasing power`,
      description: `Compare your monthly salary to 100+ cities — indicative purchasing power calculator.`,
    };
  }
  const { richest, poorest, base } = results;
  const pay = formatMoney(salary, base.currencyLabel);
  const title = `${richest.name} vs ${poorest.name} — ${SITE_NAME}`;
  const description = `${pay}/mo in ${base.name} — see purchasing power across ${results.totalCities} cities (indicative).`;
  return { title, description };
}

function buildSharePage({ slug, calcUrl, title, description }) {
  const canonical = `${SITE_URL}${calcUrl.startsWith("/") ? calcUrl : `/${calcUrl}`}`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta http-equiv="refresh" content="0;url=${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${SITE_URL}/share/${slug}.html" />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
  </head>
  <body>
    <p>Redirecting to <a href="${canonical}">${escapeHtml(SITE_NAME)} calculator</a>…</p>
  </body>
</html>
`;
}

const defaultHook = shareHook("new-york");
writeFileSync(
  new URL("default.html", OUT),
  buildSharePage({
    slug: "default",
    calcUrl: "/",
    title: defaultHook.title,
    description: defaultHook.description,
  })
);

for (const { id } of FEATURED_CITIES) {
  const calcUrl = `/index.html?city=${id}&salary=${DEFAULT_SALARY}`;
  const { title, description } = shareHook(id);
  writeFileSync(
    new URL(`${id}.html`, OUT),
    buildSharePage({ slug: id, calcUrl, title, description })
  );
  console.log(`Wrote share/${id}.html`);
}

console.log("Wrote share/default.html");
