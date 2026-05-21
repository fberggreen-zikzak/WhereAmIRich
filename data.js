/**
 * Cost-of-living indices (Numbeo COL excl. rent). Any city can be the salary baseline.
 *
 * Formula: factor(base → target) = base.numbeoColIndex / target.numbeoColIndex
 * Equivalent in target = salary × factor (same currency units as entered)
 *
 * @see https://www.numbeo.com/cost-of-living/
 */
export const DATA_SOURCE = "Numbeo";
export const DATA_UPDATED = "2025-05";
export const DEFAULT_SALARY = 45000;
export const DEFAULT_BASE_CITY_ID = "copenhagen";

/**
 * @param {number} fromIndex COL index of city where salary is earned
 * @param {number} toIndex COL index of comparison city
 */
export function factorBetween(fromIndex, toIndex) {
  return Math.round((fromIndex / toIndex) * 1000) / 1000;
}

/**
 * @typedef {Object} City
 * @property {string} id
 * @property {string} name
 * @property {string} countryCode
 * @property {number} numbeoColIndex
 * @property {string} currencyCode ISO 4217
 * @property {string} currencyLabel Display suffix (kr., €, $, …)
 */

/** @type {City[]} */
export const CITIES = [
  { id: "copenhagen", name: "Copenhagen", countryCode: "dk", numbeoColIndex: 100.0, currencyCode: "DKK", currencyLabel: "kr." },
  { id: "warsaw", name: "Warsaw", countryCode: "pl", numbeoColIndex: 50.0, currencyCode: "PLN", currencyLabel: "zł" },
  { id: "bangkok", name: "Bangkok", countryCode: "th", numbeoColIndex: 54.0, currencyCode: "THB", currencyLabel: "฿" },
  { id: "lisbon", name: "Lisbon", countryCode: "pt", numbeoColIndex: 55.0, currencyCode: "EUR", currencyLabel: "€" },
  { id: "prague", name: "Prague", countryCode: "cz", numbeoColIndex: 56.0, currencyCode: "CZK", currencyLabel: "Kč" },
  { id: "barcelona", name: "Barcelona", countryCode: "es", numbeoColIndex: 62.0, currencyCode: "EUR", currencyLabel: "€" },
  { id: "berlin", name: "Berlin", countryCode: "de", numbeoColIndex: 70.0, currencyCode: "EUR", currencyLabel: "€" },
  { id: "vienna", name: "Vienna", countryCode: "at", numbeoColIndex: 70.0, currencyCode: "EUR", currencyLabel: "€" },
  { id: "dubai", name: "Dubai", countryCode: "ae", numbeoColIndex: 68.0, currencyCode: "AED", currencyLabel: "AED" },
  { id: "rome", name: "Rome", countryCode: "it", numbeoColIndex: 74.0, currencyCode: "EUR", currencyLabel: "€" },
  { id: "sydney", name: "Sydney", countryCode: "au", numbeoColIndex: 81.0, currencyCode: "AUD", currencyLabel: "A$" },
  { id: "singapore", name: "Singapore", countryCode: "sg", numbeoColIndex: 83.0, currencyCode: "SGD", currencyLabel: "S$" },
  { id: "tokyo", name: "Tokyo", countryCode: "jp", numbeoColIndex: 86.0, currencyCode: "JPY", currencyLabel: "¥" },
  { id: "dublin", name: "Dublin", countryCode: "ie", numbeoColIndex: 88.0, currencyCode: "EUR", currencyLabel: "€" },
  { id: "paris", name: "Paris", countryCode: "fr", numbeoColIndex: 92.0, currencyCode: "EUR", currencyLabel: "€" },
  { id: "stockholm", name: "Stockholm", countryCode: "se", numbeoColIndex: 67.7, currencyCode: "SEK", currencyLabel: "kr" },
  { id: "amsterdam", name: "Amsterdam", countryCode: "nl", numbeoColIndex: 68.0, currencyCode: "EUR", currencyLabel: "€" },
  { id: "hong-kong", name: "Hong Kong", countryCode: "hk", numbeoColIndex: 115.0, currencyCode: "HKD", currencyLabel: "HK$" },
  { id: "zurich", name: "Zurich", countryCode: "ch", numbeoColIndex: 125.0, currencyCode: "CHF", currencyLabel: "CHF" },
  { id: "new-york", name: "New York", countryCode: "us", numbeoColIndex: 145.0, currencyCode: "USD", currencyLabel: "$" },
  { id: "london", name: "London", countryCode: "gb", numbeoColIndex: 155.8, currencyCode: "GBP", currencyLabel: "£" },
];

/**
 * @param {string} id
 * @returns {City | undefined}
 */
export function getCityById(id) {
  return CITIES.find((c) => c.id === id);
}

/** Cities sorted for UI: default base first, then A–Z */
export function citiesForSelect() {
  const sorted = [...CITIES].sort((a, b) => a.name.localeCompare(b.name));
  const baseIdx = sorted.findIndex((c) => c.id === DEFAULT_BASE_CITY_ID);
  if (baseIdx > 0) {
    const [base] = sorted.splice(baseIdx, 1);
    sorted.unshift(base);
  }
  return sorted;
}

export const STATUS_LABELS = {
  rich: "Rich",
  middle: "Middle",
  poor: "Poor",
};

export const STATUS_CONTEXT = {
  rich: "Further than local average",
  middle: "Around local average",
  poor: "Below local average",
};

export const METRIC_LABEL = "Equivalent salary";

export function metricHint(currencyLabel) {
  return `Monthly pay with similar buying power there, in ${currencyLabel} (your currency).`;
}

export const HERO_TRUST_LINE =
  "Based on how far your salary goes after local living costs — relative spending power, not money in your bank abroad.";

export const STATUS_THRESHOLDS = {
  richMin: 1.55,
  poorMax: 0.75,
};
