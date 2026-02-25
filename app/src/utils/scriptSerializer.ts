import type { ScriptBlock } from "@/types/editor";

/** BlockType → legacy text tag name */
const TYPE_TO_TAG: Partial<Record<ScriptBlock["type"], string>> = {
  background: "bg",
  bgm: "bgm",
  sfx: "sfx",
  character: "char_img",
  gallery: "gallery",
  direction: "direction",
  choice: "choice",
  top_desc: "top_desc",
};

/**
 * Convert ScriptBlock[] back to legacy text format.
 */
export function serializeBlocksToScript(blocks: ScriptBlock[]): string {
  const lines: string[] = [];

  for (const block of blocks) {
    if (block.type === "scene") {
      const n = block.data?.sceneNumber ?? block.data?.turn;
      if (n != null) {
        lines.push("// ========================================");
        lines.push(`// SCENE ${n}: ${block.content}`);
        lines.push(`== SCENE_${n} ==`);
      } else {
        lines.push("// ========================================");
        lines.push(`== ${block.content} ==`);
      }
      continue;
    }

    if (block.type === "top_desc") {
      lines.push(`# top_desc: ${block.content}`);
      continue;
    }

    const tag = TYPE_TO_TAG[block.type];
    if (tag) {
      const value = block.content === "none" ? "//" : block.content;
      lines.push(`# ${tag}: ${value}`);
      continue;
    }

    // text — dialogue only; speaker is implied by the last # character block above
    lines.push(block.content);
  }

  return lines.join("\n");
}
