/**
 * Regenerate sitemap.xml and robots.txt from site.config.js
 * Usage: node scripts/generate-sitemap.js
 */
import { writeFileSync } from "fs";
import { FEATURED_CITIES, SITE_URL, SITEMAP_PAGES } from "../site.config.js";
import { DATA_UPDATED } from "../data.js";

/** Stable lastmod — tied to data refresh, not wall clock (keeps CI deterministic). */
const lastmod = `${DATA_UPDATED}-01`;

const sharePages = [
  ...SITEMAP_PAGES,
  ...FEATURED_CITIES.map(({ id }) => ({
    path: `/share/${id}.html`,
    changefreq: "monthly",
    priority: "0.55",
  })),
];

const urls = sharePages.map(
  ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path === "/" ? "/" : path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(new URL("../sitemap.xml", import.meta.url), xml);
writeFileSync(
  new URL("../robots.txt", import.meta.url),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
);
console.log(`Updated sitemap.xml (${sharePages.length} URLs) and robots.txt for ${SITE_URL}`);
