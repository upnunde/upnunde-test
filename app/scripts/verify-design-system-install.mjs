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

/** DS: `export const` + `export { 동일 이름 }` 이중 export로 webpack이 실패한다. */
function patchDuplicateFieldLabelExports() {
  const filePath = path.join(dsRoot, "src/components/ui/field-label.tsx");
  if (!fs.existsSync(filePath)) return;
  const source = fs.readFileSync(filePath, "utf8");
  const next = source.replace(
    /export \{\s*FieldLabel,\s*fieldLabelTitleVariants,(?:\s*FIELD_LABEL_CONTROL_GAP,)?(?:\s*FIELD_LABEL_CONTROL_GAP_GROUP_CLASS,)?(?:\s*FIELD_LABEL_CONTROL_GAP_PX,)?\s*type FieldLabelProps,\s*\}/,
    "export {\n  FieldLabel,\n  fieldLabelTitleVariants,\n  type FieldLabelProps,\n}",
  );
  if (next !== source) {
    fs.writeFileSync(filePath, next);
    console.log("verify:ds — patched duplicate FIELD_LABEL_CONTROL_GAP export");
  }
}

/**
 * DS utils: 커스텀 twMerge 그룹 `ds-typography`가 DefaultClassGroupIds에 없어
 * Next `transpilePackages` 타입체크가 실패한다. 설정 객체만 단언한다.
 */
function patchTwMergeDsTypographyTypes() {
  const filePath = path.join(dsRoot, "src/lib/utils.ts");
  if (!fs.existsSync(filePath)) return;
  const source = fs.readFileSync(filePath, "utf8");
  if (source.includes("/* verify:ds-twmerge-patch */")) return;

  const marker = "const twMerge = extendTailwindMerge({";
  const idx = source.indexOf(marker);
  if (idx === -1) return;

  let depth = 0;
  let end = -1;
  for (let i = idx + marker.length - 1; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0 && source[i + 1] === ")") {
        end = i + 2;
        break;
      }
    }
  }
  if (end === -1) return;

  const call = source.slice(idx, end);
  const patchedCall = call.replace(
    /\}\)$/,
    "} as Parameters<typeof extendTailwindMerge>[0] /* verify:ds-twmerge-patch */)",
  );
  if (patchedCall === call) return;

  const next = source.slice(0, idx) + patchedCall + source.slice(end);
  fs.writeFileSync(filePath, next);
  console.log("verify:ds — patched twMerge ds-typography types");
}

patchDuplicateFieldLabelExports();
patchTwMergeDsTypographyTypes();
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
