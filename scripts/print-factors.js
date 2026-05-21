/**
 * Print purchasing-power factors between cities.
 *
 * Usage:
 *   node scripts/print-factors.js
 *   node scripts/print-factors.js --from copenhagen --to london
 *   node scripts/print-factors.js 72.5 155.8
 */
import {
  CITIES,
  factorBetween,
  getCityById,
  DATA_UPDATED,
  DATA_SOURCE,
} from "../data.js";

const args = process.argv.slice(2);

if (args[0] === "--from" && args[2] === "--to") {
  const from = getCityById(args[1]);
  const to = getCityById(args[3]);
  if (!from || !to) {
    console.error("Unknown city id");
    process.exit(1);
  }
  const factor = factorBetween(from.numbeoColIndex, to.numbeoColIndex);
  console.log(`${from.name} → ${to.name}: factor ${factor}`);
  process.exit(0);
}

if (args.length === 2) {
  const fromIdx = parseFloat(args[0]);
  const toIdx = parseFloat(args[1]);
  console.log(factorBetween(fromIdx, toIdx));
  process.exit(0);
}

const baseId = args[0] && getCityById(args[0]) ? args[0] : "copenhagen";
const base = getCityById(baseId);

console.log(`# ${DATA_SOURCE} factors from ${base.name} (${DATA_UPDATED})\n`);
console.log("city                  | COL index | factor from base");
console.log("----------------------|-----------|------------------");

for (const city of CITIES) {
  if (city.id === base.id) continue;
  const factor = factorBetween(base.numbeoColIndex, city.numbeoColIndex);
  console.log(
    `${city.name.padEnd(21)} | ${String(city.numbeoColIndex).padStart(9)} | ${String(factor).padStart(16)}`
  );
}

console.log("\nAdd cities in data.js with numbeoColIndex + currencyLabel.");
