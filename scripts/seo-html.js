/**
 * Shared HTML fragments for static SEO pages (Node build scripts only).
 */
import {
  CITIES_INDEX_PATH,
  FEATURED_CITIES,
  FEATURED_COMPARISONS,
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  ORGANIZATION,
  PAGE_SEO,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  ADSENSE_CLIENT_ID,
  DEFAULT_SHARE,
  GA_MEASUREMENT_ID,
  SITE_DISCLAIMER_SHORT,
  PRIVACY_PATH,
  TERMS_PATH,
  ABOUT_PATH,
  copyrightNotice,
} from "../site.config.js";
import { DATA_SOURCE, DATA_UPDATED } from "../data.js";

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Trimmed Google Fonts — regular + semibold/bold sans, display serif only */
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700&family=Instrument+Serif&display=swap";

/** Non-render-blocking Google Fonts (preload + onload stylesheet). */
export function renderFontLinks() {
  return `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="${GOOGLE_FONTS_URL}" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="${GOOGLE_FONTS_URL}" /></noscript>`;
}

/** @param {string} assetPrefix */
export function renderStylesheetLink(assetPrefix) {
  return `
    <link rel="preload" href="${assetPrefix}styles.css" as="style" />
    <link rel="stylesheet" href="${assetPrefix}styles.css" />`;
}

/** @param {{ ogTitle?: string; ogDescription?: string; title: string; description: string }} seo */
export function shareMeta(seo) {
  return {
    title: seo.ogTitle ?? DEFAULT_SHARE.ogTitle,
    description:
      seo.ogDescription ?? seo.description ?? DEFAULT_SHARE.ogDescription,
  };
}

/**
 * Open Graph + Twitter tags for social previews (uses DEFAULT_SHARE when page omits overrides).
 * @param {string} path PAGE_SEO key, e.g. "/faq.html"
 */
export function renderSocialPreviewTags(path) {
  const seo = PAGE_SEO[path];
  if (!seo) throw new Error(`Missing PAGE_SEO for ${path}`);
  const share = shareMeta(seo);
  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  return `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escapeHtml(share.title)}" />
    <meta property="og:description" content="${escapeHtml(share.description)}" />
    <meta property="og:url" content="${canonical}" />${renderOpenGraphTags(share)}`;
}

export function renderOpenGraphTags(share) {
  return `
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:secure_url" content="${OG_IMAGE_URL}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(share.title)}" />
    <meta name="twitter:description" content="${escapeHtml(share.description)}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
    <meta name="twitter:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}" />`;
}

/** AdSense site verification + ad loader (must be in &lt;head&gt; on every page). */
export function renderAdSenseScript() {
  if (!ADSENSE_CLIENT_ID) return "";
  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT_ID)}`;
  return `
    <script async src="${src}" crossorigin="anonymous"></script>`;
}

/** Deferred analytics/ads — loaded by consent.js after user accepts. */
export function renderConsentScripts(assetPrefix = "") {
  const parts = [`document.documentElement.dataset.siteName=${JSON.stringify(SITE_NAME)};`];
  if (GA_MEASUREMENT_ID) {
    parts.push(`document.documentElement.dataset.gaId=${JSON.stringify(GA_MEASUREMENT_ID)};`);
  }
  if (ADSENSE_CLIENT_ID) {
    parts.push(
      `document.documentElement.dataset.adsenseClient=${JSON.stringify(ADSENSE_CLIENT_ID)};`
    );
  }
  return `
    <script>${parts.join("")}</script>
    <script src="${assetPrefix}consent.js" defer></script>`;
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
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="googlebot" content="index, follow" />${renderConsentScripts(assetPrefix)}${renderAdSenseScript()}
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <link rel="canonical" href="${canonical}" />${renderSocialPreviewTags(path)}
    <link rel="icon" href="${assetPrefix}favicon.svg" type="image/svg+xml" sizes="any" />
    <link rel="apple-touch-icon" href="${assetPrefix}apple-touch-icon.svg" sizes="180x180" />
    <link rel="manifest" href="${assetPrefix}site.webmanifest" />
    <link rel="sitemap" type="application/xml" title="Sitemap" href="${assetPrefix}sitemap.xml" />${renderFontLinks()}
${renderStylesheetLink(assetPrefix)}${jsonLd}`;
}

/**
 * @param {string} assetPrefix
 * @param {string} [active] home | how | method | faq | cities | compare | about
 */
export function renderSiteHeader(assetPrefix, active = "") {
  const home = active === "home" ? ' aria-current="page"' : "";
  const how = active === "how" ? ' aria-current="page"' : "";
  const method = active === "method" ? ' aria-current="page"' : "";
  const faq = active === "faq" ? ' aria-current="page"' : "";
  const cities = active === "cities" ? ' aria-current="page"' : "";
  const about = active === "about" ? ' aria-current="page"' : "";
  const calcHref = `${assetPrefix}index.html`;
  const citiesHref = `${assetPrefix}${CITIES_INDEX_PATH.replace(/^\//, "")}`;

  return `    <header class="site-header">
      <div class="site-header__inner">
        <a class="site-header__brand" href="${calcHref}"${home}>
          <span class="site-header__name">${escapeHtml(SITE_NAME)}</span>
          <span class="site-header__tagline">${escapeHtml(SITE_TAGLINE)}</span>
        </a>
        <nav class="site-nav" aria-label="Site">
          <a class="site-nav__link" href="${calcHref}"${home}>Calculator</a>
          <a class="site-nav__link" href="${citiesHref}"${cities}>City guides</a>
          <a class="site-nav__link" href="${assetPrefix}how-it-works.html"${how}>How it works</a>
          <a class="site-nav__link" href="${assetPrefix}methodology.html"${method}>Methodology</a>
          <a class="site-nav__link" href="${assetPrefix}faq.html"${faq}>FAQ</a>
          <a class="site-nav__link" href="${assetPrefix}${ABOUT_PATH.replace(/^\//, "")}"${about}>About</a>
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

  const compareLinks = FEATURED_COMPARISONS.map(
    (c) =>
      `            <li><a href="${assetPrefix}comparisons/${c.slug}.html">${escapeHtml(c.title)}</a></li>`
  ).join("\n");

  const citiesIndexHref = `${assetPrefix}${CITIES_INDEX_PATH.replace(/^\//, "")}`;

  return `    <footer class="site-footer panel">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__title">${escapeHtml(SITE_NAME)}</p>
          <p class="site-footer__text">${escapeHtml(SITE_DISCLAIMER_SHORT)} <a href="${assetPrefix}${PRIVACY_PATH.replace(/^\//, "")}">Privacy</a> · <a href="${assetPrefix}${TERMS_PATH.replace(/^\//, "")}">Terms</a></p>
        </div>
        <nav aria-label="Learn more">
          <p class="site-footer__heading">Learn</p>
          <ul class="site-footer__links">
            <li><a href="${assetPrefix}how-it-works.html">How the calculator works</a></li>
            <li><a href="${assetPrefix}methodology.html">Methodology &amp; data sources</a></li>
            <li><a href="${assetPrefix}faq.html">Frequently asked questions</a></li>
            <li><a href="${assetPrefix}${ABOUT_PATH.replace(/^\//, "")}">About us</a></li>
            <li><a href="${assetPrefix}${PRIVACY_PATH.replace(/^\//, "")}">Privacy policy</a></li>
            <li><a href="${assetPrefix}${TERMS_PATH.replace(/^\//, "")}">Terms of use</a></li>
          </ul>
        </nav>
        <nav aria-label="City guides">
          <p class="site-footer__heading">City guides</p>
          <ul class="site-footer__links">
            <li><a href="${citiesIndexHref}">All city guides</a></li>
${cityLinks}
          </ul>
        </nav>
        <nav aria-label="City comparisons">
          <p class="site-footer__heading">Comparisons</p>
          <ul class="site-footer__links">
${compareLinks}
          </ul>
        </nav>
      </div>
      <p class="site-footer__legal">${escapeHtml(copyrightNotice())}</p>
      <p class="site-footer__meta">${escapeHtml(DATA_SOURCE)} data (indicative, updated ${escapeHtml(DATA_UPDATED)}). <a href="${assetPrefix}methodology.html">Methodology</a> · <a href="${assetPrefix}${PRIVACY_PATH.replace(/^\//, "")}">Privacy</a></p>
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
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
  };
}

/**
 * @param {string} path
 * @param {string} name
 * @param {string} description
 */
export function webPageJsonLd(path, name, description) {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url,
    description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}
