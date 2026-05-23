/**
 * Generate remote-work relocation guide from site config.
 * Usage: node scripts/generate-relocation-guide.js
 */
import { mkdirSync, writeFileSync } from "fs";
import { CITY_CATALOG } from "../cities-catalog.js";
import {
  CITIES_INDEX_PATH,
  FEATURED_CITIES,
  FEATURED_COMPARISONS,
  RELOCATION_GUIDE_PATH,
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

const OUT_DIR = new URL("../guides/", import.meta.url);
const assetPrefix = "../";

mkdirSync(OUT_DIR, { recursive: true });

function factor(fromIndex, toIndex) {
  return Math.round((fromIndex / toIndex) * 1000) / 1000;
}

const hubCities = ["lisbon", "bangkok", "dubai", "barcelona", "berlin"].map((id) =>
  CITY_CATALOG.find((c) => c.id === id)
).filter(Boolean);

const ny = CITY_CATALOG.find((c) => c.id === "new-york");
const london = CITY_CATALOG.find((c) => c.id === "london");

const hubRows = hubCities
  .map((city) => {
    const vsNy = ny ? factor(ny.numbeoColIndex, city.numbeoColIndex) : null;
    const vsLondon = london ? factor(london.numbeoColIndex, city.numbeoColIndex) : null;
    const note =
      vsNy && vsNy >= 1.35
        ? "Strong stretch vs US pay"
        : vsNy && vsNy >= 1.05
          ? "Moderate stretch"
          : "Similar or tighter vs US pay";
    return `            <tr>
              <td><a href="${assetPrefix}cities/${city.id}.html">${escapeHtml(city.name)}</a></td>
              <td>${city.numbeoColIndex.toFixed(1)}</td>
              <td>${vsNy ? `${vsNy.toFixed(2)}× vs NY` : "—"}</td>
              <td>${vsLondon ? `${vsLondon.toFixed(2)}× vs London` : "—"}</td>
              <td>${note}</td>
            </tr>`;
  })
  .join("\n");

const compareLinks = FEATURED_COMPARISONS.map(
  (c) =>
    `<li><a href="${assetPrefix}comparisons/${c.slug}.html">${escapeHtml(c.title)}</a> — ${escapeHtml(c.angle)}</li>`
).join("\n          ");

const cityGuideLinks = FEATURED_CITIES.slice(0, 6)
  .map(
    (c) =>
      `<li><a href="${assetPrefix}${c.path.replace(/^\//, "")}">${escapeHtml(c.name)} salary guide</a></li>`
  )
  .join("\n          ");

const jsonLd = [
  organizationJsonLd(),
  webPageJsonLd(RELOCATION_GUIDE_PATH, "Remote work relocation guide"),
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I compare salary purchasing power before relocating?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter your gross monthly salary and home city in the WhereAmIRich.com calculator, then review equivalent pay and vs-home badges for each destination.",
        },
      },
      {
        "@type": "Question",
        name: "Which cities are popular for remote workers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lisbon, Barcelona, Berlin, Bangkok, and Dubai appear often in remote-work discussions because lower cost-of-living indices can stretch Western salaries — always validate rent, tax, and visa rules separately.",
        },
      },
    ],
  },
];

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
${renderHead(RELOCATION_GUIDE_PATH, { extraJsonLd: jsonLd })}
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
${renderSiteHeader(assetPrefix, "cities")}
    <main class="page page--content" id="main-content">
${renderBreadcrumb(assetPrefix, [
  { name: "Home", url: "/" },
  { name: "City guides", url: CITIES_INDEX_PATH },
  { name: "Remote work relocation" },
])}
      <article class="content panel">
        <h1>Remote work relocation: where your salary stretches</h1>
        <p class="content__lead">
          Moving while keeping a salary from another country? Start with purchasing power — how far the same
          monthly pay goes after local living costs — before you commit to rent, tax, or visa paperwork.
        </p>

        <h2>A practical order of operations</h2>
        <ol>
          <li>
            <strong>Model purchasing power.</strong> Use the
            <a href="${assetPrefix}index.html">calculator</a> with your real gross monthly pay and current home city.
          </li>
          <li>
            <strong>Shortlist 3–5 destinations.</strong> Compare equivalent salary and vs-home badges — not just headline
            COL rankings.
          </li>
          <li>
            <strong>Validate rent separately.</strong> Numbeo COL excludes rent in our indices; housing often dominates
            relocation budgets.
          </li>
          <li>
            <strong>Check tax and visa.</strong> This site is indicative only — consult professionals for residency,
            payroll, and social security.
          </li>
          <li>
            <strong>Share a link.</strong> Use the built-in share buttons so partners or employers see the same board.
          </li>
        </ol>

        <h2>Frequently compared hubs</h2>
        <p>
          Indices are Numbeo cost-of-living (excluding rent), New York ≈ 100. Factors show how much further a fixed
          paycheck goes vs a higher-index city.
        </p>
        <div class="content-table-wrap">
          <table class="content-table">
            <thead>
              <tr>
                <th scope="col">City</th>
                <th scope="col">COL index</th>
                <th scope="col">vs New York</th>
                <th scope="col">vs London</th>
                <th scope="col">Typical stretch</th>
              </tr>
            </thead>
            <tbody>
${hubRows}
            </tbody>
          </table>
        </div>

        <h2>Head-to-head comparisons</h2>
        <ul>
          ${compareLinks}
        </ul>

        <h2>City salary guides</h2>
        <ul>
          ${cityGuideLinks}
        </ul>
        <p><a href="${assetPrefix}${CITIES_INDEX_PATH.replace(/^\//, "")}">Browse all featured city guides →</a></p>

        <p>
          Indicative data for inspiration — not financial, tax, or legal advice. See
          <a href="${assetPrefix}methodology.html">methodology</a> and <a href="${assetPrefix}terms.html">terms</a>.
        </p>
      </article>
    </main>
${renderSiteFooter(assetPrefix)}
  </body>
</html>
`;

writeFileSync(new URL("remote-work-relocation.html", OUT_DIR), html);
console.log(`Wrote guides/remote-work-relocation.html (${SITE_URL}${RELOCATION_GUIDE_PATH})`);
