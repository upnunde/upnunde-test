import type { ScriptBlock } from "@/types/editor";

/** 선택지 `nextScene` 값 → 장면 블록 인덱스 */
export function findSceneBlockIndex(blocks: ScriptBlock[], nextScene: string): number {
  const target = nextScene.trim();
  if (!target) return -1;

  const scenes = blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.type === "scene");

  const byContent = scenes.find(
    ({ block }) => (block.content?.trim() || "") === target,
  );
  if (byContent) return byContent.index;

  const byFallback = scenes.find(
    (_, sceneOrder) => `장면_${sceneOrder + 1}` === target,
  );
  if (byFallback) return byFallback.index;

  return -1;
}

export function clampPlaybackIndex(blocks: ScriptBlock[], index: number): number {
  if (blocks.length === 0) return 0;
  return Math.max(0, Math.min(index, blocks.length - 1));
}

/** 편집 중 선택(포커스)된 블록 → 미리보기 재생 인덱스 */
export function resolvePlaybackIndexFromFocus(
  blocks: ScriptBlock[],
  focusBlockId: string | null,
): number {
  if (!focusBlockId || blocks.length === 0) return 0;
  const index = blocks.findIndex((block) => block.id === focusBlockId);
  return clampPlaybackIndex(blocks, index >= 0 ? index : 0);
}
