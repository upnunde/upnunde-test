#!/usr/bin/env node
/**
 * TalkToFigma로 Figma 노드 JSON + PNG export
 *
 * 사전 조건:
 * 1. bunx cursor-talk-to-figma-socket (3055)
 * 2. Figma 파일 열기 + Cursor Talk To Figma 플러그인 → 동일 채널 join
 *
 * Usage:
 *   node scripts/fetch-figma-node.mjs 20:252 [channel]
 *   node scripts/fetch-figma-node.mjs 20:252 qein2h49
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import WebSocket from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, ".figma-cache");
const WS_URL = "ws://localhost:3055";
const TIMEOUT_MS = 120_000;

const nodeId = process.argv[2];
const CHANNEL = process.argv[3] || process.env.FIGMA_CHANNEL || "y05i4ui3";

if (!nodeId) {
  console.error("Usage: node scripts/fetch-figma-node.mjs <nodeId> [channel]");
  process.exit(1);
}

const safeName = nodeId.replace(":", "-");

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
      reject(new Error(`Timeout: ${command}`));
    }, TIMEOUT_MS);

    function onMessage(raw) {
      try {
        const json = JSON.parse(String(raw));
        if (json.type === "broadcast" && json.message?.id === id) {
          clearTimeout(timer);
          ws.off("message", onMessage);
          if (json.message.error) reject(new Error(json.message.error));
          else resolve(json.message.result ?? json.message);
          return;
        }
        const msg = json.message;
        if (!msg || msg.id !== id) return;
        clearTimeout(timer);
        ws.off("message", onMessage);
        if (msg.error) reject(new Error(msg.error));
        else resolve(msg.result ?? msg);
      } catch {
        /* ignore */
      }
    }

    ws.on("message", onMessage);
    ws.send(JSON.stringify(payload));
  });
}

await mkdir(OUT_DIR, { recursive: true });

await new Promise((resolve, reject) => {
  const ws = new WebSocket(WS_URL);
  ws.on("open", async () => {
    try {
      console.log(`Channel "${CHANNEL}" → node ${nodeId}`);
      await sendCommand(ws, CHANNEL, "join", { channel: CHANNEL });
      const info = await sendCommand(ws, CHANNEL, "get_node_info", { nodeId });
      const jsonPath = path.join(OUT_DIR, `node-${safeName}.json`);
      await writeFile(jsonPath, JSON.stringify(info, null, 2));
      console.log(`✓ JSON → ${jsonPath}`);
      if (info?.name) console.log(`  name: ${info.name}`);

      const img = await sendCommand(ws, CHANNEL, "export_node_as_image", {
        nodeId,
        format: "PNG",
        scale: 2,
      });
      if (img?.imageData) {
        const pngPath = path.join(OUT_DIR, `node-${safeName}.png`);
        await writeFile(pngPath, Buffer.from(img.imageData, "base64"));
        console.log(`✓ PNG  → ${pngPath}`);
      }

      ws.close();
      resolve();
    } catch (err) {
      ws.close();
      reject(err);
    }
  });
  ws.on("error", reject);
}).catch((err) => {
  console.error("\nFetch failed:", err.message);
  console.error(
    "\nFigma 플러그인 연결:\n" +
      "  1. Figma에서 파일 열기\n" +
      "  2. Plugins → Cursor Talk To Figma MCP → Join\n" +
      `  3. 채널: ${CHANNEL}\n` +
      "  4. node-id 프레임 선택 후 다시 실행",
  );
  process.exit(1);
});
