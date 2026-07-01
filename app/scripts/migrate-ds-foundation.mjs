#!/usr/bin/env node
/**
 * DS 파운데이션 자동 치환 — radius·팔레트·z-index·theme-color 상수
 *
 *   npm run migrate:ds-foundation           # dry-run
 *   npm run migrate:ds-foundation -- --write
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { RADIUS_REPLACEMENTS, LEGACY_CONTAINER_TEXT_REPLACEMENTS, LEGACY_SURFACE_UTILITY_REPLACEMENTS } from "./lib/design-system-check-rules.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(appRoot, "src");
const write = process.argv.includes("--write");

const VARIANT_PREFIX = "(?:[a-z][\\w-]*:)*";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const CLASS_COLOR_RENAMES = [
  ["hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600", "hover:border-destructive/30 hover:bg-destructive-container hover:text-destructive"],
  ["hover:border-rose-200 hover:bg-destructive-container hover:text-destructive", "hover:border-destructive/30 hover:bg-destructive-container hover:text-destructive"],
  ["border-rose-300 bg-destructive-container text-rose-900", "border-destructive/40 bg-destructive-container text-destructive"],
  ["text-rose-700", "text-destructive"],
  ["text-rose-900", "text-destructive"],
  ["text-blue-600", "text-info"],
  ["text-blue-500", "text-info"],
  ["text-blue-700", "text-info"],
  ["bg-blue-100 text-blue-700", "bg-info/15 text-info"],
  ["bg-green-100 text-green-700", "bg-success/15 text-success"],
  ["focus:ring-slate-400/30", "focus:ring-ring/30"],
  ["focus-within:ring-slate-400/30", "focus-within:ring-ring/30"],
  ["bg-slate-900/50", "bg-inverse/50"],
  ["from-slate-800 to-slate-900", "from-inverse to-inverse"],
  ["outline-slate-800", "outline-inverse"],
  ["text-amber-300/95", "text-warning-foreground/95"],
];

const MOTION_RENAMES = [
  ["duration-150", "duration-short"],
  ["duration-200", "duration-short"],
  ["duration-300", "duration-medium"],
  ["ease-out", "ease-standard"],
  ["ease-in-out", "ease-standard"],
];

const Z_INDEX_RENAMES = [
  ["z-50", "z-sticky"],
  ["z-40", "z-modal"],
  ["z-30", "z-overlay"],
  ["z-20", "z-sticky"],
  ["z-10", "z-dropdown"],
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      files.push(...(await walk(full)));
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * @param {string} content
 */
function transform(content) {
  let out = content;

  for (const [from, to] of Object.entries(RADIUS_REPLACEMENTS)) {
    const re = new RegExp(`(${VARIANT_PREFIX})${escapeRe(from)}`, "g");
    out = out.replace(re, `$1${to}`);
  }

  for (const [from, to] of CLASS_COLOR_RENAMES) {
    const re = new RegExp(`(${VARIANT_PREFIX})${escapeRe(from)}`, "g");
    out = out.replace(re, `$1${to}`);
  }

  for (const [from, to] of Object.entries(LEGACY_CONTAINER_TEXT_REPLACEMENTS)) {
    const re = new RegExp(`(${VARIANT_PREFIX})${escapeRe(from)}`, "g");
    out = out.replace(re, `$1${to}`);
  }

  for (const [from, to] of Object.entries(LEGACY_SURFACE_UTILITY_REPLACEMENTS)) {
    const re = new RegExp(`(${VARIANT_PREFIX})${escapeRe(from)}`, "g");
    out = out.replace(re, `$1${to}`);
  }

  for (const [from, to] of MOTION_RENAMES) {
    const re = new RegExp(`(${VARIANT_PREFIX})${escapeRe(from)}`, "g");
    out = out.replace(re, `$1${to}`);
  }

  for (const [from, to] of Z_INDEX_RENAMES) {
    const re = new RegExp(`(${VARIANT_PREFIX})\\b${escapeRe(from)}\\b`, "g");
    out = out.replace(re, `$1${to}`);
  }

  return out;
}

async function main() {
  const files = await walk(srcRoot);
  let changed = 0;

  for (const file of files) {
    const rel = relative(appRoot, file);
    const before = await readFile(file, "utf8");
    const after = transform(before);
    if (after !== before) {
      changed += 1;
      console.log(write ? "write" : "would change", rel);
      if (write) await writeFile(file, after, "utf8");
    }
  }

  // mobile-viewport theme colors
  const mobilePath = join(srcRoot, "lib/mobile-viewport.ts");
  let mobile = await readFile(mobilePath, "utf8");
  const mobileNext = mobile
    .replace(
      /export const APP_BROWSER_BG_BACKGROUND_20_THEME_COLOR = "[^"]+";/,
      `export const APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT = "#ffffff";\nexport const APP_BROWSER_BG_CANVAS_THEME_COLOR_DARK = "#000000";`,
    )
    .replace(
      "spacing-my-16",
      "spacing-4",
    );
  if (mobileNext !== mobile) {
    changed += 1;
    console.log(write ? "write" : "would change", "src/lib/mobile-viewport.ts");
    if (write) await writeFile(mobilePath, mobileNext, "utf8");
    mobile = mobileNext;
  }

  const layoutPath = join(srcRoot, "app/layout.tsx");
  let layout = await readFile(layoutPath, "utf8");
  const layoutNext = layout
    .replace(
      "APP_BROWSER_BG_BACKGROUND_20_THEME_COLOR",
      "APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT",
    );
  if (layoutNext !== layout) {
    changed += 1;
    console.log(write ? "write" : "would change", "src/app/layout.tsx");
    if (write) await writeFile(layoutPath, layoutNext, "utf8");
  }

  console.log(`\n${write ? "Updated" : "Dry-run:"} ${changed} file(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
