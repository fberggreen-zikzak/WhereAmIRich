/**
 * Shared HTML fragments for static SEO pages (Node build scripts only).
 */
import {
  FEATURED_CITIES,
  ORGANIZATION,
  PAGE_SEO,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "../site.config.js";

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {string} path e.g. "/faq.html"
 * @param {object} [opts]
 * @param {object|string} [opts.extraJsonLd]
 */
export function renderHead(path, opts = {}) {
  const seo = PAGE_SEO[path];
  if (!seo) throw new Error(`Missing PAGE_SEO for ${path}`);
  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const depth = path.split("/").filter(Boolean).length;
  const assetPrefix = depth > 1 ? "../" : "";
  const jsonLd = opts.extraJsonLd
    ? `\n    <script type="application/ld+json">\n${JSON.stringify(opts.extraJsonLd, null, 2).replace(/^/gm, "      ")}\n    </script>`
    : "";

  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0f0f0f" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="googlebot" content="index, follow" />
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/og-image.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${SITE_URL}/og-image.svg" />
    <link rel="icon" href="${assetPrefix}favicon.svg" type="image/svg+xml" sizes="any" />
    <link rel="apple-touch-icon" href="${assetPrefix}apple-touch-icon.svg" sizes="180x180" />
    <link rel="manifest" href="${assetPrefix}site.webmanifest" />
    <link rel="sitemap" type="application/xml" title="Sitemap" href="${assetPrefix}sitemap.xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${assetPrefix}styles.css" />${jsonLd}`;
}

/**
 * @param {string} assetPrefix
 * @param {string} [active] path segment: home | how | method | faq | cities
 */
export function renderSiteHeader(assetPrefix, active = "") {
  const home = active === "home" ? ' aria-current="page"' : "";
  const how = active === "how" ? ' aria-current="page"' : "";
  const method = active === "method" ? ' aria-current="page"' : "";
  const faq = active === "faq" ? ' aria-current="page"' : "";
  const calcHref = `${assetPrefix}index.html`;

  return `    <header class="site-header panel">
      <div class="site-header__inner">
        <a class="site-header__brand" href="${calcHref}"${home}>
          <span class="site-header__name">${escapeHtml(SITE_NAME)}</span>
          <span class="site-header__tagline">${escapeHtml(SITE_TAGLINE)}</span>
        </a>
        <nav class="site-nav" aria-label="Site">
          <a href="${calcHref}"${home}>Calculator</a>
          <a href="${assetPrefix}how-it-works.html"${how}>How it works</a>
          <a href="${assetPrefix}methodology.html"${method}>Methodology</a>
          <a href="${assetPrefix}faq.html"${faq}>FAQ</a>
        </nav>
      </div>
    </header>`;
}

/**
 * @param {string} assetPrefix
 */
export function renderSiteFooter(assetPrefix) {
  const cityLinks = FEATURED_CITIES.map(
    (c) =>
      `            <li><a href="${assetPrefix}${c.path.replace(/^\//, "")}">${escapeHtml(c.name)} salary guide</a></li>`
  ).join("\n");

  return `    <footer class="site-footer panel">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__title">${escapeHtml(SITE_NAME)}</p>
          <p class="site-footer__text">Cost-of-living comparisons for salary decisions — not financial advice.</p>
        </div>
        <nav aria-label="Learn more">
          <p class="site-footer__heading">Learn</p>
          <ul class="site-footer__links">
            <li><a href="${assetPrefix}how-it-works.html">How the calculator works</a></li>
            <li><a href="${assetPrefix}methodology.html">Methodology &amp; data sources</a></li>
            <li><a href="${assetPrefix}faq.html">Frequently asked questions</a></li>
          </ul>
        </nav>
        <nav aria-label="Popular cities">
          <p class="site-footer__heading">Popular cities</p>
          <ul class="site-footer__links">
${cityLinks}
          </ul>
        </nav>
      </div>
      <p class="site-footer__meta">Data: Numbeo cost-of-living indices (approximate). <a href="${assetPrefix}methodology.html">Read limitations</a>.</p>
    </footer>`;
}

/**
 * @param {string} assetPrefix
 * @param {{ name: string; url?: string }[]} items last item = current page (no url)
 */
export function renderBreadcrumb(assetPrefix, items) {
  const lis = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      if (isLast) {
        return `          <li aria-current="page">${escapeHtml(item.name)}</li>`;
      }
      const href = item.url.startsWith("http")
        ? item.url
        : `${assetPrefix}${item.url.replace(/^\//, "")}`;
      return `          <li><a href="${href}">${escapeHtml(item.name)}</a></li>`;
    })
    .join("\n");

  const jsonItems = items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    ...(item.url && i < items.length - 1
      ? {
          item: item.url.startsWith("http")
            ? item.url
            : `${SITE_URL}${item.url}`,
        }
      : {}),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: jsonItems,
  };

  return `      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
${lis}
        </ol>
      </nav>
      <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
      </script>`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
  };
}
