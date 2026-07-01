#!/usr/bin/env node
/**
 * 인라인 시각 패턴을 스캔해서 DS 컴포넌트 후보 판정 리포트 생성.
 *
 * 판정 카테고리:
 *   - Badge (soft/default/destructive/outline)
 *   - Button (icon-only ghost / primary / secondary / outline)
 *   - Chip / FilterChip
 *   - Alert / Callout
 *   - Skeleton
 *   - Dialog / Popover (inline)
 *
 * 신뢰도: high / medium / low
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(appRoot, "src");
const reportPath = join(appRoot, "..", "docs", "wip", "component-candidates-report.md");

// UI 프리미티브·어댑터 파일은 스캔 제외 (이미 컴포넌트이므로)
const EXCLUDE_PATHS = [
  "src/components/ui/",
  "src/lib/chip-styles.ts",
  "src/lib/form-field-styles.ts",
  "src/lib/tab-styles.ts",
  "src/lib/thumbnail-styles.ts",
  "src/lib/preview-overlay-styles.ts",
  "src/lib/menu-list-styles.ts",
];

function isExcluded(relPath) {
  return EXCLUDE_PATHS.some((p) => relPath.startsWith(p) || relPath === p);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (/\.tsx$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * JSX 요소 하나를 찾아 그 안의 className만 추출.
 * 정규식만으로는 완벽 파싱 불가 — 실전에서 통하는 heuristic.
 */
function extractJsxTagsWithClassName(source) {
  /** @type {Array<{tag: string, className: string, line: number, raw: string}>} */
  const out = [];
  // 매우 단순한 매처: 태그 시작 ~ 태그 종료 사이의 className="..." 추출
  const re = /<([a-zA-Z][a-zA-Z0-9]*)[^>]*?\bclassName=(?:"([^"]*)"|\{["'`]([^"'`]*)["'`]\})[^>]*?>/g;
  let m;
  while ((m = re.exec(source))) {
    const tag = m[1];
    const className = m[2] ?? m[3] ?? "";
    if (!className) continue;
    const line = source.slice(0, m.index).split("\n").length;
    out.push({ tag, className, line, raw: m[0] });
  }
  return out;
}

// 판정 규칙 —— 우선순위 순
const RULES = [
  {
    name: "Badge (soft brand)",
    confidence: "high",
    replacement: '<Badge variant="soft">',
    test: ({ tag, className }) => {
      const isInlineContainer = tag === "span" || tag === "div";
      const hasRounded = /\brounded(?:-md|-sm|-lg)?\b/.test(className);
      const hasSmallPadding = /\bpx-(?:1|2|3)\b/.test(className) && /\bpy-(?:0\.5|1|1\.5)\b/.test(className);
      const hasBrandSoft = /\bbg-primary\/(?:5|10|15|20)\b/.test(className) && /\btext-primary\b/.test(className);
      const hasBadgeTypo = /\btext-(?:body3|body4|caption1|caption2)_(?:400|500|700)\b/.test(className);
      return isInlineContainer && hasRounded && hasSmallPadding && hasBrandSoft && hasBadgeTypo;
    },
  },
  {
    name: "Badge (soft destructive)",
    confidence: "high",
    replacement: '<Badge variant="softDestructive">',
    test: ({ tag, className }) => {
      const isInlineContainer = tag === "span" || tag === "div";
      const hasRounded = /\brounded\b/.test(className);
      const hasSmallPadding = /\bpx-(?:1|2|3)\b/.test(className) && /\bpy-(?:0\.5|1|1\.5)\b/.test(className);
      const hasDestrSoft = /\bbg-destructive\/(?:5|10|15|20)\b/.test(className) && /\btext-destructive\b/.test(className);
      return isInlineContainer && hasRounded && hasSmallPadding && hasDestrSoft;
    },
  },
  {
    name: "Badge (solid primary)",
    confidence: "medium",
    replacement: '<Badge variant="default">',
    test: ({ tag, className }) => {
      const isInlineContainer = tag === "span" || tag === "div";
      const hasRoundedFull = /\brounded-full\b/.test(className);
      const hasSmallPadding = /\bpx-(?:1|2)\b/.test(className) && /\bpy-(?:0\.5|1)\b/.test(className);
      const hasPrimary = /\bbg-primary\b(?!-)/.test(className) && /\btext-primary-foreground\b/.test(className);
      return isInlineContainer && hasRoundedFull && hasSmallPadding && hasPrimary;
    },
  },
  {
    name: "Badge (solid destructive)",
    confidence: "medium",
    replacement: '<Badge variant="destructive">',
    test: ({ tag, className }) => {
      const isInlineContainer = tag === "span" || tag === "div";
      const hasRoundedFull = /\brounded-full\b/.test(className);
      const hasPrimary = /\bbg-destructive\b(?!-|\/)/.test(className) && /\btext-(?:inverse-foreground|destructive-foreground)\b/.test(className);
      return isInlineContainer && hasRoundedFull && hasPrimary;
    },
  },
  {
    name: "Badge (outline)",
    confidence: "medium",
    replacement: '<Badge variant="outline">',
    test: ({ tag, className }) => {
      const isInlineContainer = tag === "span" || tag === "div";
      const hasRounded = /\brounded(?:-full)?\b/.test(className);
      const hasBorder = /\bborder\b(?!-)/.test(className) || /\bborder-(?:border|primary|destructive|foreground)/.test(className);
      const hasSmallPadding = /\bpx-(?:1|2|3)\b/.test(className) && /\bpy-(?:0\.5|1|1\.5)\b/.test(className);
      const hasSmallText = /\btext-(?:caption|body[34])/.test(className);
      const noBgSolid = !/\bbg-primary\b(?!-|\/)/.test(className) && !/\bbg-inverse\b(?!-|\/)/.test(className);
      return isInlineContainer && hasRounded && hasBorder && hasSmallPadding && hasSmallText && noBgSolid;
    },
  },
  {
    name: "Button (icon-only ghost)",
    confidence: "high",
    replacement: '<Button variant="ghost" size="icon-sm">',
    test: ({ tag, className, raw }) => {
      if (tag !== "button") return false;
      const hasAriaLabel = /aria-label=/.test(raw);
      const hasIconSize = /\bsize-(?:8|9|10)\b/.test(className) || /\b[wh]-(?:8|9|10)\b/.test(className);
      const hasRounded = /\brounded(?:-md|-full)?\b/.test(className);
      const hasHover = /\bhover:bg-(?:muted|accent|inverse-foreground\/10)\b/.test(className);
      const noText = !/text-(body|heading|caption)/.test(className);
      return hasAriaLabel && hasIconSize && hasRounded && hasHover && noText;
    },
  },
  {
    name: "Button (primary CTA)",
    confidence: "medium",
    replacement: '<Button>',
    test: ({ tag, className }) => {
      if (tag !== "button") return false;
      const hasPrimary = /\bbg-primary\b(?!-)/.test(className) && /\btext-primary-foreground\b/.test(className);
      const hasControlHeight = /\bh-(?:8|9|10|11)\b/.test(className);
      return hasPrimary && hasControlHeight;
    },
  },
  {
    name: "Button (inverse CTA)",
    confidence: "medium",
    replacement: '<Button variant="secondaryContainer">',
    test: ({ tag, className }) => {
      if (tag !== "button") return false;
      const hasInverse = /\bbg-inverse\b(?!-|\/)/.test(className) && /\btext-inverse-foreground\b/.test(className);
      const hasControlHeight = /\bh-(?:8|9|10|11)\b/.test(className) || /\bpx-(?:3|4|5)\b/.test(className);
      return hasInverse && hasControlHeight;
    },
  },
  {
    name: "Button (outline)",
    confidence: "medium",
    replacement: '<Button variant="outline">',
    test: ({ tag, className }) => {
      if (tag !== "button") return false;
      const hasBorder = /\bborder\b(?!-)/.test(className) && /\bborder-border\b/.test(className);
      const hasBg = /\bbg-(?:background|muted)\b/.test(className);
      const hasHover = /\bhover:bg-(?:muted|accent)\b/.test(className);
      const hasControlHeight = /\bh-(?:8|9|10|11)\b/.test(className) || /\bpx-(?:3|4)\b/.test(className);
      return hasBorder && hasBg && hasHover && hasControlHeight;
    },
  },
  {
    name: "Skeleton",
    confidence: "high",
    replacement: '<Skeleton>',
    test: ({ tag, className }) => {
      if (tag !== "div" && tag !== "span") return false;
      const hasPulse = /\banimate-pulse\b/.test(className);
      const hasBgMuted = /\bbg-muted\b/.test(className);
      const hasRounded = /\brounded\b/.test(className);
      return hasPulse && hasBgMuted && hasRounded;
    },
  },
  {
    name: "Alert (destructive)",
    confidence: "medium",
    replacement: '<Alert variant="destructive">',
    test: ({ tag, className, raw }) => {
      if (tag !== "div") return false;
      const hasDestrBg = /\bbg-destructive\/(?:5|10|15|20)\b/.test(className);
      const hasRounded = /\brounded(?:-md|-lg)?\b/.test(className);
      const hasPadding = /\bp-(?:3|4)\b/.test(className) || (/\bpx-(?:3|4)\b/.test(className) && /\bpy-(?:2|3)\b/.test(className));
      return hasDestrBg && hasRounded && hasPadding;
    },
  },
  {
    name: "Alert (info/warning)",
    confidence: "low",
    replacement: '<Alert>',
    test: ({ tag, className }) => {
      if (tag !== "div") return false;
      const hasAccentBg = /\bbg-(?:accent|primary-container|muted)\b/.test(className);
      const hasRounded = /\brounded(?:-md|-lg)?\b/.test(className);
      const hasPadding = /\bp-(?:3|4|5)\b/.test(className);
      const hasBorder = /\bborder\b/.test(className);
      return hasAccentBg && hasRounded && hasPadding && hasBorder;
    },
  },
];

async function main() {
  const files = await walk(srcRoot);
  /** @type {Map<string, Array<{line: number, rule: string, confidence: string, replacement: string, tag: string, snippet: string}>>} */
  const findings = new Map();

  for (const file of files) {
    const rel = relative(appRoot, file);
    if (isExcluded(rel)) continue;
    const source = await readFile(file, "utf8");
    const jsx = extractJsxTagsWithClassName(source);
    if (jsx.length === 0) continue;

    for (const el of jsx) {
      for (const rule of RULES) {
        if (rule.test(el)) {
          if (!findings.has(rel)) findings.set(rel, []);
          const snippet = el.raw.length > 200 ? el.raw.slice(0, 200) + "…" : el.raw;
          findings.get(rel).push({
            line: el.line,
            rule: rule.name,
            confidence: rule.confidence,
            replacement: rule.replacement,
            tag: el.tag,
            snippet,
          });
          break; // 첫 매칭 규칙만
        }
      }
    }
  }

  // 리포트 생성
  const groupByConfidence = { high: [], medium: [], low: [] };
  let totalFindings = 0;
  const filesWithFindings = [...findings.keys()].sort();
  for (const file of filesWithFindings) {
    for (const f of findings.get(file)) {
      groupByConfidence[f.confidence].push({ file, ...f });
      totalFindings++;
    }
  }

  const now = "2026-07-01";
  const lines = [];
  lines.push(`# 컴포넌트 미채택 스캔 리포트`);
  lines.push(``);
  lines.push(`> 생성일: ${now}`);
  lines.push(`> 스캔 대상: \`app/src/**/*.tsx\` (컴포넌트 ui/ 제외)`);
  lines.push(`> 발견 총계: **${totalFindings}건** (${filesWithFindings.length}개 파일)`);
  lines.push(``);
  lines.push(`## 판정 방법`);
  lines.push(``);
  lines.push(`- 인라인 마크업의 태그·className·속성 패턴을 규칙 매처로 판정.`);
  lines.push(`- 규칙별 신뢰도: **high** = 스타일·시맨틱 명확 (자동 교체 후보) · **medium** = 검수 필요 · **low** = 도메인 판단`);
  lines.push(`- 하나의 요소는 첫 매치 규칙만 기록 (규칙 우선순위 순).`);
  lines.push(``);

  for (const level of ["high", "medium", "low"]) {
    const items = groupByConfidence[level];
    if (items.length === 0) continue;
    lines.push(`## ${level.toUpperCase()} — ${items.length}건`);
    lines.push(``);
    // 규칙별 그루핑
    const byRule = new Map();
    for (const it of items) {
      if (!byRule.has(it.rule)) byRule.set(it.rule, []);
      byRule.get(it.rule).push(it);
    }
    for (const [rule, entries] of byRule) {
      lines.push(`### ${rule} — ${entries.length}건`);
      lines.push(``);
      lines.push(`권장 교체: \`${entries[0].replacement}\``);
      lines.push(``);
      lines.push(`| 파일 | 라인 | 태그 | 스니펫 |`);
      lines.push(`|---|---|---|---|`);
      for (const e of entries) {
        const escaped = e.snippet.replace(/\|/g, "\\|").replace(/\n/g, " ");
        lines.push(`| \`${e.file}\` | ${e.line} | \`<${e.tag}>\` | \`${escaped}\` |`);
      }
      lines.push(``);
    }
  }

  await writeFile(reportPath, lines.join("\n"));
  console.log(`\n${totalFindings} findings in ${filesWithFindings.length} files`);
  console.log(`Report: ${relative(appRoot, reportPath)}`);
  console.log(``);
  console.log(`Breakdown:`);
  for (const level of ["high", "medium", "low"]) {
    console.log(`  ${level.padEnd(6)} ${groupByConfidence[level].length}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
