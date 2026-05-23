/**
 * Export minimal city data for Cloudflare OG worker + share presets.
 * Usage: node scripts/export-share-data.js
 */
import { writeFileSync } from "fs";
import { CITY_CATALOG } from "../cities-catalog.js";
import { DEFAULT_COMPARISON_IDS, DEFAULT_SALARY } from "../data.js";
import { SITE_NAME, SITE_URL, OG_IMAGE_URL } from "../site.config.js";

const payload = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  ogImage: OG_IMAGE_URL,
  defaultSalary: DEFAULT_SALARY,
  defaultComparisonIds: DEFAULT_COMPARISON_IDS,
  cities: CITY_CATALOG.map((c) => ({
    id: c.id,
    name: c.name,
    numbeoColIndex: c.numbeoColIndex,
    currencyLabel: c.currencyLabel,
  })),
};

writeFileSync(new URL("../share-data.json", import.meta.url), JSON.stringify(payload, null, 2));
console.log(`Wrote share-data.json (${payload.cities.length} cities)`);
