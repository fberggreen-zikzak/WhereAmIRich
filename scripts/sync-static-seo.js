/**
 * Sync hard-coded SEO URLs in hand-edited HTML to SITE_URL.
 * Usage: node scripts/sync-static-seo.js
 */
import { readFileSync, writeFileSync } from "fs";
import { SITE_URL } from "../site.config.js";

const ROOT = new URL("../", import.meta.url);
const FILES = ["index.html", "how-it-works.html", "methodology.html", "faq.html"];

/** @type {string[]} */
const REPLACE_FROM = [
  "https://richorpoor.com",
  "https://www.richorpoor.com",
  "https://whereamirich.com",
  "http://www.whereamirich.com",
  "http://whereamirich.com",
];

for (const file of FILES) {
  const path = new URL(file, ROOT);
  let html = readFileSync(path, "utf8");
  let changed = false;
  for (const from of REPLACE_FROM) {
    if (from === SITE_URL || !html.includes(from)) continue;
    html = html.split(from).join(SITE_URL);
    changed = true;
  }
  if (changed) {
    writeFileSync(path, html);
    console.log(`Synced ${file} → ${SITE_URL}`);
  }
}
