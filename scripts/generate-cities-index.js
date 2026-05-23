/**
 * Generate cities/index.html hub page.
 * Usage: node scripts/generate-cities-index.js
 */
import { writeFileSync, mkdirSync } from "fs";
import { CITY_CATALOG } from "../cities-catalog.js";
import {
  CITIES_INDEX_PATH,
  FEATURED_CITIES,
  FEATURED_COMPARISONS,
  SITE_URL,
} from "../site.config.js";
import {
  escapeHtml,
  organizationJsonLd,
  renderBreadcrumb,
  renderHead,
  renderSiteFooter,
  renderSiteHeader,
  webPageJsonLd,
} from "./seo-html.js";

const OUT_DIR = new URL("../cities/", import.meta.url);
const assetPrefix = "../";

mkdirSync(OUT_DIR, { recursive: true });

const cityCards = FEATURED_CITIES.map((featured) => {
  const city = CITY_CATALOG.find((c) => c.id === featured.id);
  const col = city?.numbeoColIndex ?? "—";
  const href = `${assetPrefix}${featured.path.replace(/^\//, "")}`;
  return `          <li class="city-guide-card">
            <a href="${href}">
              <span class="city-guide-card__name">${escapeHtml(featured.name)}</span>
              <span class="city-guide-card__meta">COL index ${col} · monthly benchmarks</span>
            </a>
          </li>`;
}).join("\n");

const compareLinks = FEATURED_COMPARISONS.map(
  (c) =>
    `          <li><a href="${assetPrefix}comparisons/${c.slug}.html">${escapeHtml(c.title)} comparison</a></li>`
).join("\n");

const jsonLd = [
  organizationJsonLd(),
  webPageJsonLd(
    CITIES_INDEX_PATH,
    "City salary guides",
    "Browse purchasing power guides for major global cities."
  ),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured city salary guides",
    itemListElement: FEATURED_CITIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.name} salary guide`,
      url: `${SITE_URL}${c.path}`,
    })),
  },
];

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
${renderHead(CITIES_INDEX_PATH, { extraJsonLd: jsonLd })}
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
${renderSiteHeader(assetPrefix, "cities")}
    <main class="page page--content" id="main-content">
${renderBreadcrumb(assetPrefix, [
  { name: "Home", url: "/" },
  { name: "City guides" },
])}
      <article class="content panel">
        <h1>City salary guides</h1>
        <p class="content__lead">
          Each guide explains cost-of-living context for a home city, quick factor comparisons to major destinations,
          and how local average salaries relate to the calculator. Open a guide, then use the live tool with that city pre-selected.
        </p>
        <p>
          <a class="content__cta" href="${assetPrefix}index.html">Open the calculator</a>
        </p>
        <h2>Featured home cities</h2>
        <ul class="city-guide-grid">
${cityCards}
        </ul>
        <h2>Head-to-head comparisons</h2>
        <p>Focused write-ups for common relocation and remote-work decisions:</p>
        <ul class="content-links">
${compareLinks}
        </ul>
        <h2>More cities in the app</h2>
        <p>
          The calculator includes ${CITY_CATALOG.length}+ destinations. Guides are added only where we can publish
          unique, useful context — not thin duplicate pages for every catalog entry.
        </p>
        <p>
          <a href="${assetPrefix}methodology.html">Methodology &amp; limitations</a> ·
          <a href="${assetPrefix}faq.html">FAQ</a>
        </p>
      </article>
    </main>
${renderSiteFooter(assetPrefix)}
  </body>
</html>
`;

writeFileSync(new URL("index.html", OUT_DIR), html);
console.log("Wrote cities/index.html");
