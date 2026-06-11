/**
 * 더미 등장인물 이미지 — 웹 정적 에셋 최적화
 * 사용: node scripts/optimize-dummy-character-images.mjs <src> <dest.png> [...pairs]
 *
 * 기준: docs/dummy-resource-images.md
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_EDGE_PX = 960;
const MAX_BYTES = 220_000;
const PNG_QUALITY = 82;

async function optimizeToPngBuffer(inputPath) {
  const input = await readFile(inputPath);
  let quality = PNG_QUALITY;

  while (quality >= 60) {
    const buffer = await sharp(input)
      .rotate()
      .resize({
        width: MAX_EDGE_PX,
        height: MAX_EDGE_PX,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ compressionLevel: 9, quality, effort: 10 })
      .toBuffer();

    if (buffer.length <= MAX_BYTES) return buffer;
    quality -= 8;
  }

  return sharp(input)
    .rotate()
    .resize({
      width: MAX_EDGE_PX,
      height: MAX_EDGE_PX,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, quality: 60, effort: 10 })
    .toBuffer();
}

async function main() {
  const pairs = process.argv.slice(2);
  if (pairs.length < 2 || pairs.length % 2 !== 0) {
    console.error("Usage: node optimize-dummy-character-images.mjs <src> <dest> ...");
    process.exit(1);
  }

  for (let i = 0; i < pairs.length; i += 2) {
    const src = pairs[i];
    const dest = pairs[i + 1];
    await mkdir(path.dirname(dest), { recursive: true });
    const buffer = await optimizeToPngBuffer(src);
    await writeFile(dest, buffer);
    const meta = await sharp(buffer).metadata();
    console.log(
      `${path.basename(dest)}: ${meta.width}x${meta.height}, ${(buffer.length / 1024).toFixed(1)}KB`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
