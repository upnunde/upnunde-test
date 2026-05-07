#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function loadEnvFileIfExists(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const root = path.resolve(process.cwd());
loadEnvFileIfExists(path.join(root, ".env.pm"));

const webhookUrl = process.env.N8N_PM_WEBHOOK_URL;
if (!webhookUrl) {
  console.error("N8N_PM_WEBHOOK_URL 이 설정되지 않았습니다. .env.pm 파일을 확인해 주세요.");
  process.exit(1);
}

const input = process.argv.slice(2).join(" ").trim();
if (!input) {
  console.error('요청 문구를 넣어 주세요. 예) npm run pm:req -- "정산 화면 UX 개선"');
  process.exit(1);
}

const featureName = input.length > 60 ? `${input.slice(0, 57)}...` : input;
const payload = {
  feature_name: featureName,
  pm_note: input,
  planner_owner: "planner-ai",
  uiux_owner: "uiux-ai",
  fe_owner: "fe-ai",
};

const res = await fetch(webhookUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  const body = await res.text();
  console.error(`요청 실패: ${res.status} ${res.statusText}`);
  console.error(body);
  process.exit(1);
}

const data = await res.json();
console.log("PM 오케스트레이터 전달 완료");
console.log(JSON.stringify(data, null, 2));
