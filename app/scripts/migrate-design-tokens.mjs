#!/usr/bin/env node
/**
 * Tailwind 레거시 클래스 → 디자인 토큰 자동 치환.
 * 규칙: scripts/lib/token-migrate-rules.mjs (= docs/design-system.md Part 1 §3)
 *
 * 사용 (app/ 디렉터리):
 *   npm run migrate:tokens              # dry-run (기본)
 *   npm run migrate:tokens -- --write   # 파일 반영
 *   npm run migrate:tokens -- --axis=spacing,shadow,height
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONTROL_SIZE_OVERRIDES,
  SHADOW_REPLACEMENTS,
  SPACING_UTILITY_PREFIXES,
  SURFACE_RADIUS_REPLACEMENTS,
  TAILWIND_N_TO_MY_SUFFIX,
  inferTypoTokenForClassList,
  mySuffixFromPx,
  snapPxToMyToken,
} from "./lib/token-migrate-rules.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(appRoot, "src");

const args = process.argv.slice(2);
const write = args.includes("--write");
const axisArg = args.find((a) => a.startsWith("--axis="));
const axes = axisArg
  ? axisArg.replace("--axis=", "").split(",").map((s) => s.trim())
  : ["height", "spacing", "shadow", "radius", "typography"];

const VARIANT_PREFIX = "(?:[a-z][\\w-]*:)*";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {string} content
 * @param {Record<string, string>} map
 */
function replaceLiteralMap(content, map) {
  let out = content;
  for (const [from, to] of Object.entries(map)) {
    const re = new RegExp(`(${VARIANT_PREFIX})\\b${escapeRe(from)}\\b`, "g");
    out = out.replace(re, `$1${to}`);
  }
  return out;
}

/**
 * @param {string} content
 */
function applySpacing(content) {
  let out = content;
  const nKeys = Object.keys(TAILWIND_N_TO_MY_SUFFIX).sort(
    (a, b) => b.length - a.length,
  );

  for (const prefix of SPACING_UTILITY_PREFIXES) {
    for (const n of nKeys) {
      const suffix = TAILWIND_N_TO_MY_SUFFIX[n];
      const re = new RegExp(
        `(${VARIANT_PREFIX})\\b${escapeRe(prefix)}-${escapeRe(n)}\\b`,
        "g",
      );
      out = out.replace(re, `$1${prefix}-${suffix}`);
    }

    const bracketRe = new RegExp(
      `(${VARIANT_PREFIX})\\b${escapeRe(prefix)}-\\[(\\d+)px\\]\\b`,
      "g",
    );
    out = out.replace(bracketRe, (_m, variants, pxStr) => {
      const px = Number(pxStr);
      const snapped = snapPxToMyToken(px);
      if (snapped == null) return _m;
      return `${variants}${prefix}-${mySuffixFromPx(snapped)}`;
    });
  }

  return out;
}

/**
 * className·cn·cva 문자열 내부 class list에 타이포 infer 적용
 * @param {string} content
 */
function applyTypography(content) {
  return content.replace(
    /(className\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)|cn\(([^)]*)\))/g,
    (match, _g0, d1, d2, d3, cnInner) => {
      const inner = d1 ?? d2 ?? d3 ?? cnInner;
      if (!inner || !/\btext-(xs|sm|base|lg|xl|2xl|3xl|\[\d+px\])\b/.test(inner)) {
        return match;
      }

      const transformed = inner
        .split(/("[^"]*"|'[^']*'|`[^`]*`)/)
        .map((chunk) => {
          if (/^["'`]/.test(chunk)) {
            const quote = chunk[0];
            const body = chunk.slice(1, -1);
            if (!/\btext-(xs|sm|base|lg|xl|2xl|3xl|\[\d+px\])\b/.test(body)) {
              return chunk;
            }
            return `${quote}${inferTypoTokenForClassList(body)}${quote}`;
          }
          return chunk;
        })
        .join("");

      return match.replace(inner, transformed);
    },
  );
}

/**
 * @param {string} content
 */
function migrateContent(content) {
  let out = content;
  if (axes.includes("height")) {
    out = replaceLiteralMap(out, CONTROL_SIZE_OVERRIDES);
  }
  if (axes.includes("spacing")) {
    out = applySpacing(out);
  }
  if (axes.includes("shadow")) {
    out = replaceLiteralMap(out, SHADOW_REPLACEMENTS);
  }
  if (axes.includes("radius")) {
    out = replaceLiteralMap(out, SURFACE_RADIUS_REPLACEMENTS);
  }
  if (axes.includes("typography")) {
    out = applyTypography(out);
  }
  return out;
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function walkTsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      files.push(...(await walkTsFiles(full)));
    } else if (/\.(tsx?|ts)$/.test(ent.name)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const files = await walkTsFiles(srcRoot);
  let changedFiles = 0;
  let totalReplacements = 0;

  for (const file of files) {
    const before = await readFile(file, "utf8");
    const after = migrateContent(before);
    if (before !== after) {
      changedFiles += 1;
      const rel = relative(appRoot, file);
      if (write) {
        await writeFile(file, after, "utf8");
        console.log(`write  ${rel}`);
      } else {
        console.log(`would  ${rel}`);
      }
      totalReplacements += 1;
    }
  }

  const mode = write ? "적용" : "dry-run";
  console.log(
    `\n[migrate:tokens] ${mode} · 축: ${axes.join(", ")} · 변경 파일: ${changedFiles}`,
  );
  if (!write && changedFiles > 0) {
    console.log("반영하려면: npm run migrate:tokens -- --write");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
