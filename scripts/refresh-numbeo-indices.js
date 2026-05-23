/**
 * Refresh Numbeo cost-of-living indices in cities-catalog.js from live rankings.
 *
 * Usage:
 *   node scripts/refresh-numbeo-indices.js
 *   node scripts/refresh-numbeo-indices.js --dry-run
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { CITY_CATALOG } from "../cities-catalog.js";
import {
  NUMBEO_NAME_OVERRIDES,
  NUMBEO_COUNTRY_ALIASES,
} from "./numbeo-city-map.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NUMBEO_URL =
  "https://www.numbeo.com/cost-of-living/rankings_current.jsp";
const USER_AGENT = "WhereAmIRich-DataBot/1.0";
const MAX_UNMATCHED = 10;

const dryRun = process.argv.includes("--dry-run");

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function stripParens(text) {
  return text.replace(/\s*\([^)]*\)/g, "").trim();
}

function parseNumbeoLabel(label) {
  const parts = label.split(",").map((part) => part.trim());
  const country = parts[parts.length - 1] ?? "";
  const city = stripParens(parts[0] ?? label);
  const region = parts.length > 2 ? parts[1] : null;
  return { city, region, country, label };
}

function countriesMatch(catalogCountry, numbeoCountry) {
  const a = normalize(catalogCountry);
  const b = normalize(numbeoCountry);
  if (a === b) return true;
  if (NUMBEO_COUNTRY_ALIASES[a] === b || NUMBEO_COUNTRY_ALIASES[b] === a) {
    return true;
  }
  return a.includes(b) || b.includes(a);
}

function parseNumbeoRankings(html) {
  const pattern =
    /cityOrCountryInIndicesTable"><a[^>]*>([^<]+)<\/a><\/td>\s*<td style="text-align: right">([0-9.]+)<\/td>/g;
  const byLabel = new Map();
  const byNormalizedLabel = new Map();

  for (const match of html.matchAll(pattern)) {
    const label = match[1].trim();
    const index = parseFloat(match[2]);
    if (!Number.isFinite(index)) continue;

    const entry = { label, index };
    byLabel.set(label, entry);
    byNormalizedLabel.set(normalize(label), entry);
  }

  return { byLabel, byNormalizedLabel, entries: [...byLabel.values()] };
}

async function fetchNumbeoRankings() {
  const response = await fetch(NUMBEO_URL, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Numbeo fetch failed: HTTP ${response.status}`);
  }

  return response.text();
}

function findNumbeoEntry(catalogCity, rankings) {
  const override = NUMBEO_NAME_OVERRIDES[catalogCity.id];
  if (override) {
    const direct =
      rankings.byLabel.get(override) ??
      rankings.byNormalizedLabel.get(normalize(override));
    if (direct) return direct;
  }

  const exactCandidates = [
    `${catalogCity.name}, ${catalogCity.country}`,
    stripParens(catalogCity.name),
  ];

  for (const candidate of exactCandidates) {
    const hit = rankings.byNormalizedLabel.get(normalize(candidate));
    if (hit) return hit;
  }

  const normCity = normalize(stripParens(catalogCity.name));
  const matches = rankings.entries.filter((entry) => {
    const parsed = parseNumbeoLabel(entry.label);
    const entryCity = normalize(stripParens(parsed.city));
    return (
      entryCity === normCity &&
      countriesMatch(catalogCity.country, parsed.country)
    );
  });

  if (matches.length === 1) return matches[0];
  return null;
}

function formatIndex(value) {
  return value.toFixed(1);
}

function updateCatalogFile(content, updates) {
  let next = content;
  for (const { id, index } of updates) {
    const pattern = new RegExp(
      `(\\{ id: "${id}"[^\\n]*numbeoColIndex: )[0-9.]+`
    );
    if (!pattern.test(next)) {
      throw new Error(`Could not find numbeoColIndex for city id "${id}"`);
    }
    next = next.replace(pattern, `$1${formatIndex(index)}`);
  }
  return next;
}

function updateDataUpdated(content) {
  const month = new Date().toISOString().slice(0, 7);
  return content.replace(
    /export const DATA_UPDATED = "[0-9]{4}-[0-9]{2}";/,
    `export const DATA_UPDATED = "${month}";`
  );
}

async function main() {
  console.log(`Fetching Numbeo rankings from ${NUMBEO_URL} …`);
  const html = await fetchNumbeoRankings();
  const rankings = parseNumbeoRankings(html);
  console.log(`Parsed ${rankings.entries.length} Numbeo city entries.`);

  const matched = [];
  const unchanged = [];
  const unmatched = [];
  const updates = [];

  for (const city of CITY_CATALOG) {
    const entry = findNumbeoEntry(city, rankings);
    if (!entry) {
      unmatched.push(city);
      continue;
    }

    matched.push({ city, entry });
    const nextIndex = entry.index;
    if (Math.abs(nextIndex - city.numbeoColIndex) >= 0.05) {
      updates.push({ id: city.id, name: city.name, from: city.numbeoColIndex, to: nextIndex });
    } else {
      unchanged.push(city);
    }
  }

  console.log(`\nMatched: ${matched.length}/${CITY_CATALOG.length}`);
  console.log(`Unchanged indices: ${unchanged.length}`);
  console.log(`Index updates: ${updates.length}`);
  console.log(`Unmatched: ${unmatched.length}`);

  if (updates.length > 0) {
    console.log("\nSample changes:");
    for (const change of updates.slice(0, 12)) {
      console.log(
        `  ${change.name}: ${formatIndex(change.from)} → ${formatIndex(change.to)}`
      );
    }
    if (updates.length > 12) {
      console.log(`  … and ${updates.length - 12} more`);
    }
  }

  if (unmatched.length > 0) {
    console.log("\nUnmatched cities:");
    for (const city of unmatched) {
      console.log(`  - ${city.name} (${city.id})`);
    }
  }

  if (unmatched.length > MAX_UNMATCHED) {
    console.error(
      `\nToo many unmatched cities (${unmatched.length} > ${MAX_UNMATCHED}).`
    );
    process.exit(1);
  }

  if (updates.length === 0 && unmatched.length <= MAX_UNMATCHED) {
    console.log("\nNo index changes to write.");
    if (dryRun) return;
  }

  const catalogPath = join(ROOT, "cities-catalog.js");
  const dataPath = join(ROOT, "data.js");
  const catalogContent = readFileSync(catalogPath, "utf8");
  const dataContent = readFileSync(dataPath, "utf8");

  const nextCatalog = updateCatalogFile(
    catalogContent,
    updates.map(({ id, to }) => ({ id, index: to }))
  );
  const nextData = updateDataUpdated(dataContent);

  if (dryRun) {
    console.log("\nDry run — no files written.");
    return;
  }

  writeFileSync(catalogPath, nextCatalog);
  writeFileSync(dataPath, nextData);
  console.log("\nUpdated cities-catalog.js and data.js.");
  console.log("Run `npm run seo` (or bash scripts/run-seo.sh) to sync SEO artifacts.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
