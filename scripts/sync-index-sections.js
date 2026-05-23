/**
 * Sync index.html featured guides, footer nav, and JSON-LD from site.config.js.
 * Usage: node scripts/sync-index-sections.js
 */
import { readFileSync, writeFileSync } from "fs";
import {
  FEATURED_CITIES,
  FEATURED_COMPARISONS,
  RELOCATION_GUIDE_PATH,
  SITE_URL,
} from "../site.config.js";
import { escapeHtml } from "./seo-html.js";

const INDEX = new URL("../index.html", import.meta.url);

function cityHref(path) {
  return path.replace(/^\//, "");
}

const featuredGrid = FEATURED_CITIES.map(
  (c) => `          <li><a href="${cityHref(c.path)}">${escapeHtml(c.name)}</a></li>`
).join("\n");

const featuredMoreLinks = [
  `<a href="cities/index.html">All city guides</a>`,
  ...FEATURED_COMPARISONS.map(
    (c) => `<a href="comparisons/${c.slug}.html">${escapeHtml(c.title)}</a>`
  ),
  `<a href="${cityHref(RELOCATION_GUIDE_PATH)}">Remote work guide</a>`,
]
  .join('\n          <span aria-hidden="true"> · </span>\n          ')
  .replace(/^          /, "");

const footerCityLinks = [
  `            <li><a href="cities/index.html">All city guides</a></li>`,
  ...FEATURED_CITIES.map(
    (c) =>
      `            <li><a href="${cityHref(c.path)}">${escapeHtml(c.name)} salary guide</a></li>`
  ),
].join("\n");

const footerCompareLinks = FEATURED_COMPARISONS.map(
  (c) => `            <li><a href="comparisons/${c.slug}.html">${escapeHtml(c.title)}</a></li>`
).join("\n");

const jsonLdItems = FEATURED_CITIES.map(
  (c, i) =>
    `              { "@type": "ListItem", "position": ${i + 1}, "name": "${escapeHtml(c.name)}", "url": "${SITE_URL}${c.path}" }`
).join(",\n");

let html = readFileSync(INDEX, "utf8");
let changed = false;

const replacements = [
  [
    /(<ul class="featured-guides__grid">)[\s\S]*?(<\/ul>)/,
    `$1\n${featuredGrid}\n        $2`,
  ],
  [
    /(<p class="featured-guides__more">)[\s\S]*?(<\/p>)/,
    `$1\n          ${featuredMoreLinks}\n        $2`,
  ],
  [
    /(<nav aria-label="City guides">[\s\S]*?<ul class="site-footer__links">)[\s\S]*?(<\/ul>)/,
    `$1\n${footerCityLinks}\n          $2`,
  ],
  [
    /(<nav aria-label="City comparisons">[\s\S]*?<ul class="site-footer__links">)[\s\S]*?(<\/ul>)/,
    `$1\n${footerCompareLinks}\n          $2`,
  ],
  [
    /("itemListElement": \[\n)[\s\S]*?(\n            \]\n          \})/,
    `$1${jsonLdItems}$2`,
  ],
];

for (const [pattern, replacement] of replacements) {
  const next = html.replace(pattern, replacement);
  if (next !== html) {
    html = next;
    changed = true;
  }
}

if (changed) {
  writeFileSync(INDEX, html);
  console.log("Synced index.html sections from site.config.js");
} else {
  console.log("index.html sections already in sync");
}
