#!/usr/bin/env node
/**
 * node_modules/design-system 설치 무결성 — package.json exports 경로가 실제 파일인지 확인.
 * GitHub git dep 설치가 중단·캐시 손상되면 brand-icons.tsx 등이 빠져 빌드가 깨진다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dsRoot = path.join(appRoot, "node_modules", "design-system");
const pkgPath = path.join(dsRoot, "package.json");

if (!fs.existsSync(pkgPath)) {
  console.error(
    "verify:ds — design-system 패키지가 없습니다.\n  cd app && npm install",
  );
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const exportsMap = pkg.exports ?? {};
const missing = [];

for (const target of Object.values(exportsMap)) {
  if (typeof target !== "string" || !target.startsWith("./")) continue;
  const filePath = path.join(dsRoot, target);
  if (!fs.existsSync(filePath)) {
    missing.push(target);
  }
}

if (missing.length === 0) {
  console.log(`verify:ds — OK (design-system@${pkg.version})`);
  process.exit(0);
}

console.error(
  `verify:ds — design-system@${pkg.version} 설치가 불완전합니다 (${missing.length}건 누락):\n`,
);
for (const rel of missing) {
  console.error(`  - ${rel}`);
}
console.error(
  "\n복구:\n  cd app && rm -rf node_modules/design-system && npm install",
);
process.exit(1);
