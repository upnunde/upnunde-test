#!/usr/bin/env node
/**
 * Phase A0.5 + A0.8 일괄 마이그레이션 — 리노벨 자체 토큰·별칭을 DS 토큰으로 일괄 치환.
 *
 * 1. my-* spacing → DS space-* (21개 매핑, 32개 prefix)
 * 2. 별칭 className → DS className (40개+ 매핑)
 *
 * 사용:
 *   node scripts/migrate-rinovel-tokens.mjs           # dry-run
 *   node scripts/migrate-rinovel-tokens.mjs --write   # 적용
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(appRoot, "src");
const write = process.argv.includes("--write");

// ────────────────────────────────────────────────────────────────────────────
// A0.5 — my-* → DS space-*
// ────────────────────────────────────────────────────────────────────────────

const MY_TO_SPACE = {
  "1": "px",   "2": "0.5",  "4": "1",   "8": "2",
  "12": "3",   "16": "4",   "20": "5",  "24": "6",
  "28": "7",   "32": "8",   "36": "9",  "40": "10",
  "44": "11",  "48": "12",  "52": "13", "56": "14",
  "60": "15",  "64": "16",  "68": "17", "72": "18",
  "80": "20",
};

const SPACING_PREFIXES = [
  // padding
  "p", "px", "py", "pt", "pb", "pl", "pr", "ps", "pe",
  // margin
  "m", "mx", "my", "mt", "mb", "ml", "mr", "ms", "me",
  // scroll padding/margin
  "scroll-p", "scroll-px", "scroll-py", "scroll-pt", "scroll-pb", "scroll-pl", "scroll-pr",
  "scroll-m", "scroll-mx", "scroll-my", "scroll-mt", "scroll-mb", "scroll-ml", "scroll-mr",
  // gap
  "gap", "gap-x", "gap-y",
  // space (between)
  "space-x", "space-y",
  // size
  "h", "w", "size", "min-h", "min-w", "max-h", "max-w",
  // position
  "inset", "inset-x", "inset-y", "top", "bottom", "left", "right",
  // transform
  "translate-x", "translate-y",
];

// 음수 변형 — Tailwind는 -mx-my-20 같은 음수 spacing을 허용
const NEGATIVE_SPACING_PREFIXES = SPACING_PREFIXES.flatMap((p) => [`-${p}`]);

// ────────────────────────────────────────────────────────────────────────────
// A0.8 — 별칭 className → DS 정식 className
// 긴 토큰부터 매칭되도록 정렬 (예: bg-surface-disabled-20이 bg-surface-disabled보다 먼저)
// ────────────────────────────────────────────────────────────────────────────

/** @type {Array<[string, string]>} */
const CLASS_RENAMES = [
  // surface (긴 것부터)
  ["bg-surface-disabled-20", "bg-disabled"],
  ["bg-surface-disabled-10", "bg-disabled"],
  ["bg-surface-inverse-10", "bg-inverse"],
  ["bg-surface-inverse-20", "bg-inverse"],
  ["bg-surface-disabled", "bg-disabled"],
  ["bg-surface-10", "bg-background"],
  ["bg-surface-20", "bg-muted"],
  ["bg-surface-30", "bg-muted"],
  ["bg-surface-5", "bg-background"],
  ["text-surface-10", "text-background"],
  ["bg-on-surface-10", "bg-foreground"],
  // on-surface
  ["text-on-surface-disabled", "text-foreground-disabled"],
  ["text-on-surface-inverse", "text-inverse-foreground"],
  ["text-on-surface-10", "text-foreground"],
  ["text-on-surface-20", "text-foreground-muted"],
  ["text-on-surface-30", "text-foreground-placeholder"],
  ["text-on-surface-03", "text-foreground-placeholder"],
  // border (10/20 솔리드 통합 · 30은 disabled-border)
  ["border-border-strong", "border-border-strong"], // 이름 동일 — no-op
  ["border-border-10", "border-border"],
  ["border-border-20", "border-border"],
  ["border-border-30", "border-disabled-border"],
  ["ring-border-10", "ring-border"],
  ["ring-border-20", "ring-border"],
  ["bg-border-10", "bg-border"],
  ["bg-border-20", "bg-border"],
  ["text-border-20", "text-border"],
  // divider
  ["border-divider-10", "border-divider"],
  ["border-divider-20", "border-divider-strong"],
  ["bg-divider-10", "bg-divider"],
  ["bg-divider-20", "bg-divider-strong"],
  // Material container Figma 별칭
  ["bg-primary-primary-container", "bg-primary-container"],
  ["text-primary-on-primary-container", "text-on-primary-container"],
  ["bg-secondary-secondary-container", "bg-secondary-container"],
  ["text-secondary-on-secondary-container", "text-on-secondary-container"],
  ["bg-secondary-secondary", "bg-secondary"],
  ["text-secondary-on-secondary", "text-secondary-foreground"],
  // error → destructive
  ["bg-error-error-container", "bg-destructive-container"],
  ["text-error-on-error-container", "text-on-destructive-container"],
  ["bg-error-error", "bg-destructive"],
  ["text-error-error", "text-destructive"],
  ["border-error-error", "border-destructive"],
  ["ring-error-error", "ring-destructive"],
  ["text-error-on-error", "text-destructive-foreground"],
  // background-10/20 별칭
  ["bg-background-20", "bg-muted"],
  ["bg-background-10", "bg-background"],
  // on-secondary 단독
  ["text-on-secondary", "text-secondary-foreground"],
];

// ────────────────────────────────────────────────────────────────────────────

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMyPattern() {
  const allPrefixes = [...SPACING_PREFIXES, ...NEGATIVE_SPACING_PREFIXES];
  // 긴 prefix 우선 (예: scroll-px가 px보다 먼저)
  allPrefixes.sort((a, b) => b.length - a.length);
  const prefixAlt = allPrefixes.map(escapeRe).join("|");
  const numAlt = Object.keys(MY_TO_SPACE).sort((a, b) => b.length - a.length).join("|");
  // 좌측 boundary: 단어/하이픈/-가 아닌 문자. 음수 prefix의 - 자체는 패턴 안에 포함됨
  return new RegExp(
    `((?:[a-z][\\w-]*:)*)(${prefixAlt})-my-(${numAlt})(?![\\w-])`,
    "g",
  );
}

const MY_PATTERN = buildMyPattern();

// CSS 변수 직접 참조: var(--spacing-my-N) → var(--spacing-{dsSuffix})
const SPACING_VAR_PATTERN = (() => {
  const numAlt = Object.keys(MY_TO_SPACE).sort((a, b) => b.length - a.length).join("|");
  return new RegExp(`--spacing-my-(${numAlt})\\b`, "g");
})();

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  /** @type {string[]} */
  const out = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (/\.(tsx?|jsx?|mjs|cjs|css|mdx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function transformContent(content) {
  let changes = 0;
  let next = content;

  // 1a. my-* className → space-*
  next = next.replace(MY_PATTERN, (match, variants, prefix, n) => {
    // 좌측 경계 보호 — match 직전 문자가 [\w-]면 매치 거부 (e.g. `xmy-*` 같은 false-positive 방지)
    // lookbehind 못 쓰는 환경 대비. 실제 v8에는 있지만 안전하게 후처리.
    changes++;
    const dsSuffix = MY_TO_SPACE[n];
    return `${variants}${prefix}-${dsSuffix}`;
  });

  // 1b. CSS var(--spacing-my-N) → var(--spacing-{dsSuffix})
  next = next.replace(SPACING_VAR_PATTERN, (_, n) => {
    changes++;
    const dsSuffix = MY_TO_SPACE[n];
    // CSS 변수 이름에서 '0.5'는 '0\.5' 이스케이프 필요 없음 (DS theme.css가 var(--spacing-0\.5)로 매핑하지만 변수명 자체는 --space-0-5)
    // DS의 spacing-tokens.ts: my-2 → space-0-5(변수명) / Tailwind 클래스는 0.5
    // 따라서 var(--spacing-{suffix})는 theme.css의 키와 일치해야 함:
    //  - --spacing-px ←→ class px
    //  - --spacing-0\.5 ←→ class 0.5 (변수명에 .)
    //  - --spacing-1..20 ←→ class 1..20
    // 사용자 코드에서 var(--spacing-my-2)로 쓰던 케이스는 그대로 DS의 --spacing-0\.5에 대응해야 하나, CSS에서 \.은 식별자 escape.
    // 단순화: 0.5 케이스는 직접 var(--space-0-5)를 가리키게 한다 (theme.css 값과 동일).
    if (dsSuffix === "0.5") return "--space-0-5";
    if (dsSuffix === "px") return "--space-px";
    return `--space-${dsSuffix}`;
  });

  // 2. className renames
  for (const [from, to] of CLASS_RENAMES) {
    if (from === to) continue;
    const escFrom = escapeRe(from);
    // 시작 boundary: 시작이거나 word/하이픈이 아닌 문자
    // 끝 boundary: word/하이픈이 아닌 문자
    const re = new RegExp(`(?<![\\w-])${escFrom}(?![\\w-])`, "g");
    next = next.replace(re, () => {
      changes++;
      return to;
    });
  }

  return { content: next, changes };
}

async function main() {
  const files = await walk(srcRoot);
  let totalChanges = 0;
  let touchedFiles = 0;
  const perFile = [];

  for (const file of files) {
    const orig = await readFile(file, "utf8");
    const { content, changes } = transformContent(orig);
    if (changes > 0 && content !== orig) {
      perFile.push([relative(srcRoot, file), changes]);
      totalChanges += changes;
      touchedFiles++;
      if (write) await writeFile(file, content);
    }
  }

  // 보고
  perFile.sort((a, b) => b[1] - a[1]);
  console.log(`\n${touchedFiles} files, ${totalChanges} replacements ${write ? "applied" : "(dry-run)"}\n`);
  for (const [path, count] of perFile.slice(0, 30)) {
    console.log(`  ${count.toString().padStart(4)}  ${path}`);
  }
  if (perFile.length > 30) {
    console.log(`  ... and ${perFile.length - 30} more files`);
  }
  if (!write) {
    console.log(`\nPass --write to apply.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
