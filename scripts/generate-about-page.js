/**
 * Generate about.html from site config + shared layout fragments.
 * Usage: node scripts/generate-about-page.js
 */
import { writeFileSync } from "fs";
import {
  ABOUT_PATH,
  CONTACT_EMAIL,
  COPYRIGHT_HOLDER,
  SITE_NAME,
  SITE_URL,
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
    "@type": "AboutPage",
    name: `About ${SITE_NAME}`,
    url: `${SITE_URL}${ABOUT_PATH}`,
    description: `Who publishes ${SITE_NAME}, editorial standards, and data sources.`,
    mainEntity: organizationJsonLd(),
  },
];

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
${renderHead(ABOUT_PATH, { extraJsonLd: jsonLd })}
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
${renderSiteHeader(assetPrefix, "about")}
    <main class="page page--content" id="main-content">
${renderBreadcrumb(assetPrefix, [
  { name: "Home", url: "/" },
  { name: "About" },
])}
      <article class="content panel">
        <h1>About ${escapeHtml(SITE_NAME)}</h1>
        <p class="content__lead">
          ${escapeHtml(SITE_NAME)} helps you compare how far a monthly salary stretches across cities —
          using public cost-of-living data, clear formulas, and plain-language guides. We built it for
          curiosity, relocation research, and water-cooler debates about “rich in Lisbon, poor in London.”
        </p>

        <h2>Who we are</h2>
        <p>
          ${escapeHtml(SITE_NAME)} is published by <strong>${escapeHtml(COPYRIGHT_HOLDER)}</strong>, a Danish company.
          We are a small team of developers and editors who maintain the calculator, refresh city data, and write
          the supporting guides on this site.
        </p>
        <p>
          Contact: <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>
        </p>

        <h2>What the site does</h2>
        <p>
          The core tool is a free salary purchasing-power calculator. Enter gross monthly pay and a home city;
          see equivalent amounts in 100+ destinations, plus simple vs-home labels and approximate local salary
          benchmarks. Supporting pages explain the math, data limits, and city-specific context.
        </p>
        <ul>
          <li><a href="index.html">Calculator</a> — live comparisons with shareable URLs</li>
          <li><a href="how-it-works.html">How it works</a> — walkthrough of badges and equivalents</li>
          <li><a href="methodology.html">Methodology</a> — formulas, Numbeo sourcing, known gaps</li>
          <li><a href="cities/index.html">City guides</a> — editorial context for featured hubs</li>
          <li><a href="guides/remote-work-relocation.html">Remote work guide</a> — checklist before you move</li>
        </ul>

        <h2>Editorial standards</h2>
        <p>
          We aim for useful, original writing — not auto-generated fluff. City guides and comparison pages combine
          hand-authored prose with transparent numbers from our dataset. When we update cost indices, we regenerate
          tables but keep editorial sections human-written and reviewed.
        </p>
        <ul>
          <li><strong>Data first.</strong> Indices come from Numbeo’s cost-of-living surveys (excluding rent in our primary formula). We document refresh dates on the <a href="methodology.html">methodology</a> page.</li>
          <li><strong>Directional, not prescriptive.</strong> Results are estimates for exploration — not financial, tax, legal, or immigration advice. See our <a href="terms.html">terms of use</a>.</li>
          <li><strong>Limitations upfront.</strong> Rent, taxes, healthcare, schools, and visa rules are called out where they matter; many are not modeled in the calculator.</li>
          <li><strong>No pay-to-rank cities.</strong> Rankings follow published indices and your inputs — destinations are not promoted for sponsorship.</li>
        </ul>

        <h2>What we do not do</h2>
        <p>
          We do not sell personal data, guarantee job offers, or provide individualized financial planning.
          Advertising (Google AdSense) may appear after you consent via our cookie banner; see the
          <a href="privacy.html">privacy policy</a> for details.
        </p>

        <h2>Corrections and feedback</h2>
        <p>
          Spotted outdated indices or unclear copy? Email
          <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>.
          We prioritize factual corrections to data and methodology; feature requests are welcome but not guaranteed.
        </p>
      </article>
    </main>
${renderSiteFooter(assetPrefix)}
  </body>
</html>
`;

writeFileSync(new URL("../about.html", import.meta.url), html);
console.log("Wrote about.html");
