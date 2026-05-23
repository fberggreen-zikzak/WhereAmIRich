/**
 * Cost-of-living data — any city can be the salary baseline.
 *
 * Formula: factor(base → target) = base.numbeoColIndex / target.numbeoColIndex
 * Equivalent in target = salary × factor (same currency units as entered)
 *
 * @see https://www.numbeo.com/cost-of-living/
 */
import { CITY_CATALOG } from "./cities-catalog.js";
import { AVERAGE_MONTHLY_SALARY } from "./city-salaries.js";

export const DATA_SOURCE = "Numbeo";
export const DATA_UPDATED = "2026-05";
export const DEFAULT_SALARY = 6200;
export const DEFAULT_BASE_CITY_ID = "new-york";

/** Default board: 9 presets → 8 destinations after the home city is excluded */
export const DEFAULT_COMPARISON_IDS = [
  "london",
  "paris",
  "new-york",
  "barcelona",
  "amsterdam",
  "dubai",
  "singapore",
  "bangkok",
  "lisbon",
];

/**
 * @typedef {Object} City
 * @property {string} id
 * @property {string} name
 * @property {string} country
 * @property {string} countryCode
 * @property {number} numbeoColIndex
 * @property {string} currencyCode
 * @property {string} currencyLabel
 * @property {number} averageMonthlySalary Gross monthly, local currency
 */

/** @type {City[]} */
export const CITIES = dedupeCities(CITY_CATALOG);

function dedupeCities(catalog) {
  const byId = new Map();
  for (const city of catalog) {
    if (!byId.has(city.id)) {
      byId.set(city.id, {
        ...city,
        averageMonthlySalary: AVERAGE_MONTHLY_SALARY[city.id] ?? 0,
      });
    }
  }
  return [...byId.values()];
}

/**
 * @param {number} fromIndex
 * @param {number} toIndex
 */
export function factorBetween(fromIndex, toIndex) {
  return Math.round((fromIndex / toIndex) * 1000) / 1000;
}

/**
 * @param {string} id
 * @returns {City | undefined}
 */
export function getCityById(id) {
  return CITIES.find((c) => c.id === id);
}

/**
 * @param {City[]} cities
 * @param {string} query
 */
export function searchCities(cities, query) {
  const q = query.trim().toLowerCase();
  if (!q) return cities;
  return cities.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.id.replace(/-/g, " ").includes(q)
  );
}

export function citiesForSelect() {
  const sorted = [...CITIES].sort((a, b) => a.name.localeCompare(b.name));
  const baseIdx = sorted.findIndex((c) => c.id === DEFAULT_BASE_CITY_ID);
  if (baseIdx > 0) {
    const [base] = sorted.splice(baseIdx, 1);
    sorted.unshift(base);
  }
  return sorted;
}

/** Vs user's home / "Based in" city only */
export const STATUS_LABELS = {
  better: "Better than home",
  similar: "Similar to home",
  worse: "Worse than home",
};

export const AMOUNT_SUBLABEL = "Spending power equivalent";
export const LOCAL_AVERAGE_LABEL = "Local average";

export const STATUS_THRESHOLDS = {
  richMin: 1.55,
  poorMax: 0.75,
};
