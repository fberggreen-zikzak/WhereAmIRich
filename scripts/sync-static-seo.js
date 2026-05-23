/**
 * Sync hard-coded SEO URLs in hand-edited HTML to SITE_URL.
 * Usage: node scripts/sync-static-seo.js
 */
import { readFileSync, writeFileSync } from "fs";
import { OG_IMAGE_URL, SITE_DISCLAIMER_SHORT, SITE_URL, TERMS_PATH } from "../site.config.js";
import { renderAdSense, renderSocialPreviewTags } from "./seo-html.js";

const ROOT = new URL("../", import.meta.url);
const ADSENSE_MARKER = "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

const FILES = ["index.html", "how-it-works.html", "methodology.html", "faq.html", "terms.html"];

/** @type {Record<string, string>} */
const FILE_TO_PAGE_PATH = {
  "index.html": "/",
  "how-it-works.html": "/how-it-works.html",
  "methodology.html": "/methodology.html",
  "faq.html": "/faq.html",
  "terms.html": TERMS_PATH,
};
const OLD_FOOTER_TEXT = "Cost-of-living comparisons for salary decisions — not financial advice.";
const NEW_FOOTER_HTML = `${SITE_DISCLAIMER_SHORT} <a href="terms.html">Terms of use</a>`;
const OG_IMAGE_FROM = `${SITE_URL}/og-image.svg`;

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
  if (html.includes(OG_IMAGE_FROM)) {
    html = html.split(OG_IMAGE_FROM).join(OG_IMAGE_URL);
    changed = true;
  }
  if (html.includes(OLD_FOOTER_TEXT)) {
    html = html.split(OLD_FOOTER_TEXT).join(NEW_FOOTER_HTML);
    changed = true;
  }
  const pagePath = FILE_TO_PAGE_PATH[file];
  if (pagePath) {
    const socialBlock = renderSocialPreviewTags(pagePath).trim();
    const socialPattern =
      /<meta property="og:type" content="website" \/>[\s\S]*?(?:<meta name="twitter:image:alt"[\s\S]*?\/>|<meta name="twitter:card" content="summary_large_image" \/>)/;
    const replaced = html.replace(socialPattern, socialBlock);
    if (replaced !== html) {
      html = replaced;
      changed = true;
    }
  }
  if (!html.includes(ADSENSE_MARKER)) {
    const inserted = html.replace(
      /(<script>\s*window\.dataLayer[\s\S]*?gtag\("config", "[^"]+"\);\s*<\/script>)/,
      `$1${renderAdSense()}`
    );
    if (inserted !== html) {
      html = inserted;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(path, html);
    console.log(`Synced ${file} → ${SITE_URL}`);
  }
}
