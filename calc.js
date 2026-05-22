import {
  DEFAULT_BASE_CITY_ID,
  DEFAULT_COMPARISON_IDS,
  factorBetween,
  getCityById,
  STATUS_THRESHOLDS,
} from "./data.js";
import {
  formatVsAverage,
  percentVsLocalAverage,
} from "./salary-compare.js";

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
 * @param {string[]} comparisonCityIds
 * @param {string} baseCityId
 */
export function normalizeComparisonIds(comparisonCityIds, baseCityId) {
  const seen = new Set();
  return comparisonCityIds.filter((id) => {
    if (id === baseCityId || seen.has(id) || !getCityById(id)) return false;
    seen.add(id);
    return true;
  });
}

/**
 * @param {string} baseCityId
 */
export function defaultComparisonIds(baseCityId) {
  return normalizeComparisonIds(DEFAULT_COMPARISON_IDS, baseCityId);
}

/** Older saved links used 5–6 cities before the 8-city default */
const LEGACY_DEST_PRESETS = [
  ["hong-kong", "london", "new-york", "paris", "zurich"],
  ["hong-kong", "london", "new-york", "oslo", "paris", "zurich"],
];

function isLegacyDestPreset(ids) {
  const key = [...ids].sort().join(",");
  return LEGACY_DEST_PRESETS.some(
    (preset) => [...preset].sort().join(",") === key
  );
}

/**
 * @param {string[] | null} urlIds from ?dest=
 * @param {string} baseCityId
 */
export function resolveComparisonIds(urlIds, baseCityId) {
  if (!urlIds?.length) {
    return defaultComparisonIds(baseCityId);
  }
  const normalized = normalizeComparisonIds(urlIds, baseCityId);
  if (isLegacyDestPreset(normalized)) {
    return defaultComparisonIds(baseCityId);
  }
  return normalized;
}

/**
 * @param {import("./data.js").City[]} cities
 * @param {number} salary
 * @param {string} baseCityId
 * @param {string[]} comparisonCityIds
 */
export function computeResults(cities, salary, baseCityId, comparisonCityIds) {
  const base = getCityById(baseCityId);
  if (!base) {
    throw new Error(`Unknown base city: ${baseCityId}`);
  }

  const ids = normalizeComparisonIds(comparisonCityIds, baseCityId);
  const comparisonCities = cities.filter(
    (c) => c.id !== baseCityId && ids.includes(c.id)
  );

  const rows = comparisonCities.map((city) => {
    const factor = factorBetween(base.numbeoColIndex, city.numbeoColIndex);
    const equivalent = equivalentSalary(salary, factor);
    const status = classifyStatus(factor);
    const vsAveragePercent = percentVsLocalAverage(salary, base, city);
    const vsAverage = formatVsAverage(vsAveragePercent);
    return {
      ...city,
      factor,
      equivalent,
      status,
      amount: formatMoney(equivalent, base.currencyLabel),
      averageSalaryLabel: formatMoney(
        city.averageMonthlySalary,
        city.currencyLabel
      ),
      vsAveragePercent,
      vsAverageText: vsAverage.text,
      vsAverageTone: vsAverage.tone,
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

  let baseCityId = cityRaw && getCityById(cityRaw) ? cityRaw : null;
  if (baseCityId === "copenhagen") {
    baseCityId = DEFAULT_BASE_CITY_ID;
  }

  const destRaw = params.get("dest") ?? params.get("destinations");
  const comparisonCityIds = destRaw
    ? destRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : null;

  return { salary, baseCityId, comparisonCityIds };
}
