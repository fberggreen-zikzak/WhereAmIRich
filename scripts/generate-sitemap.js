/**
 * Regenerate sitemap.xml from site.config.js
 * Usage: node scripts/generate-sitemap.js
 */
import { writeFileSync } from "fs";
import { SITE_URL } from "../site.config.js";

const lastmod = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
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
console.log(`Updated sitemap.xml and robots.txt for ${SITE_URL}`);
