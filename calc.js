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
 * Spending power vs home city (COL-adjusted).
 * @param {number} factor
 * @returns {"better" | "similar" | "worse"}
 */
export function classifyStatus(factor) {
  if (factor >= STATUS_THRESHOLDS.richMin) return "better";
  if (factor <= STATUS_THRESHOLDS.poorMax) return "worse";
  return "similar";
}

/** Within ~3% of home — used for ranking copy, tighter than card badges */
const VS_HOME_SIMILAR_BAND = 0.03;

/**
 * Human-readable spending power vs home (ranking section).
 * @param {number} factor
 */
export function formatVsHomeComparison(factor) {
  const pct = Math.round((factor - 1) * 100);
  if (Math.abs(pct) <= 3) return "About the same as home";
  if (pct > 0) return `${pct}% easier than home`;
  return `${Math.abs(pct)}% tougher than home`;
}

/**
 * @param {number} factor
 * @returns {{ status: "better" | "similar" | "worse", label: string }}
 */
export function vsHomeBadge(factor) {
  const pct = (factor - 1) * 100;
  if (Math.abs(pct) <= 3) {
    return { status: "similar", label: "About the same" };
  }
  if (pct > 0) {
    return { status: "better", label: "Easier than home" };
  }
  return { status: "worse", label: "Tougher than home" };
}

/**
 * @param {{ factor: number }} city
 * @param {number} index
 * @param {{ name: string }[]} ranked
 * @param {{ name: string }} base
 */
export function rankingRowInsight(city, index, ranked, base) {
  if (index === 0) return "Least value in this set";
  if (Math.abs(city.factor - 1) <= VS_HOME_SIMILAR_BAND) {
    return `Close to ${base.name}`;
  }
  if (index <= 2 && city.factor < 0.9) {
    return "Among the hardest for this salary";
  }
  if (index === 1 && ranked[0]) {
    const gapPct = Math.round(
      ((ranked[0].equivalent - city.equivalent) / city.equivalent) * 100
    );
    if (gapPct <= 2) {
      return `Nearly as tough as ${ranked[0].name}`;
    }
  }
  return "";
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
 * Cities where salary buys the least vs home (lowest equivalent pay first).
 * @param {import("./data.js").City[]} cities
 * @param {number} salary
 * @param {string} baseCityId
 * @param {number} [limit]
 */
export function computeMostExpensiveCities(cities, salary, baseCityId, limit = 20) {
  const base = getCityById(baseCityId);
  if (!base) return { base: null, cities: [], toughest: null, easiest: null };

  const allRows = cities
    .filter((c) => c.id !== baseCityId)
    .map((city) => {
      const factor = factorBetween(base.numbeoColIndex, city.numbeoColIndex);
      const equivalent = equivalentSalary(salary, factor);
      return {
        id: city.id,
        name: city.name,
        countryCode: city.countryCode,
        factor,
        equivalent,
      };
    })
    .sort((a, b) => a.equivalent - b.equivalent);

  const topRows = allRows.slice(0, limit).map((city, index, ranked) => {
    const badge = vsHomeBadge(city.factor);
    return {
      ...city,
      amount: formatMoney(city.equivalent, base.currencyLabel),
      vsHomeText: formatVsHomeComparison(city.factor),
      badgeStatus: badge.status,
      badgeLabel: badge.label,
      insight: rankingRowInsight(city, index, ranked, base),
    };
  });

  return {
    base,
    cities: topRows,
    toughest: topRows[0] ?? null,
    easiest: allRows[allRows.length - 1] ?? null,
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
