/**
 * Generate privacy.html from site config + shared layout fragments.
 * Usage: node scripts/generate-privacy-page.js
 */
import { writeFileSync } from "fs";
import {
  ADSENSE_CLIENT_ID,
  CONTACT_EMAIL,
  COPYRIGHT_HOLDER,
  GA_MEASUREMENT_ID,
  PRIVACY_PATH,
  SITE_NAME,
  SITE_URL,
  TERMS_PATH,
} from "../site.config.js";
import {
  escapeHtml,
  organizationJsonLd,
  renderBreadcrumb,
  renderHead,
  renderSiteFooter,
  renderSiteHeader,
} from "./seo-html.js";

const assetPrefix = "";
const jsonLd = [
  organizationJsonLd(),
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy policy",
    url: `${SITE_URL}${PRIVACY_PATH}`,
    description: `Privacy policy for ${SITE_NAME}.`,
  },
];

const html = `<!DOCTYPE html>
<html lang="en" data-site-name="${escapeHtml(SITE_NAME)}">
  <head>
${renderHead(PRIVACY_PATH, { extraJsonLd: jsonLd })}
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
${renderSiteHeader(assetPrefix, "privacy")}
    <main class="page page--content" id="main-content">
${renderBreadcrumb(assetPrefix, [
  { name: "Home", url: "/" },
  { name: "Privacy policy" },
])}
      <article class="content panel">
        <h1>Privacy policy</h1>
        <p class="content__lead">
          ${escapeHtml(COPYRIGHT_HOLDER)} (“we”) operates ${escapeHtml(SITE_NAME)}. This policy explains what we
          collect, why, and your choices. <strong>Last updated:</strong> May 2026.
        </p>

        <h2>1. Who we are</h2>
        <p>
          Data controller for this website: <strong>${escapeHtml(COPYRIGHT_HOLDER)}</strong>.
          The public site is ${escapeHtml(SITE_NAME)} at ${escapeHtml(SITE_URL)}.
        </p>

        <h2>2. What we collect</h2>
        <ul>
          <li><strong>Calculator use:</strong> Salary and city choices you enter are processed in your browser. Share URLs encode those values in the link; we do not store them on our servers (static hosting).</li>
          <li><strong>Analytics (optional):</strong> If you choose “Accept all”, Google Analytics (${escapeHtml(GA_MEASUREMENT_ID || "disabled")}) may collect usage data such as pages viewed, device type, and approximate location.</li>
          <li><strong>Advertising (optional):</strong> If you accept all cookies, Google AdSense (${escapeHtml(ADSENSE_CLIENT_ID || "disabled")}) may use cookies to show and measure ads.</li>
          <li><strong>Consent choice:</strong> We store your cookie preference (<code>wair-consent</code>) in your browser’s local storage.</li>
        </ul>

        <h2>3. Legal bases (EEA/UK visitors)</h2>
        <p>
          For essential site operation we rely on <strong>legitimate interest</strong> (delivering the calculator you requested).
          For analytics and advertising we ask for your <strong>consent</strong> via the cookie banner before loading those services.
        </p>

        <h2>4. Third parties</h2>
        <ul>
          <li><a href="https://policies.google.com/privacy" rel="noopener noreferrer">Google</a> (Analytics, AdSense, fonts if loaded)</li>
          <li><a href="https://www.numbeo.com/" rel="noopener noreferrer">Numbeo</a> (referenced data; no personal data sent by us to Numbeo from your browser beyond normal page requests if you follow links)</li>
          <li><a href="https://flagcdn.com/" rel="noopener noreferrer">Flag CDN</a> (country flag images on city cards)</li>
          <li>GitHub Pages (hosting)</li>
        </ul>

        <h2>5. Retention</h2>
        <p>
          Analytics and ad data retention is governed by Google’s settings. Your consent choice remains in local storage until you clear site data or change it.
        </p>

        <h2>6. Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or restrict processing of personal data,
          and to withdraw consent. Use “Essential only” in the cookie banner to stop analytics/ads on future visits (clear site data to reset).
          You may also use browser controls to block cookies entirely.
        </p>

        <h2>7. Children</h2>
        <p>This site is not directed at children under 16.</p>

        <h2>8. Changes</h2>
        <p>We may update this policy; the date above will change when we do.</p>

        <h2>9. Contact</h2>
        <p>
          Privacy questions: <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>
          (${escapeHtml(COPYRIGHT_HOLDER)}).
          See also <a href="${assetPrefix}${TERMS_PATH.replace(/^\//, "")}">terms of use</a>.
        </p>

        <p>
          <a class="content__cta" href="${assetPrefix}index.html">Back to calculator</a>
        </p>
      </article>
    </main>
${renderSiteFooter(assetPrefix)}
  </body>
</html>
`;

writeFileSync(new URL("../privacy.html", import.meta.url), html);
console.log("Wrote privacy.html");
