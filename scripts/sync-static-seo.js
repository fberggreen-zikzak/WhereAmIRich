/**
 * Sync hard-coded SEO URLs in hand-edited HTML to SITE_URL.
 * Usage: node scripts/sync-static-seo.js
 */
import { readFileSync, writeFileSync } from "fs";
import {
  OG_IMAGE_URL,
  PRIVACY_PATH,
  SITE_DISCLAIMER_SHORT,
  SITE_URL,
  TERMS_PATH,
} from "../site.config.js";
import { DATA_UPDATED } from "../data.js";
import { GOOGLE_FONTS_URL, renderConsentScripts, renderSocialPreviewTags } from "./seo-html.js";

const ROOT = new URL("../", import.meta.url);
const ANALYTICS_BLOCK =
  /\s*<!-- Google tag \(gtag\.js\) -->[\s\S]*?pagead\/js\/adsbygoogle\.js[^<]*><\/script>/;

const FILES = [
  "index.html",
  "how-it-works.html",
  "methodology.html",
  "faq.html",
  "terms.html",
  "privacy.html",
];

/** @type {Record<string, string>} */
const FILE_TO_PAGE_PATH = {
  "index.html": "/",
  "how-it-works.html": "/how-it-works.html",
  "methodology.html": "/methodology.html",
  "faq.html": "/faq.html",
  "terms.html": TERMS_PATH,
  "privacy.html": PRIVACY_PATH,
};

const OLD_FOOTER_TEXT = "Cost-of-living comparisons for salary decisions — not financial advice.";
const NEW_FOOTER_HTML = `${SITE_DISCLAIMER_SHORT} <a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a>`;
const OG_IMAGE_FROM = `${SITE_URL}/og-image.svg`;
/** Old Google Fonts URL (italics + variable axis) — not the trimmed GOOGLE_FONTS_URL. */
const LEGACY_FONTS =
  /https:\/\/fonts\.googleapis\.com\/css2\?family=DM\+Sans:ital,[^"']+/g;

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
  let html;
  try {
    html = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  let changed = false;
  const assetPrefix = file === "index.html" ? "" : "";

  for (const from of REPLACE_FROM) {
    if (from === SITE_URL || !html.includes(from)) continue;
    html = html.split(from).join(SITE_URL);
    changed = true;
  }
  if (html.includes(OG_IMAGE_FROM)) {
    const next = html.split(OG_IMAGE_FROM).join(OG_IMAGE_URL);
    if (next !== html) {
      html = next;
      changed = true;
    }
  }
  if (LEGACY_FONTS.test(html)) {
    LEGACY_FONTS.lastIndex = 0;
    const next = html.replace(LEGACY_FONTS, GOOGLE_FONTS_URL);
    if (next !== html) {
      html = next;
      changed = true;
    }
  }
  if (html.includes(OLD_FOOTER_TEXT)) {
    const next = html.split(OLD_FOOTER_TEXT).join(NEW_FOOTER_HTML);
    if (next !== html) {
      html = next;
      changed = true;
    }
  }
  const dataMeta = /Numbeo data \(indicative, updated \d{4}-\d{2}\)/;
  if (dataMeta.test(html)) {
    const next = html.replace(
      dataMeta,
      `Numbeo data (indicative, updated ${DATA_UPDATED})`
    );
    if (next !== html) {
      html = next;
      changed = true;
    }
  }
  if (/last data pass: \d{4}-\d{2}/.test(html)) {
    const next = html.replace(/last data pass: \d{4}-\d{2}/g, `last data pass: ${DATA_UPDATED}`);
    if (next !== html) {
      html = next;
      changed = true;
    }
  }
  if (ANALYTICS_BLOCK.test(html)) {
    const next = html.replace(ANALYTICS_BLOCK, "");
    if (next !== html) {
      html = next;
      changed = true;
    }
  }
  if (!html.includes("consent.js")) {
    const inserted = html.replace(
      /<meta name="googlebot" content="index, follow" \/>/,
      `$&${renderConsentScripts(assetPrefix)}`
    );
    if (inserted !== html) {
      html = inserted;
      changed = true;
    }
  }
  const pagePath = FILE_TO_PAGE_PATH[file];
  if (pagePath) {
    const socialBlock = renderSocialPreviewTags(pagePath).trim();
    const socialPattern =
      /<meta property="og:type" content="website" \/>[\s\S]*?(?=\n\s*<link rel=")/;
    const replaced = html.replace(socialPattern, socialBlock);
    if (replaced !== html) {
      html = replaced;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(path, html);
    console.log(`Synced ${file}`);
  }
}
