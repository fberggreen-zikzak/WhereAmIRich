/**
 * Site + SEO config. Update SITE_URL for production, then run:
 *   npm run seo
 */
export const SITE_URL = "https://www.whereamirich.com";
export const SITE_NAME = "WhereAmIRich.com";
export const SITE_TAGLINE = "Purchasing power, city by city.";

/** Raster OG image — required for iMessage, Slack, LinkedIn, etc. (SVG is not supported). */
export const OG_IMAGE_PATH = "/og-image.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;
export const OG_IMAGE_ALT =
  "Rich in Lisbon. Poor in London. — compare salary purchasing power across 100+ cities";

/**
 * Default Open Graph / Twitter preview text when a page has no ogTitle / ogDescription.
 * Used for link unfurls (iMessage, Slack, LinkedIn, etc.).
 */
export const DEFAULT_SHARE = {
  ogTitle: "Rich in Lisbon. Poor in London.",
  ogDescription:
    "Compare your monthly salary to 100+ cities. See where you're rich or poor after local costs — free, instant calculator.",
};

/** Homepage overrides (optional); falls back to DEFAULT_SHARE fields not set here. */
export const HOME_SHARE = {
  ...DEFAULT_SHARE,
  ogDescription:
    "Enter your monthly salary and home city. See equivalent pay in 100+ cities — where you're rich or poor after local costs.",
};
export const GA_MEASUREMENT_ID = "G-8B5FDK9V77";
/** Google AdSense publisher ID (site verification + ads). */
export const ADSENSE_CLIENT_ID = "ca-pub-6644431061410794";
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

export const COPYRIGHT_HOLDER = "Bulgogi ApS";
/** Public contact for legal/privacy (update if you use a different inbox). */
export const CONTACT_EMAIL = "hello@bulgogi.dk";

/** Short disclaimer shown in footer and near the calculator. */
export const SITE_DISCLAIMER_SHORT =
  "For inspiration and general curiosity only — not for financial, tax, legal, or relocation decisions. All data is indicative.";

export const TERMS_PATH = "/terms.html";
export const PRIVACY_PATH = "/privacy.html";

/** @param {number} [year] */
export function copyrightNotice(year = new Date().getFullYear()) {
  return `© ${year} ${COPYRIGHT_HOLDER}. All rights reserved.`;
}

/** @type {{ legalName: string; logo?: string }} */
export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: COPYRIGHT_HOLDER,
  url: SITE_URL,
  logo: OG_IMAGE_URL,
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
  { path: TERMS_PATH, changefreq: "yearly", priority: "0.5" },
  { path: PRIVACY_PATH, changefreq: "yearly", priority: "0.5" },
  { path: CITIES_INDEX_PATH, changefreq: "monthly", priority: "0.75" },
  { path: "/comparisons/london-vs-lisbon.html", changefreq: "monthly", priority: "0.7" },
  { path: "/comparisons/new-york-vs-london.html", changefreq: "monthly", priority: "0.7" },
  { path: "/comparisons/dubai-vs-bangkok.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/london.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/new-york.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/lisbon.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/bangkok.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/dubai.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/singapore.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/berlin.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/paris.html", changefreq: "monthly", priority: "0.7" },
  { path: "/cities/barcelona.html", changefreq: "monthly", priority: "0.7" },
];

/** Per-page title + meta description (path key matches SITEMAP_PAGES path) */
export const PAGE_SEO = {
  "/": {
    title: "WhereAmIRich.com — Salary Purchasing Power Calculator",
    ogTitle: HOME_SHARE.ogTitle,
    ogDescription: HOME_SHARE.ogDescription,
    description:
      "Compare your monthly salary to 100+ cities worldwide. See equivalent spending power and where you're better or worse off than home — free, instant, shareable.",
  },
  "/how-it-works.html": {
    title: "How It Works — WhereAmIRich.com",
    description:
      "Learn how the WhereAmIRich.com calculator compares your salary across cities: equivalent pay, vs home badges, and local average benchmarks.",
  },
  "/methodology.html": {
    title: "Methodology & Data — WhereAmIRich.com",
    description:
      "How we calculate purchasing power from Numbeo cost-of-living indices, status thresholds, FX for local salaries, and known limitations.",
  },
  "/faq.html": {
    title: "FAQ — WhereAmIRich.com",
    description:
      "Answers about equivalent salary, rich vs poor labels, Numbeo data, currencies, share links, and how to interpret results.",
  },
  [TERMS_PATH]: {
    title: "Terms of Use — WhereAmIRich.com",
    description:
      "Terms of use: inspirational comparisons only, indicative data, no financial advice, and limitations of liability for WhereAmIRich.com.",
  },
  [PRIVACY_PATH]: {
    title: "Privacy Policy — WhereAmIRich.com",
    description:
      "How WhereAmIRich.com uses cookies, Google Analytics, and AdSense; your choices and rights regarding personal data.",
  },
  [CITIES_INDEX_PATH]: {
    title: "City Salary Guides — WhereAmIRich.com",
    description:
      "Browse salary purchasing power guides for London, New York, Paris, Barcelona, Lisbon, Bangkok, Dubai, Singapore, Berlin, and more.",
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
  "/comparisons/dubai-vs-bangkok.html": {
    title: "Dubai vs Bangkok: Cost of Living & Salary Comparison",
    description:
      "Dubai vs Bangkok for expats and remote workers — COL indices, typical salaries, and where the same paycheck stretches further.",
  },
  "/cities/london.html": {
    title: "London Salary Purchasing Power — WhereAmIRich.com",
    description:
      "How far a London salary stretches in Paris, New York, Bangkok, and other cities — cost-of-living factors and local averages.",
  },
  "/cities/new-york.html": {
    title: "New York Salary Purchasing Power — WhereAmIRich.com",
    description:
      "Compare a New York monthly salary to London, Lisbon, Dubai, and more using Numbeo cost-of-living indices.",
  },
  "/cities/lisbon.html": {
    title: "Lisbon Salary Purchasing Power — WhereAmIRich.com",
    description:
      "Lisbon is often great value abroad — see equivalent salary and spending power vs London, Berlin, and other destinations.",
  },
  "/cities/bangkok.html": {
    title: "Bangkok Salary Purchasing Power — WhereAmIRich.com",
    description:
      "Bangkok's low cost of living vs Western hubs — equivalent pay and purchasing power from a Bangkok-based salary.",
  },
  "/cities/dubai.html": {
    title: "Dubai Salary Purchasing Power — WhereAmIRich.com",
    description:
      "Dubai salary comparisons to London, Singapore, Bangkok, and other cities — COL-adjusted equivalents in your currency.",
  },
  "/cities/singapore.html": {
    title: "Singapore Salary Purchasing Power — WhereAmIRich.com",
    description:
      "Singapore salary purchasing power vs Hong Kong, London, Bangkok, and other hubs — Numbeo COL and local pay context.",
  },
  "/cities/berlin.html": {
    title: "Berlin Salary Purchasing Power — WhereAmIRich.com",
    description:
      "Berlin cost of living vs Western capitals — equivalent monthly salary and spending power from a Berlin-based paycheck.",
  },
  "/cities/paris.html": {
    title: "Paris Salary Purchasing Power — WhereAmIRich.com",
    description:
      "How far a Paris salary stretches in London, Lisbon, Bangkok, and other cities — Numbeo COL factors and local pay context.",
  },
  "/cities/barcelona.html": {
    title: "Barcelona Salary Purchasing Power — WhereAmIRich.com",
    description:
      "Barcelona vs Madrid, London, and Lisbon — equivalent salary and spending power from a Barcelona-based monthly paycheck.",
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
  { id: "paris", name: "Paris", path: "/cities/paris.html" },
  { id: "barcelona", name: "Barcelona", path: "/cities/barcelona.html" },
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
  {
    slug: "dubai-vs-bangkok",
    cityAId: "dubai",
    cityBId: "bangkok",
    title: "Dubai vs Bangkok",
    angle:
      "Tax-free Gulf hub vs Southeast Asia value — very different indices, salaries, and lifestyle costs beyond the calculator basket.",
  },
];
