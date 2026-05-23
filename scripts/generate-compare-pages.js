/**
 * Generate head-to-head comparison pages.
 * Usage: node scripts/generate-compare-pages.js
 */
import { mkdirSync, writeFileSync } from "fs";
import { CITY_CATALOG } from "../cities-catalog.js";
import { AVERAGE_MONTHLY_SALARY } from "../city-salaries.js";
import { FEATURED_COMPARISONS, SITE_URL } from "../site.config.js";
import {
  escapeHtml,
  organizationJsonLd,
  renderBreadcrumb,
  renderHead,
  renderSiteFooter,
  renderSiteHeader,
  webPageJsonLd,
} from "./seo-html.js";

const OUT_DIR = new URL("../comparisons/", import.meta.url);
const assetPrefix = "../";

function factor(fromIndex, toIndex) {
  return Math.round((fromIndex / toIndex) * 1000) / 1000;
}

function formatSalary(cityId, city) {
  const amount = AVERAGE_MONTHLY_SALARY[cityId];
  if (!amount) return "benchmark varies";
  return `${amount.toLocaleString("en-US")} ${city.currencyLabel}/mo (approx.)`;
}

function buildComparePage({ slug, cityAId, cityBId, title, angle }) {
  const cityA = CITY_CATALOG.find((c) => c.id === cityAId);
  const cityB = CITY_CATALOG.find((c) => c.id === cityBId);
  if (!cityA || !cityB) throw new Error(`Missing city for ${slug}`);

  const path = `/comparisons/${slug}.html`;
  const aToB = factor(cityA.numbeoColIndex, cityB.numbeoColIndex);
  const bToA = factor(cityB.numbeoColIndex, cityA.numbeoColIndex);
  const cheaper =
    cityA.numbeoColIndex > cityB.numbeoColIndex ? cityB.name : cityA.name;
  const cheaperNote =
    cityA.numbeoColIndex === cityB.numbeoColIndex
      ? "Indices are similar on this scale."
      : `${cheaper} has the lower cost-of-living index on Numbeo (excluding rent), so the same monthly pay typically stretches further there.`;

  const jsonLd = [
    organizationJsonLd(),
    webPageJsonLd(
      path,
      `${title} — salary & cost of living`,
      angle
    ),
  ];

  const calcBoth = `${assetPrefix}index.html?city=${cityA.id}&dest=${cityB.id}`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
${renderHead(path, { extraJsonLd: jsonLd })}
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
${renderSiteHeader(assetPrefix, "compare")}
    <main class="page page--content" id="main-content">
${renderBreadcrumb(assetPrefix, [
  { name: "Home", url: "/" },
  { name: "Comparisons", url: "/cities/index.html" },
  { name: title },
])}
      <article class="content panel">
        <h1>${escapeHtml(title)}: cost of living &amp; salary context</h1>
        <p class="content__lead">${escapeHtml(angle)}</p>
        <p>
          <a class="content__cta" href="${calcBoth}">Compare in the calculator</a>
        </p>
        <h2>Cost-of-living indices (excluding rent)</h2>
        <div class="content-table-wrap">
          <table class="content-table">
            <thead>
              <tr>
                <th scope="col">City</th>
                <th scope="col">Numbeo index</th>
                <th scope="col">Typical gross salary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${escapeHtml(cityA.name)}</td>
                <td>${cityA.numbeoColIndex}</td>
                <td>${escapeHtml(formatSalary(cityAId, cityA))}</td>
              </tr>
              <tr>
                <td>${escapeHtml(cityB.name)}</td>
                <td>${cityB.numbeoColIndex}</td>
                <td>${escapeHtml(formatSalary(cityBId, cityB))}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>${escapeHtml(cheaperNote)} Indices use Copenhagen ≈ 100 as reference in our dataset.</p>
        <h2>Purchasing power factors</h2>
        <p>Using the same formula as the app (<code>home index ÷ destination index</code>):</p>
        <ul>
          <li>Salary based in <strong>${escapeHtml(cityA.name)}</strong> → spending power in <strong>${escapeHtml(cityB.name)}</strong>: <strong>${aToB.toFixed(2)}×</strong></li>
          <li>Salary based in <strong>${escapeHtml(cityB.name)}</strong> → spending power in <strong>${escapeHtml(cityA.name)}</strong>: <strong>${bToA.toFixed(2)}×</strong></li>
        </ul>
        <p>
          Values above 1 mean money stretches further in the destination. Enter your own monthly pay in the
          <a href="${assetPrefix}index.html">calculator</a> for equivalents in your currency and vs local averages.
        </p>
        <h2>Related guides</h2>
        <ul>
          <li><a href="${assetPrefix}cities/${cityA.id}.html">${escapeHtml(cityA.name)} salary guide</a></li>
          <li><a href="${assetPrefix}cities/${cityB.id}.html">${escapeHtml(cityB.name)} salary guide</a></li>
          <li><a href="${assetPrefix}methodology.html">How we calculate results</a></li>
        </ul>
      </article>
    </main>
${renderSiteFooter(assetPrefix)}
  </body>
</html>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const comparison of FEATURED_COMPARISONS) {
  const html = buildComparePage(comparison);
  writeFileSync(new URL(`${comparison.slug}.html`, OUT_DIR), html);
  console.log(`Wrote comparisons/${comparison.slug}.html`);
}
