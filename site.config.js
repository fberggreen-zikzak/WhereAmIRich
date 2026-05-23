/**
 * Site + SEO config. Update SITE_URL for production, then run:
 *   npm run seo
 */
export const SITE_URL = "https://www.whereamirich.com";
export const SITE_NAME = "Where Am I Rich";
export const SITE_TAGLINE = "Rich in Lisbon. Poor in London.";
export const SITE_DESCRIPTION =
  "Free salary purchasing power calculator. Compare your monthly pay to 100+ cities — see where you're rich or poor after local living costs.";
export const SITE_KEYWORDS = [
  "purchasing power",
  "cost of living comparison",
  "equivalent salary abroad",
  "salary calculator by city",
  "rich or poor city",
  "Numbeo comparison",
  "expat salary",
  "remote work salary",
];

/** @type {{ email?: string; logo?: string }} */
export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.svg`,
};

export const CITIES_INDEX_PATH = "/cities/index.html";

/**
 * Public HTML pages for sitemap.xml (path without domain, leading slash).
 * @type {{ path: string; changefreq: string; priority: string }[]}
 */
export const SITEMAP_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/how-it-works.html", changefreq: "monthly", priority: "0.8" },
  { path: "/methodology.html", changefreq: "monthly", priority: "0.7" },
  { path: "/faq.html", changefreq: "monthly", priority: "0.8" },
  { path: CITIES_INDEX_PATH, changefreq: "monthly", priority: "0.75" },
  { path: "/comparisons/london-vs-lisbon.html", changefreq: "monthly", priority: "0.7" },
  { path: "/comparisons/new-york-vs-london.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/london.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/new-york.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/lisbon.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/bangkok.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/dubai.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/singapore.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/berlin.html", changefreq: "monthly", priority: "0.7" },
];

/** Per-page title + meta description (path key matches SITEMAP_PAGES path) */
export const PAGE_SEO = {
  "/": {
    title: "Where Am I Rich — Salary Purchasing Power Calculator",
    description:
      "Compare your monthly salary to 100+ cities worldwide. See equivalent spending power and where you're better or worse off than home — free, instant, shareable.",
  },
  "/how-it-works.html": {
    title: "How It Works — Where Am I Rich",
    description:
      "Learn how the Where Am I Rich calculator compares your salary across cities: equivalent pay, vs home badges, and local average benchmarks.",
  },
  "/methodology.html": {
    title: "Methodology & Data — Where Am I Rich",
    description:
      "How we calculate purchasing power from Numbeo cost-of-living indices, status thresholds, FX for local salaries, and known limitations.",
  },
  "/faq.html": {
    title: "FAQ — Where Am I Rich",
    description:
      "Answers about equivalent salary, rich vs poor labels, Numbeo data, currencies, share links, and how to interpret results.",
  },
  [CITIES_INDEX_PATH]: {
    title: "City Salary Guides — Where Am I Rich",
    description:
      "Browse salary purchasing power guides for London, New York, Lisbon, Bangkok, Dubai, Singapore, Berlin, and more — with links to the live calculator.",
  },
  "/comparisons/london-vs-lisbon.html": {
    title: "London vs Lisbon: Cost of Living & Salary Comparison",
    description:
      "Compare London and Lisbon cost-of-living indices, typical monthly salaries, and how far the same pay stretches in each city.",
  },
  "/comparisons/new-york-vs-london.html": {
    title: "New York vs London: Cost of Living & Salary Comparison",
    description:
      "New York vs London purchasing power: COL factors, average monthly pay, and when each city feels cheaper for the same lifestyle.",
  },
  "/cities/london.html": {
    title: "London Salary Purchasing Power — Where Am I Rich",
    description:
      "How far a London salary stretches in Paris, New York, Bangkok, and other cities — cost-of-living factors and local averages.",
  },
  "/cities/new-york.html": {
    title: "New York Salary Purchasing Power — Where Am I Rich",
    description:
      "Compare a New York monthly salary to London, Lisbon, Dubai, and more using Numbeo cost-of-living indices.",
  },
  "/cities/lisbon.html": {
    title: "Lisbon Salary Purchasing Power — Where Am I Rich",
    description:
      "Lisbon is often great value abroad — see equivalent salary and spending power vs London, Berlin, and other destinations.",
  },
  "/cities/bangkok.html": {
    title: "Bangkok Salary Purchasing Power — Where Am I Rich",
    description:
      "Bangkok's low cost of living vs Western hubs — equivalent pay and purchasing power from a Bangkok-based salary.",
  },
  "/cities/dubai.html": {
    title: "Dubai Salary Purchasing Power — Where Am I Rich",
    description:
      "Dubai salary comparisons to London, Singapore, Bangkok, and other cities — COL-adjusted equivalents in your currency.",
  },
  "/cities/singapore.html": {
    title: "Singapore Salary Purchasing Power — Where Am I Rich",
    description:
      "Singapore salary purchasing power vs Hong Kong, London, Bangkok, and other hubs — Numbeo COL and local pay context.",
  },
  "/cities/berlin.html": {
    title: "Berlin Salary Purchasing Power — Where Am I Rich",
    description:
      "Berlin cost of living vs Western capitals — equivalent monthly salary and spending power from a Berlin-based paycheck.",
  },
};

/** Featured city landings linked from homepage/footer */
export const FEATURED_CITIES = [
  { id: "london", name: "London", path: "/cities/london.html" },
  { id: "new-york", name: "New York", path: "/cities/new-york.html" },
  { id: "lisbon", name: "Lisbon", path: "/cities/lisbon.html" },
  { id: "bangkok", name: "Bangkok", path: "/cities/bangkok.html" },
  { id: "dubai", name: "Dubai", path: "/cities/dubai.html" },
  { id: "singapore", name: "Singapore", path: "/cities/singapore.html" },
  { id: "berlin", name: "Berlin", path: "/cities/berlin.html" },
];

/** Head-to-head comparison pages (unique copy, not mass-generated) */
export const FEATURED_COMPARISONS = [
  {
    slug: "london-vs-lisbon",
    cityAId: "london",
    cityBId: "lisbon",
    title: "London vs Lisbon",
    angle:
      "A classic remote-work pairing: high London costs vs Lisbon’s lower index and growing tech scene.",
  },
  {
    slug: "new-york-vs-london",
    cityAId: "new-york",
    cityBId: "london",
    title: "New York vs London",
    angle:
      "Two finance and media capitals with similar sticker prices — small COL differences still shift monthly equivalents.",
  },
];
