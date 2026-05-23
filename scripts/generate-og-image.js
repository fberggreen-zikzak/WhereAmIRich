/**
 * Rasterize og-image.svg → og-image.png (1200×630) for social previews.
 * Requires `resvg` on PATH (https://github.com/linebender/resvg/releases).
 * Usage: node scripts/generate-og-image.js
 */
import { execFileSync } from "child_process";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const ROOT = path.join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SVG = path.join(ROOT, "og-image.svg");
const PNG = path.join(ROOT, "og-image.png");

/** @returns {string} */
function findResvg() {
  const fromEnv = process.env.RESVG;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  for (const bin of ["resvg", "/tmp/resvg"]) {
    try {
      execFileSync(bin, ["--version"], { stdio: "ignore" });
      return bin;
    } catch {
      /* try next */
    }
  }
  if (existsSync(PNG)) {
    console.warn("resvg not found; keeping existing og-image.png");
    process.exit(0);
  }
  throw new Error(
    "resvg not found. Install from https://github.com/linebender/resvg/releases " +
      "or set RESVG=/path/to/resvg"
  );
}

const resvg = findResvg();
execFileSync(resvg, ["-w", "1200", "-h", "630", SVG, PNG], { stdio: "inherit" });
console.log(`Wrote ${PNG}`);
