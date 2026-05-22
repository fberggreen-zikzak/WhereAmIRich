/**
 * Site + SEO config. Update SITE_URL for production, then run:
 *   npm run seo
 */
export const SITE_URL = "https://richorpoor.com";
export const SITE_NAME = "Rich or Poor";
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

/**
 * Public HTML pages for sitemap.xml (path without domain, leading slash).
 * @type {{ path: string; changefreq: string; priority: string }[]}
 */
export const SITEMAP_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/how-it-works.html", changefreq: "monthly", priority: "0.8" },
  { path: "/methodology.html", changefreq: "monthly", priority: "0.7" },
  { path: "/faq.html", changefreq: "monthly", priority: "0.8" },
  { path: "/cities/london.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/new-york.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/lisbon.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/bangkok.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/dubai.html", changefreq: "monthly", priority: "0.7" },
];

/** Per-page title + meta description (path key matches SITEMAP_PAGES path) */
export const PAGE_SEO = {
  "/": {
    title: "Rich or Poor — Salary Purchasing Power Calculator",
    description:
      "Compare your monthly salary to 100+ cities worldwide. See equivalent spending power and where you're better or worse off than home — free, instant, shareable.",
  },
  "/how-it-works.html": {
    title: "How It Works — Rich or Poor",
    description:
      "Learn how the Rich or Poor calculator compares your salary across cities: equivalent pay, vs home badges, and local average benchmarks.",
  },
  "/methodology.html": {
    title: "Methodology & Data — Rich or Poor",
    description:
      "How we calculate purchasing power from Numbeo cost-of-living indices, status thresholds, FX for local salaries, and known limitations.",
  },
  "/faq.html": {
    title: "FAQ — Rich or Poor",
    description:
      "Answers about equivalent salary, rich vs poor labels, Numbeo data, currencies, share links, and how to interpret results.",
  },
  "/cities/london.html": {
    title: "London Salary Purchasing Power — Rich or Poor",
    description:
      "How far a London salary stretches in Paris, New York, Bangkok, and other cities — cost-of-living factors and local benchmarks.",
  },
  "/cities/new-york.html": {
    title: "New York Salary Purchasing Power — Rich or Poor",
    description:
      "Compare a New York monthly salary to London, Lisbon, Dubai, and more using Numbeo cost-of-living indices.",
  },
  "/cities/lisbon.html": {
    title: "Lisbon Salary Purchasing Power — Rich or Poor",
    description:
      "Lisbon is often great value abroad — see equivalent salary and spending power vs London, Berlin, and other destinations.",
  },
  "/cities/bangkok.html": {
    title: "Bangkok Salary Purchasing Power — Rich or Poor",
    description:
      "Bangkok's low cost of living vs Western hubs — equivalent pay and purchasing power from a Bangkok-based salary.",
  },
  "/cities/dubai.html": {
    title: "Dubai Salary Purchasing Power — Rich or Poor",
    description:
      "Dubai salary comparisons to London, Singapore, Bangkok, and other cities — COL-adjusted equivalents in your currency.",
  },
};

/** Featured city landings linked from homepage/footer */
export const FEATURED_CITIES = [
  { id: "london", name: "London", path: "/cities/london.html" },
  { id: "new-york", name: "New York", path: "/cities/new-york.html" },
  { id: "lisbon", name: "Lisbon", path: "/cities/lisbon.html" },
  { id: "bangkok", name: "Bangkok", path: "/cities/bangkok.html" },
  { id: "dubai", name: "Dubai", path: "/cities/dubai.html" },
];
