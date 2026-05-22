/**
 * Compare user purchasing power vs local average earner (COL-adjusted).
 */

/** Local currency units → USD (approx. May 2025) */
const USD_PER_UNIT = {
  DKK: 0.145,
  EUR: 1.08,
  GBP: 1.27,
  USD: 1,
  CHF: 1.12,
  NOK: 0.094,
  SEK: 0.094,
  PLN: 0.25,
  CZK: 0.043,
  HUF: 0.0027,
  RON: 0.22,
  BGN: 0.56,
  TRY: 0.031,
  UAH: 0.024,
  RSD: 0.0093,
  ISK: 0.0072,
  CAD: 0.73,
  MXN: 0.058,
  BRL: 0.2,
  ARS: 0.0011,
  CLP: 0.0011,
  PEN: 0.27,
  COP: 0.00024,
  HKD: 0.128,
  SGD: 0.74,
  JPY: 0.0066,
  KRW: 0.00073,
  TWD: 0.031,
  CNY: 0.14,
  INR: 0.012,
  THB: 0.028,
  MYR: 0.22,
  IDR: 0.000063,
  PHP: 0.018,
  VND: 0.000039,
  AUD: 0.66,
  NZD: 0.61,
  AED: 0.27,
  QAR: 0.27,
  SAR: 0.27,
  ILS: 0.27,
  EGP: 0.021,
  MAD: 0.1,
  ZAR: 0.055,
  KES: 0.0077,
  NGN: 0.00065,
  BAM: 0.56,
  MKD: 0.018,
  UYU: 0.025,
  CRC: 0.0019,
  DOP: 0.017,
  PKR: 0.0036,
  LKR: 0.0033,
  NPR: 0.0075,
  BDT: 0.0091,
  MMK: 0.00048,
  KHR: 0.00024,
  KWD: 3.25,
  BHD: 2.65,
  OMR: 2.6,
  JOD: 1.41,
  GHS: 0.084,
  ETB: 0.0175,
  TND: 0.32,
  XOF: 0.0017,
};

/**
 * @param {number} amount
 * @param {string} currencyCode
 */
export function toUsd(amount, currencyCode) {
  const rate = USD_PER_UNIT[currencyCode];
  if (!rate) return amount;
  return amount * rate;
}

/**
 * Purchasing power per COL point (higher = stronger).
 * @param {number} salary
 * @param {string} currencyCode
 * @param {number} colIndex
 */
export function purchasingPowerPerCol(salary, currencyCode, colIndex) {
  return toUsd(salary, currencyCode) / colIndex;
}

/**
 * % above (+) or below (−) local average earner (same lifestyle buying power).
 * @param {number} userSalary
 * @param {import("./data.js").City} base
 * @param {import("./data.js").City} city
 */
export function percentVsLocalAverage(userSalary, base, city) {
  if (!city.averageMonthlySalary || !base.averageMonthlySalary) return 0;

  const userPpc = purchasingPowerPerCol(
    userSalary,
    base.currencyCode,
    base.numbeoColIndex
  );
  const avgPpc = purchasingPowerPerCol(
    city.averageMonthlySalary,
    city.currencyCode,
    city.numbeoColIndex
  );
  if (!avgPpc) return 0;

  return Math.round((userPpc / avgPpc - 1) * 100);
}

/**
 * @param {number} percent
 */
export function formatVsAverage(percent) {
  if (percent > 0) {
    return { text: `+${percent}% vs local average`, tone: "above" };
  }
  if (percent < 0) {
    return { text: `−${Math.abs(percent)}% vs local average`, tone: "below" };
  }
  return { text: "At local average", tone: "neutral" };
}
