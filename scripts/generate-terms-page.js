/**
 * Generate terms.html from site config + shared layout fragments.
 * Usage: node scripts/generate-terms-page.js
 */
import { writeFileSync } from "fs";
import { COPYRIGHT_HOLDER, SITE_NAME, SITE_URL, TERMS_PATH } from "../site.config.js";
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
    name: "Terms of use",
    url: `${SITE_URL}${TERMS_PATH}`,
    description: `Terms of use for ${SITE_NAME}.`,
  },
];

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
${renderHead(TERMS_PATH, { extraJsonLd: jsonLd })}
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
${renderSiteHeader(assetPrefix, "terms")}
    <main class="page page--content" id="main-content">
${renderBreadcrumb(assetPrefix, [
  { name: "Home", url: "/" },
  { name: "Terms of use" },
])}
      <article class="content panel">
        <h1>Terms of use</h1>
        <p class="content__lead">
          ${escapeHtml(SITE_NAME)} is an informal comparison tool. Please read these terms before using the site.
          <strong>Last updated:</strong> May 2026.
        </p>

        <h2>1. Inspirational use only</h2>
        <p>
          The calculator, city guides, comparisons, and any text on this site are provided for
          <strong>inspiration, exploration, and general curiosity</strong> about how salaries might compare across cities.
          They are <strong>not</strong> a substitute for professional financial, tax, legal, immigration, or career advice.
        </p>
        <p>
          <strong>Do not use this site as the basis for financial decisions</strong> — including but not limited to
          accepting a job offer, negotiating pay, relocating, investing, borrowing, or planning a budget.
          Always verify figures with qualified advisers and primary sources that apply to your situation.
        </p>

        <h2>2. Indicative data</h2>
        <p>
          All numbers, labels (such as “rich”, “poor”, “better”, or “worse”), rankings, and equivalents shown on
          ${escapeHtml(SITE_NAME)} are <strong>indicative estimates</strong>, not guarantees of real-world outcomes.
        </p>
        <ul>
          <li>Cost-of-living indices come from third-party sources (primarily Numbeo) and may be outdated, incomplete, or unrepresentative of your lifestyle.</li>
          <li>Local average salaries are approximate benchmarks, converted with simplified exchange rates where needed.</li>
          <li>We do not model taxes, benefits, housing preferences, family size, healthcare, education, or visa rules.</li>
          <li>Indices exclude rent in our primary formula; housing can dominate real budgets.</li>
        </ul>
        <p>
          Your actual purchasing power depends on many factors we do not capture. Treat every result as a rough
          directional hint, not a fact.
        </p>

        <h2>3. No financial or professional advice</h2>
        <p>
          ${escapeHtml(COPYRIGHT_HOLDER)} operates ${escapeHtml(SITE_NAME)} as an information service only. Nothing on
          this site constitutes financial, investment, tax, legal, or relocation advice. No fiduciary or advisory
          relationship is created by your use of the site.
        </p>

        <h2>4. “As is” service</h2>
        <p>
          The site is provided <strong>“as is”</strong> and <strong>“as available”</strong>, without warranties of any
          kind, whether express or implied, including accuracy, completeness, fitness for a particular purpose, or
          non-infringement. We may change, suspend, or remove features or data at any time without notice.
        </p>

        <h2>5. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, ${escapeHtml(COPYRIGHT_HOLDER)} and its operators will not be liable
          for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of
          ${escapeHtml(SITE_NAME)} or reliance on any content, including lost profits, lost opportunities, or relocation
          costs — even if we have been advised of the possibility of such damages.
        </p>

        <h2>6. Third-party data and links</h2>
        <p>
          We reference external data providers (such as Numbeo) and may link to third-party sites. We do not control
          and are not responsible for their content, accuracy, or terms. Use of third-party services is at your own risk.
        </p>

        <h2>7. Your responsibility</h2>
        <p>
          You are responsible for how you interpret and use the site. You agree not to present our indicative outputs as
          audited, certified, or professional advice. If you share results, make clear they are informal estimates from
          ${escapeHtml(SITE_NAME)}.
        </p>

        <h2>8. Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes are posted constitutes
          acceptance of the revised terms. The date at the top of this page reflects the latest revision.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about these terms may be directed to ${escapeHtml(COPYRIGHT_HOLDER)} via the contact details you
          use for other Bulgogi ApS services, or through channels listed on our main site once published.
        </p>

        <p>
          <a class="content__cta" href="${assetPrefix}index.html">Back to calculator</a>
          <a href="${assetPrefix}methodology.html">Methodology &amp; limitations</a>
        </p>
      </article>
    </main>
${renderSiteFooter(assetPrefix)}
  </body>
</html>
`;

writeFileSync(new URL("../terms.html", import.meta.url), html);
console.log("Wrote terms.html");
