#!/usr/bin/env node
/**
 * Renovel-Studio-DS 최신 릴리스 태그를 app/package.json · lockfile에 반영.
 * 변경 없으면 exit 0. 변경 있으면 npm install 후 GITHUB_OUTPUT에 changed=true.
 *
 * 환경 변수:
 * - DS_TAG — 고정 태그( repository_dispatch / workflow_dispatch )
 * - DS_REPO — 기본 upnunde/Renovel-Studio-DS
 * - DS_REPO_TOKEN | GH_TOKEN | GITHUB_TOKEN — GitHub API (비공개 repo 시 PAT 권장)
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const PACKAGE_JSON_PATH = path.join(APP_ROOT, "package.json");

const DS_REPO = process.env.DS_REPO ?? "upnunde/Renovel-Studio-DS";
const PINNED_TAG_RE = /#(v[\d.]+)$/;
const TAG_RE = /^v(\d+)\.(\d+)\.(\d+)$/;

function parseSemver(tag) {
  const match = tag?.match(TAG_RE);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareSemver(a, b) {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function readPinnedTag(dep) {
  const match = dep?.match(PINNED_TAG_RE);
  return match?.[1] ?? null;
}

function githubHeaders() {
  const token =
    process.env.DS_REPO_TOKEN ?? process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } : {
    Accept: "application/vnd.github+json",
  };
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: githubHeaders() });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} ${url}`);
  }
  return res.json();
}

async function resolveTargetTag() {
  const forced = process.env.DS_TAG?.trim();
  if (forced) {
    if (!TAG_RE.test(forced)) {
      throw new Error(`DS_TAG 형식 오류: ${forced} (예: v0.1.2)`);
    }
    return forced;
  }

  try {
    const release = await fetchJson(`https://api.github.com/repos/${DS_REPO}/releases/latest`);
    const tag = release.tag_name?.trim();
    if (tag && TAG_RE.test(tag)) return tag;
  } catch {
    // releases 없으면 tags 목록으로 fallback
  }

  const tags = await fetchJson(
    `https://api.github.com/repos/${DS_REPO}/tags?per_page=100`,
  );
  const semverTags = tags
    .map((t) => t.name)
    .filter((name) => TAG_RE.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const latest = semverTags.at(-1);
  if (!latest) {
    throw new Error(`${DS_REPO}에서 v*.*.* 태그를 찾지 못했습니다.`);
  }
  return latest;
}

function writeGithubOutput(key, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  fs.appendFileSync(outputPath, `${key}=${value}\n`);
}

function main() {
  return (async () => {
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
    const depKey = "design-system";
    const currentDep = pkg.dependencies?.[depKey];
    if (!currentDep?.includes("Renovel-Studio-DS")) {
      throw new Error(`package.json dependencies.${depKey}가 Renovel-Studio-DS를 가리키지 않습니다.`);
    }

    const currentTag = readPinnedTag(currentDep);
    const forcedTag = process.env.DS_TAG?.trim();
    const targetTag = await resolveTargetTag();

    writeGithubOutput("old_tag", currentTag ?? "");
    writeGithubOutput("new_tag", targetTag);

    if (currentTag === targetTag) {
      console.log(`design-system 이미 최신: ${targetTag}`);
      writeGithubOutput("changed", "false");
      return;
    }

    if (!forcedTag && currentTag) {
      const currentSemver = parseSemver(currentTag);
      const targetSemver = parseSemver(targetTag);
      if (currentSemver && targetSemver && compareSemver(targetSemver, currentSemver) <= 0) {
        console.log(
          `건너뜀 — 현재 ${currentTag}이(가) 릴리스 ${targetTag}보다 같거나 최신입니다.`,
        );
        writeGithubOutput("changed", "false");
        return;
      }
    }

    const nextDep = currentDep.replace(PINNED_TAG_RE, `#${targetTag}`);
    pkg.dependencies[depKey] = nextDep;
    fs.writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(pkg, null, 2)}\n`);

    console.log(`design-system ${currentTag ?? "(none)"} → ${targetTag}`);

    execSync("npm install", { cwd: APP_ROOT, stdio: "inherit" });

    writeGithubOutput("changed", "true");
  })();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
