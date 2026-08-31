#!/usr/bin/env node
/**
 * Figma `2:32` 프로토타입 이미지 export → `public/prototype/work-detail/`
 *
 * 방법 A (권장): Figma Personal Access Token
 *   FIGMA_ACCESS_TOKEN=xxx node scripts/export-figma-prototype-images.mjs
 *
 * 방법 B: TalkToFigma (플러그인 + 소켓)
 *   bunx cursor-talk-to-figma-socket
 *   Figma 플러그인 → 같은 채널 join
 *   node scripts/export-figma-prototype-images.mjs qein2h49
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(APP_ROOT, "public/prototype/work-detail");
const FILE_KEY = "wxrlczSyjZ0eAfQ2suYFPO";
const WS_URL = "ws://localhost:3055";
const CHANNEL = process.argv[2] || process.env.FIGMA_CHANNEL || "qein2h49";
const TIMEOUT_MS = 120_000;

const ASSETS = [
  { nodeId: "2:33", file: "hero-background.jpg" },
  { nodeId: "2:36", file: "cover.jpg" },
  { nodeId: "2:66", file: "episode-1.jpg" },
  { nodeId: "2:68", file: "episode-2.jpg" },
  { nodeId: "2:70", file: "episode-3.jpg" },
  { nodeId: "2:72", file: "episode-4.jpg" },
  { nodeId: "2:74", file: "episode-5.jpg" },
  { nodeId: "2:76", file: "episode-6.jpg" },
];

async function exportViaFigmaApi(token) {
  const ids = ASSETS.map((a) => a.nodeId).join(",");
  const url = new URL(`https://api.figma.com/v1/images/${FILE_KEY}`);
  url.searchParams.set("ids", ids);
  url.searchParams.set("format", "jpg");
  url.searchParams.set("scale", "2");

  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  if (json.err) throw new Error(json.err);

  for (const asset of ASSETS) {
    const imageUrl = json.images?.[asset.nodeId];
    if (!imageUrl) {
      throw new Error(`No image URL for node ${asset.nodeId}`);
    }
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      throw new Error(`Download failed for ${asset.file}: ${imgRes.status}`);
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    await writeFile(path.join(OUT_DIR, asset.file), buffer);
    console.log(`✓ ${asset.file} ← API ${asset.nodeId} (${buffer.length} bytes)`);
  }
}

async function exportViaTalkToFigma() {
  const { default: WebSocket } = await import("ws");

  function sendCommand(ws, channel, command, params = {}) {
    return new Promise((resolve, reject) => {
      const id = randomUUID();
      const isJoin = command === "join";
      const payload = {
        id,
        type: isJoin ? "join" : "message",
        ...(isJoin ? { channel: params.channel } : { channel }),
        message: {
          id,
          command,
          params: { ...params, commandId: id },
        },
      };

      const timer = setTimeout(() => {
        ws.off("message", onMessage);
        reject(new Error(`Timeout: ${command} (${params.nodeId ?? ""})`));
      }, TIMEOUT_MS);

      function onMessage(raw) {
        try {
          const json = JSON.parse(String(raw));
          const msg = json.message;
          if (!msg || msg.id !== id) return;
          clearTimeout(timer);
          ws.off("message", onMessage);
          if (msg.error) reject(new Error(msg.error));
          else resolve(msg.result);
        } catch {
          /* ignore */
        }
      }

      ws.on("message", onMessage);
      ws.send(JSON.stringify(payload));
    });
  }

  await new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    ws.on("open", async () => {
      try {
        console.log(`TalkToFigma channel "${CHANNEL}"…`);
        await sendCommand(ws, CHANNEL, "join", { channel: CHANNEL });
        for (const asset of ASSETS) {
          const result = await sendCommand(ws, CHANNEL, "export_node_as_image", {
            nodeId: asset.nodeId,
            format: "JPG",
            scale: 2,
          });
          if (!result?.imageData) {
            throw new Error(`No imageData for ${asset.nodeId}`);
          }
          const buffer = Buffer.from(result.imageData, "base64");
          await writeFile(path.join(OUT_DIR, asset.file), buffer);
          console.log(`✓ ${asset.file} ← plugin ${asset.nodeId} (${buffer.length} bytes)`);
        }
        ws.close();
        resolve();
      } catch (err) {
        ws.close();
        reject(err);
      }
    });
    ws.on("error", reject);
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (token) {
    console.log("Using Figma REST API…");
    await exportViaFigmaApi(token);
  } else {
    console.log("FIGMA_ACCESS_TOKEN 없음 → TalkToFigma 시도…");
    await exportViaTalkToFigma();
  }

  console.log(`\nDone. ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("\nExport failed:", err.message);
  console.error(
    "\n해결 방법:\n" +
      "  A) FIGMA_ACCESS_TOKEN=figd_xxx node scripts/export-figma-prototype-images.mjs\n" +
      "  B) bunx cursor-talk-to-figma-socket + Figma 플러그인 join 후\n" +
      `     bun scripts/export-figma-prototype-images.mjs ${CHANNEL}`,
  );
  process.exit(1);
});
