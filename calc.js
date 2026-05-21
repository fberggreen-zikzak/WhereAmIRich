import {
  factorBetween,
  getCityById,
  STATUS_THRESHOLDS,
} from "./data.js";

/**
 * @param {number} salary
 * @param {number} factor base → target
 */
export function equivalentSalary(salary, factor) {
  return Math.round(salary * factor);
}

/**
 * @param {number} factor
 * @returns {"rich" | "middle" | "poor"}
 */
export function classifyStatus(factor) {
  if (factor >= STATUS_THRESHOLDS.richMin) return "rich";
  if (factor <= STATUS_THRESHOLDS.poorMax) return "poor";
  return "middle";
}

/**
 * @param {number} amount
 * @param {string} currencyLabel
 */
const CURRENCY_PREFIX = new Set(["$", "£", "€", "¥", "฿", "zł", "S$", "A$", "HK$"]);

export function formatMoney(amount, currencyLabel) {
  const formatted = amount.toLocaleString("en-US");
  if (CURRENCY_PREFIX.has(currencyLabel)) {
    return `${currencyLabel}${formatted}`;
  }
  return `${formatted} ${currencyLabel}`;
}

/**
 * @param {import("./data.js").City[]} cities
 * @param {number} salary
 * @param {string} baseCityId
 */
export function computeResults(cities, salary, baseCityId) {
  const base = getCityById(baseCityId);
  if (!base) {
    throw new Error(`Unknown base city: ${baseCityId}`);
  }

  const comparisonCities = cities.filter((c) => c.id !== baseCityId);

  const rows = comparisonCities.map((city) => {
    const factor = factorBetween(base.numbeoColIndex, city.numbeoColIndex);
    const equivalent = equivalentSalary(salary, factor);
    const status = classifyStatus(factor);
    return {
      ...city,
      factor,
      equivalent,
      status,
      amount: formatMoney(equivalent, base.currencyLabel),
    };
  });

  const maxEquivalent = Math.max(...rows.map((r) => r.equivalent), 1);

  const withProgress = rows.map((row) => ({
    ...row,
    progress: Math.round((row.equivalent / maxEquivalent) * 100),
  }));

  const sorted = [...withProgress].sort((a, b) => b.equivalent - a.equivalent);

  const betterOffCount = withProgress.filter((r) => r.factor > 1).length;

  return {
    base,
    cities: withProgress,
    richest: sorted[0],
    poorest: sorted[sorted.length - 1],
    betterOffCount,
    totalCities: withProgress.length,
  };
}

/**
 * @param {string} raw
 */
export function parseSalaryInput(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return null;
  const value = parseInt(digits, 10);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.min(value, 999_999);
}

/**
 * @param {URLSearchParams} params
 */
export function stateFromUrl(params) {
  const salaryRaw = params.get("salary");
  const cityRaw = params.get("city") ?? params.get("base");

  let salary = null;
  if (salaryRaw) {
    const n = parseInt(salaryRaw, 10);
    if (Number.isFinite(n) && n > 0) salary = Math.min(n, 999_999);
  }

  const baseCityId =
    cityRaw && getCityById(cityRaw) ? cityRaw : null;

  return { salary, baseCityId };
}
