#!/usr/bin/env node
/**
 * DS 파운데이션 준수 검사 — 간격·컬러·radius·shadow·z-index·레이아웃 BP
 *
 *   npm run check:ds
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FORBIDDEN_ABSOLUTE_COLOR_RE,
  FORBIDDEN_FONT_WEIGHT_WITH_TYPO_RE,
  FORBIDDEN_LAYOUT_BREAKPOINT_RE,
  FORBIDDEN_LEGACY_TYPO_RE,
  FORBIDDEN_LUCIDE_IMPORT_RE,
  FORBIDDEN_DS_ICONS_DIRECT_IMPORT_RE,
  FORBIDDEN_PALETTE_COLOR_RE,
  FORBIDDEN_RADIUS_RE,
  FORBIDDEN_SHADOW_RE,
  FORBIDDEN_Z_INDEX_RE,
  FOUNDATION_ARBITRARY_PX_FILES,
  INLINE_SVG_ALLOWLIST_FILES,
  INLINE_SVG_TAG_RE,
  LAYOUT_SHELL_FILES,
  LEGACY_MY_SPACING_RE,
  PALETTE_COLOR_ALLOWLIST_FILES,
  BLOCK_LABEL_CHROMA_CLASS_RE,
  BLOCK_LABEL_COLOR_EXCEPTION_FILES,
  BLOCK_LABEL_COLOR_SOURCE_FILE,
  BLOCK_LABEL_ROLE_FOREGROUND_RE,
  SPACING_OUT_OF_SCALE_RE,
  FORBIDDEN_MOTION_DURATION_RE,
  FORBIDDEN_MOTION_EASING_RE,
  FORBIDDEN_LEGACY_SURFACE_VAR_RE,
  FORBIDDEN_LEGACY_CONTAINER_TEXT_RE,
  FORBIDDEN_ARBITRARY_SCALE_RE,
  FORBIDDEN_ARBITRARY_HEX_CLASS_RE,
  FORBIDDEN_ARBITRARY_SHADOW_RE,
  FORBIDDEN_ARBITRARY_Z_RE,
  FOUNDATION_ARBITRARY_Z_FILES,
  FOUNDATION_MOTION_CSS_FILES,
} from "./lib/design-system-check-rules.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(appRoot, "src");

const SCAN_EXT = new Set([".ts", ".tsx", ".css"]);

/** @type {Array<{ file: string, line: number, rule: string, snippet: string }>} */
const violations = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      files.push(...(await walk(full)));
    } else if (SCAN_EXT.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      files.push(full);
    }
  }
  return files;
}

/**
 * @param {string} rel
 * @param {string} content
 */
function checkFile(rel, content) {
  const lines = content.split("\n");
  const isFoundation = FOUNDATION_ARBITRARY_PX_FILES.has(rel);
  const paletteAllowed = PALETTE_COLOR_ALLOWLIST_FILES.has(rel);
  const isLayoutShell = LAYOUT_SHELL_FILES.has(rel);
  const isBlockLabelConsumer =
    rel === "src/components/editor/ScriptBlock.tsx" ||
    rel === "src/components/editor/EditorBodyReadOnly.tsx";

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) {
      return;
    }

    if (LEGACY_MY_SPACING_RE.test(line)) {
      push(rel, index + 1, "legacy-my-spacing", trimmed);
    }

    if (!paletteAllowed && FORBIDDEN_PALETTE_COLOR_RE.test(line)) {
      push(rel, index + 1, "palette-color", trimmed);
    }

    if (
      !paletteAllowed &&
      rel !== "src/app/globals.css" &&
      FORBIDDEN_ABSOLUTE_COLOR_RE.test(line)
    ) {
      push(rel, index + 1, "absolute-color", trimmed);
    }

    if (FORBIDDEN_LEGACY_TYPO_RE.test(line) && !/\blg:text-(?:body|heading|caption)/.test(line)) {
      push(rel, index + 1, "legacy-typography", trimmed);
    }

    if (FORBIDDEN_FONT_WEIGHT_WITH_TYPO_RE.test(line)) {
      push(rel, index + 1, "typography-weight-duplicate", trimmed);
    }

    if (FORBIDDEN_RADIUS_RE.test(line)) {
      push(rel, index + 1, "radius-arbitrary", trimmed);
    }

    if (FORBIDDEN_SHADOW_RE.test(line)) {
      push(rel, index + 1, "shadow-legacy", trimmed);
    }

    if (FORBIDDEN_Z_INDEX_RE.test(line)) {
      push(rel, index + 1, "z-index-arbitrary", trimmed);
    }

    const usesDsCalcSpacing =
      /calc\(/.test(line) || /env\(/.test(line) || /var\(--(?:space-|app-|editor-)/.test(line);

    if (
      !isFoundation &&
      !usesDsCalcSpacing &&
      /\b(?:p|px|py|pt|pb|m|mx|my|mt|mb|gap|gap-x|gap-y)-\[\d+px\]/.test(line)
    ) {
      push(rel, index + 1, "spacing-arbitrary-px", trimmed);
    }

    if (!isFoundation && !usesDsCalcSpacing && SPACING_OUT_OF_SCALE_RE.test(line)) {
      push(rel, index + 1, "spacing-out-of-scale", trimmed);
    }

    if (isLayoutShell && FORBIDDEN_LAYOUT_BREAKPOINT_RE.test(line)) {
      push(rel, index + 1, "layout-breakpoint-sm-md", trimmed);
    }

    if (rel !== "src/lib/icons.ts" && FORBIDDEN_LUCIDE_IMPORT_RE.test(line)) {
      push(rel, index + 1, "lucide-direct-import", trimmed);
    }

    if (
      rel !== "src/lib/icons.ts" &&
      FORBIDDEN_DS_ICONS_DIRECT_IMPORT_RE.test(line)
    ) {
      push(rel, index + 1, "icons-bypass-lib", trimmed);
    }

    if (
      !INLINE_SVG_ALLOWLIST_FILES.has(rel) &&
      INLINE_SVG_TAG_RE.test(line) &&
      /\.tsx$/.test(rel)
    ) {
      push(rel, index + 1, "inline-svg-icon", trimmed);
    }

    if (
      isBlockLabelConsumer &&
      BLOCK_LABEL_ROLE_FOREGROUND_RE.test(line) &&
      !line.includes("LABEL_COLOR_BY_TYPE")
    ) {
      push(rel, index + 1, "block-label-chroma-bypass", trimmed);
    }

    if (
      rel !== BLOCK_LABEL_COLOR_SOURCE_FILE &&
      !BLOCK_LABEL_COLOR_EXCEPTION_FILES.has(rel) &&
      line.includes("LABEL_COLOR_BY_TYPE") &&
      /export const LABEL_COLOR_BY_TYPE/.test(line)
    ) {
      push(rel, index + 1, "block-label-chroma-duplicate-source", trimmed);
    }

    if (!FOUNDATION_MOTION_CSS_FILES.has(rel) && FORBIDDEN_MOTION_DURATION_RE.test(line)) {
      push(rel, index + 1, "motion-duration", trimmed);
    }

    if (!FOUNDATION_MOTION_CSS_FILES.has(rel) && FORBIDDEN_MOTION_EASING_RE.test(line)) {
      push(rel, index + 1, "motion-easing", trimmed);
    }

    if (FORBIDDEN_LEGACY_SURFACE_VAR_RE.test(line)) {
      push(rel, index + 1, "legacy-surface-var", trimmed);
    }

    if (FORBIDDEN_LEGACY_CONTAINER_TEXT_RE.test(line)) {
      push(rel, index + 1, "legacy-container-text", trimmed);
    }

    if (FORBIDDEN_ARBITRARY_SCALE_RE.test(line)) {
      push(rel, index + 1, "arbitrary-scale", trimmed);
    }

    if (!paletteAllowed && FORBIDDEN_ARBITRARY_HEX_CLASS_RE.test(line)) {
      push(rel, index + 1, "arbitrary-hex-class", trimmed);
    }

    if (FORBIDDEN_ARBITRARY_SHADOW_RE.test(line)) {
      push(rel, index + 1, "arbitrary-shadow", trimmed);
    }

    if (!FOUNDATION_ARBITRARY_Z_FILES.has(rel) && FORBIDDEN_ARBITRARY_Z_RE.test(line)) {
      push(rel, index + 1, "arbitrary-z-index", trimmed);
    }
  });
}

function push(file, line, rule, snippet) {
  violations.push({
    file,
    line,
    rule,
    snippet: snippet.slice(0, 140),
  });
}

async function checkThemeColor() {
  const layoutPath = join(srcRoot, "app/layout.tsx");
  const mobilePath = join(srcRoot, "lib/mobile-viewport.ts");
  const [layoutSrc, mobileSrc] = await Promise.all([
    readFile(layoutPath, "utf8"),
    readFile(mobilePath, "utf8"),
  ]);

  if (layoutSrc.includes("APP_BROWSER_BG_BACKGROUND_20_THEME_COLOR") && !layoutSrc.includes("CANVAS")) {
    push("src/app/layout.tsx", 0, "theme-color-not-canvas", "themeColor must use canvas (#fff / #000)");
  }

  if (
    !mobileSrc.includes("APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT") ||
    !mobileSrc.includes("APP_BROWSER_BG_CANVAS_THEME_COLOR_DARK")
  ) {
    push("src/lib/mobile-viewport.ts", 0, "theme-color-not-canvas", "missing canvas theme color constants");
  }
}

async function main() {
  const files = await walk(srcRoot);
  for (const file of files) {
    const rel = relative(appRoot, file).replace(/\\/g, "/");
    if (rel.startsWith("src/components/example-")) continue;
    const content = await readFile(file, "utf8");
    checkFile(rel, content);
  }

  await checkThemeColor();

  if (violations.length === 0) {
    console.log("check:ds — OK (DS 파운데이션 위반 없음)");
    process.exit(0);
  }

  console.error(`check:ds — ${violations.length}건 위반\n`);
  for (const v of violations) {
    const loc = v.line > 0 ? `${v.file}:${v.line}` : v.file;
    console.error(`  [${v.rule}] ${loc}`);
    console.error(`    ${v.snippet}\n`);
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
