/**
 * Inject homepage learn/FAQ sections and FAQPage schema from content/home-seo.js.
 * Usage: node scripts/sync-home-seo.js
 */
import { readFileSync, writeFileSync } from "fs";
import { HOME_FAQ, HOME_LEARN, homeFaqSchemaEntities } from "../content/home-seo.js";
import { PAGE_SEO, SITE_URL } from "../site.config.js";
import { escapeHtml } from "./seo-html.js";

const INDEX = new URL("../index.html", import.meta.url);
const MARKER_START = "<!-- @home-learn-start -->";
const MARKER_END = "<!-- @home-learn-end -->";
const FAQ_SCHEMA_ID = "home-faq-schema";

function renderLearnSection() {
  const { howItWorks, methodology, whenUseful } = HOME_LEARN;
  const faqItems = HOME_FAQ.map(
    (item) => `          <details class="home-faq__item">
            <summary class="home-faq__question">${escapeHtml(item.question)}</summary>
            <p class="home-faq__answer">${escapeHtml(item.answer)}</p>
          </details>`
  ).join("\n");

  return `${MARKER_START}
      <section class="home-learn panel" aria-labelledby="home-learn-heading">
        <header class="home-learn__header">
          <h2 id="home-learn-heading" class="home-learn__title">Understanding your results</h2>
          <p class="home-learn__intro">
            A quick guide to what the calculator compares, what the numbers mean, and what we do not model.
            For relocation decisions, read the full <a href="${methodology.link.href}">methodology</a> and
            <a href="faq.html">FAQ</a> — this tool is for curiosity, not financial advice.
          </p>
        </header>
        <div class="home-learn__grid">
          <article class="home-learn__card" aria-labelledby="home-how-heading">
            <h3 id="home-how-heading" class="home-learn__card-title">${escapeHtml(howItWorks.title)}</h3>
            ${howItWorks.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n            ")}
            <p><a href="${howItWorks.link.href}">${escapeHtml(howItWorks.link.label)}</a></p>
          </article>
          <article class="home-learn__card" aria-labelledby="home-method-heading">
            <h3 id="home-method-heading" class="home-learn__card-title">${escapeHtml(methodology.title)}</h3>
            ${methodology.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n            ")}
            <p><a href="${methodology.link.href}">${escapeHtml(methodology.link.label)}</a></p>
          </article>
          <aside class="home-learn__card home-learn__card--aside" aria-labelledby="home-when-heading">
            <h3 id="home-when-heading" class="home-learn__card-title">${escapeHtml(whenUseful.title)}</h3>
            <ul class="home-learn__list">
              ${whenUseful.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n              ")}
            </ul>
            <p class="home-learn__links">
              <a href="cities/index.html">Browse city salary guides</a>
              <span aria-hidden="true"> · </span>
              <a href="comparisons/london-vs-lisbon.html">London vs Lisbon comparison</a>
            </p>
          </aside>
        </div>
        <div class="home-faq" aria-labelledby="home-faq-heading">
          <h3 id="home-faq-heading" class="home-faq__title">Common questions</h3>
          <div class="home-faq__list">
${faqItems}
          </div>
          <p class="home-faq__more"><a href="faq.html">Read all frequently asked questions</a></p>
        </div>
      </section>
${MARKER_END}`;
}

function renderFaqSchemaScript() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqSchemaEntities(),
  };
  return `<script type="application/ld+json" id="${FAQ_SCHEMA_ID}">
      ${JSON.stringify(payload, null, 2).replace(/^/gm, "      ").trim()}
    </script>`;
}

function syncTitleAndDescription(html) {
  const seo = PAGE_SEO["/"];
  if (!seo) return html;
  let next = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`);
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`
  );
  return next;
}

function syncRobots(html) {
  const robots =
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  return html.replace(
    /<meta name="robots" content="[^"]*" \/>/,
    `<meta name="robots" content="${robots}" />`
  );
}

function syncLearnSection(html) {
  const block = renderLearnSection();
  const pattern = new RegExp(
    `${MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
  );
  if (pattern.test(html)) {
    return html.replace(pattern, block);
  }
  const insertBefore = /<footer class="site-footer panel">/;
  if (!insertBefore.test(html)) {
    throw new Error("Could not find footer anchor for home-learn section");
  }
  return html.replace(insertBefore, `${block}\n\n    `);
}

function syncFaqSchema(html) {
  const script = renderFaqSchemaScript();
  const pattern = new RegExp(
    `<script type="application/ld\\+json" id="${FAQ_SCHEMA_ID}">[\\s\\S]*?<\\/script>`
  );
  if (pattern.test(html)) {
    return html.replace(pattern, script);
  }
  return html.replace(
    /<script type="module" src="app\.js"><\/script>/,
    `${script}\n\n    <script type="module" src="app.js"></script>`
  );
}

function syncWebPageInGraph(html) {
  const seo = PAGE_SEO["/"];
  if (!seo) return html;
  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: seo.title,
    description: seo.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: {
      "@type": "Thing",
      name: "Salary purchasing power comparison by city",
    },
    inLanguage: "en-US",
  };
  if (html.includes('"@id": "https://www.whereamirich.com/#webpage"')) {
    return html;
  }
  return html.replace(
    /("@type": "SoftwareApplication"[\s\S]*?\}\s*),(\s*\{\s*"@type": "ItemList")/,
    `$1,
          ${JSON.stringify(webPage, null, 12).replace(/^/gm, "          ").trim()},
          $2`
  );
}

let html = readFileSync(INDEX, "utf8");
const before = html;
html = syncTitleAndDescription(html);
html = syncRobots(html);
html = syncLearnSection(html);
html = syncFaqSchema(html);
html = syncWebPageInGraph(html);

if (html !== before) {
  writeFileSync(INDEX, html);
  console.log("Synced homepage SEO content (learn section, FAQ schema, meta)");
} else {
  console.log("Homepage SEO already in sync");
}
