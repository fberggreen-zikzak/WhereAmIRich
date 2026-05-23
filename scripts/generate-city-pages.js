/**
 * Generate city landing pages from catalog data.
 * Usage: node scripts/generate-city-pages.js
 */
import { mkdirSync, writeFileSync } from "fs";
import { CITY_CATALOG } from "../cities-catalog.js";
import { AVERAGE_MONTHLY_SALARY } from "../city-salaries.js";
import { FEATURED_COMPARISONS, CITIES_INDEX_PATH, FEATURED_CITIES, SITE_URL } from "../site.config.js";
import {
  escapeHtml,
  organizationJsonLd,
  renderBreadcrumb,
  renderHead,
  renderSiteFooter,
  renderSiteHeader,
} from "./seo-html.js";

const OUT_DIR = new URL("../cities/", import.meta.url);
const assetPrefix = "../";

function factor(fromIndex, toIndex) {
  return Math.round((fromIndex / toIndex) * 1000) / 1000;
}

function spendingLabel(f) {
  if (f >= 1.55) return "much stronger";
  if (f >= 1.1) return "stronger";
  if (f >= 0.9) return "similar";
  if (f >= 0.75) return "weaker";
  return "much weaker";
}

const COMPARE_TARGETS = ["london", "new-york", "lisbon", "bangkok", "paris", "singapore"];

function buildCityPage(cityId) {
  const city = CITY_CATALOG.find((c) => c.id === cityId);
  if (!city) throw new Error(`Unknown city: ${cityId}`);

  const path = `/cities/${cityId}.html`;
  const avgLocal = AVERAGE_MONTHLY_SALARY[cityId];
  const avgNote = avgLocal
    ? `Typical gross monthly pay in ${city.name} is about ${avgLocal.toLocaleString("en-US")} ${city.currencyLabel} (approximate benchmark).`
    : `Local average salary benchmarks are approximate and shown in the calculator when available.`;

  const comparisons = COMPARE_TARGETS.filter((id) => id !== cityId)
    .map((id) => CITY_CATALOG.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 5);

  const rows = comparisons
    .map((target) => {
      const f = factor(city.numbeoColIndex, target.numbeoColIndex);
      return `            <tr>
              <td>${escapeHtml(target.name)}</td>
              <td>${f.toFixed(2)}×</td>
              <td>${escapeHtml(spendingLabel(f))} vs ${escapeHtml(city.name)}</td>
            </tr>`;
    })
    .join("\n");

  const jsonLd = [
    organizationJsonLd(),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${city.name} salary purchasing power`,
      url: `${SITE_URL}${path}`,
      description: `Cost-of-living comparison guide for salaries based in ${city.name}.`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
  ];

  const calcUrl = `${assetPrefix}index.html?city=${city.id}`;

  const compareLinks = FEATURED_COMPARISONS.map(
    (c) =>
      `<a href="${assetPrefix}comparisons/${c.slug}.html">${escapeHtml(c.title)}</a>`
  ).join(" ·\n          ");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
${renderHead(path, { extraJsonLd: jsonLd })}
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
${renderSiteHeader(assetPrefix, "cities")}
    <main class="page page--content" id="main-content">
${renderBreadcrumb(assetPrefix, [
  { name: "Home", url: "/" },
  { name: "City guides", url: CITIES_INDEX_PATH },
  { name: city.name },
])}
      <article class="content panel">
        <h1>${escapeHtml(city.name)} salary purchasing power</h1>
        <p class="content__lead">
          ${escapeHtml(city.name)} has a Numbeo cost-of-living index (excluding rent) of
          <strong>${city.numbeoColIndex}</strong> on our scale where New York ≈ 100.
          Use the calculator with ${escapeHtml(city.name)} as your home city to see equivalent monthly pay
          and spending power in destinations worldwide.
        </p>
        <p>
          <a class="content__cta" href="${calcUrl}">Open calculator with ${escapeHtml(city.name)} selected</a>
        </p>
        <h2>Quick comparisons from ${escapeHtml(city.name)}</h2>
        <p>
          Factors below use the same formula as the app:
          <code>home index ÷ destination index</code>. Values above 1 mean your money stretches further there.
        </p>
        <div class="content-table-wrap">
          <table class="content-table">
            <thead>
              <tr>
                <th scope="col">Destination</th>
                <th scope="col">Factor</th>
                <th scope="col">Direction</th>
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>
        <h2>Local context</h2>
        <p>${escapeHtml(avgNote)} The calculator also shows how you compare to that local average when you pick a destination — using approximate FX to put salaries on a comparable footing.</p>
        <h2>Good to know</h2>
        <ul>
          <li>Indices are directional, refreshed periodically from <a href="https://www.numbeo.com/cost-of-living/" rel="noopener noreferrer">Numbeo</a>.</li>
          <li>Rent is excluded from the index; housing can swing real budgets.</li>
          <li>Taxes, benefits, and visa rules are not modeled — see <a href="${assetPrefix}methodology.html">methodology</a>.</li>
        </ul>
        <h2>More guides</h2>
        <p>
          <a href="${assetPrefix}${CITIES_INDEX_PATH.replace(/^\//, "")}">Browse all city guides</a> ·
          ${compareLinks}
        </p>
      </article>
    </main>
${renderSiteFooter(assetPrefix)}
  </body>
</html>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const { id } of FEATURED_CITIES) {
  const html = buildCityPage(id);
  const file = new URL(`${id}.html`, OUT_DIR);
  writeFileSync(file, html);
  console.log(`Wrote cities/${id}.html`);
}
