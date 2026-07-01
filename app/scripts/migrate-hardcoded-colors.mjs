#!/usr/bin/env node
/**
 * Phase C — 하드코딩된 절대 색·Tailwind 팔레트를 DS 시맨틱 토큰으로 일괄 치환.
 *
 * 사용:
 *   node scripts/migrate-hardcoded-colors.mjs           # dry-run
 *   node scripts/migrate-hardcoded-colors.mjs --write   # 적용
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(appRoot, "src");
const write = process.argv.includes("--write");

/**
 * className 일괄 매핑. 긴 것부터 정렬 (예: bg-white/10 처리는 별도).
 * 슬래시 opacity 형태(`bg-white/10`)는 여기서 처리 안 함 (별도 검수 대상).
 */
const CLASS_RENAMES = [
  // 슬래시 opacity dim 오버레이 → DS dim
  ["bg-black/10", "bg-dim-10"],
  ["bg-black/20", "bg-dim-10"],
  ["bg-black/28", "bg-dim-10"],
  ["bg-black/30", "bg-dim-10"],
  ["bg-black/40", "bg-dim-20"],
  ["bg-black/45", "bg-dim-20"],
  ["bg-black/50", "bg-dim-20"],
  ["bg-black/55", "bg-dim-20"],
  ["bg-black/60", "bg-dim-20"],
  ["bg-black/67", "bg-dim-30"],
  ["bg-black/70", "bg-dim-30"],
  ["bg-black/75", "bg-dim-30"],
  ["bg-black/80", "bg-dim-30"],
  ["bg-black/90", "bg-dim-30"],

  // 이미지 위 흰 텍스트/보더 (다크에서도 흰색 유지) → inverse-foreground
  ["text-white/70", "text-inverse-foreground/70"],
  ["text-white/80", "text-inverse-foreground/80"],
  ["text-white/85", "text-inverse-foreground/85"],
  ["text-white/90", "text-inverse-foreground/90"],
  ["text-white/95", "text-inverse-foreground/95"],
  ["bg-white/10", "bg-inverse-foreground/10"],
  ["bg-white/15", "bg-inverse-foreground/15"],
  ["bg-white/20", "bg-inverse-foreground/20"],
  ["bg-white/25", "bg-inverse-foreground/25"],
  ["border-white/15", "border-inverse-foreground/15"],
  ["border-white/20", "border-inverse-foreground/20"],
  ["hover:bg-white/10", "hover:bg-inverse-foreground/10"],
  ["hover:bg-white/20", "hover:bg-inverse-foreground/20"],
  ["active:bg-white/25", "active:bg-inverse-foreground/25"],

  // 절대 색 — 표면
  ["bg-white", "bg-background"],
  ["text-white", "text-inverse-foreground"],
  ["border-white", "border-inverse"],
  ["bg-black", "bg-inverse"],
  ["text-black", "text-foreground"],
  ["border-black", "border-border-strong"],
  ["ring-white", "ring-background"],

  // slate 스케일 → 시맨틱
  ["bg-slate-50", "bg-muted"],
  ["bg-slate-100", "bg-muted"],
  ["bg-slate-200", "bg-secondary"],
  ["bg-slate-300", "bg-disabled"],
  ["bg-slate-400", "bg-foreground-disabled"],
  ["bg-slate-500", "bg-foreground-placeholder"],
  ["bg-slate-600", "bg-foreground-muted"],
  ["bg-slate-700", "bg-inverse"],
  ["bg-slate-800", "bg-inverse"],
  ["bg-slate-900", "bg-inverse"],
  ["text-slate-300", "text-foreground-disabled"],
  ["text-slate-400", "text-foreground-disabled"],
  ["text-slate-500", "text-foreground-placeholder"],
  ["text-slate-600", "text-foreground-muted"],
  ["text-slate-700", "text-foreground"],
  ["text-slate-800", "text-foreground"],
  ["text-slate-900", "text-foreground"],
  ["border-slate-100", "border-divider"],
  ["border-slate-200", "border-border"],
  ["border-slate-300", "border-border"],
  ["border-slate-400", "border-disabled-border"],
  ["border-slate-500", "border-border-strong"],
  ["border-slate-600", "border-border-strong"],
  ["border-slate-700", "border-border-strong"],
  ["border-slate-800", "border-border-strong"],
  ["border-slate-900", "border-border-strong"],
  ["ring-slate-200", "ring-border"],
  ["ring-slate-300", "ring-border"],
  ["ring-slate-400", "ring-border"],
  ["ring-slate-900/20", "ring-foreground/20"],

  // zinc 스케일 → 시맨틱
  ["bg-zinc-50", "bg-muted"],
  ["bg-zinc-100", "bg-muted"],
  ["bg-zinc-200", "bg-secondary"],
  ["bg-zinc-700", "bg-inverse"],
  ["bg-zinc-800", "bg-inverse"],
  ["bg-zinc-900", "bg-inverse"],
  ["text-zinc-300", "text-foreground-disabled"],
  ["text-zinc-400", "text-foreground-placeholder"],
  ["text-zinc-500", "text-foreground-placeholder"],
  ["text-zinc-600", "text-foreground-muted"],
  ["text-zinc-700", "text-foreground"],
  ["border-zinc-200", "border-border"],
  ["border-zinc-700", "border-border-strong"],

  // neutral 스케일 (아주 소수) → 시맨틱
  ["bg-neutral-900", "bg-inverse"],
  ["text-neutral-900", "text-foreground"],

  // 에러·경고 팔레트 → DS destructive-container/destructive
  ["bg-red-50", "bg-destructive-container"],
  ["bg-red-100", "bg-destructive-container"],
  ["bg-rose-50", "bg-destructive-container"],
  ["bg-rose-100", "bg-destructive-container"],
  ["bg-rose-600", "bg-destructive"],
  ["bg-rose-950", "bg-destructive-container"],
  ["text-red-500", "text-destructive"],
  ["text-red-600", "text-destructive"],
  ["text-rose-500", "text-destructive"],
  ["text-rose-600", "text-destructive"],
];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SKIP_FILES = new Set([
  // 도메인 CSS 정책 파일 — .bg-black 강제 치환 등 selector 형태로 사용
  join(srcRoot, "app", "globals.css"),
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (SKIP_FILES.has(full)) continue;
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (/\.(tsx?|jsx?|mjs|cjs|css)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function transformContent(content) {
  let changes = 0;
  let next = content;

  for (const [from, to] of CLASS_RENAMES) {
    if (from === to) continue;
    const escFrom = escapeRe(from);
    // 슬래시가 포함된 매칭(예: bg-black/50)은 뒤쪽 슬래시·숫자를 이미 포함하니 우측 boundary는 완화
    const hasSlash = from.includes("/");
    const rightBoundary = hasSlash ? "(?![\\w-/])" : "(?![\\w-/])";
    const leftBoundary = hasSlash ? "(?<![\\w-/])" : "(?<![\\w-/])";
    const re = new RegExp(`${leftBoundary}${escFrom}${rightBoundary}`, "g");
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
