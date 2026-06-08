#!/usr/bin/env node
/**
 * App Router 회귀 방지 — 확정된 라우트 구조 위반 시 exit 1.
 * 실행: npm run check:routes (app/ 디렉터리)
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const seriesDir = join(appRoot, "src/app/series");
const errors = [];

const legacySeriesPage = join(seriesDir, "page.tsx");
const myWorksPage = join(seriesDir, "(my-works)/page.tsx");
const myWorksLayout = join(seriesDir, "(my-works)/layout.tsx");
const myWorksCharacter = join(seriesDir, "(my-works)/character/page.tsx");
const myWorksScenario = join(seriesDir, "(my-works)/scenario/page.tsx");

if (existsSync(legacySeriesPage) && existsSync(myWorksPage)) {
  errors.push(
    "series/page.tsx 와 series/(my-works)/page.tsx 가 동시에 존재합니다. " +
      "/series 는 (my-works) 레이아웃(내 작품 탭)만 사용해야 합니다. series/page.tsx 를 삭제하세요.",
  );
}

if (existsSync(myWorksPage) && !existsSync(myWorksLayout)) {
  errors.push(
    "series/(my-works)/page.tsx 가 있으나 layout.tsx 가 없습니다. 내 작품 탭 레이아웃이 필요합니다.",
  );
}

if (existsSync(myWorksLayout)) {
  if (!existsSync(myWorksCharacter)) {
    errors.push("series/(my-works)/character/page.tsx 가 없습니다. /series/character 탭이 깨집니다.");
  }
  if (!existsSync(myWorksScenario)) {
    errors.push("series/(my-works)/scenario/page.tsx 가 없습니다. /series/scenario 탭이 깨집니다.");
  }
}

if (errors.length > 0) {
  console.error("\n[check:routes] 라우트 가드 실패:\n");
  for (const message of errors) {
    console.error(`  • ${message}`);
  }
  console.error("\n참고: .cursor/rules/page-route-guard.mdc\n");
  process.exit(1);
}

console.log("[check:routes] OK — 내 작품(/series) 라우트 구조 정상");
