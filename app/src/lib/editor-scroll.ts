/** 에디터 본문 스크롤 루트 식별자 */
export const EDITOR_SCROLL_ROOT_ATTR = "data-editor-scroll-root";

export const EDITOR_SCENE_TAB_STRIP_ID = "editor-scene-tab-strip";

/** 모바일 — 장면 탭 + 생성기 버튼 등 스크롤 상단 고정 영역 */
export const EDITOR_SCENE_HEADER_ID = "editor-scene-header";

/** 장면 블록이 탭·고정 영역 바로 아래 오도록 스크롤 inset(px) */
export function getEditorScrollTopInset(scrollRoot: Element): number {
  const gap = 8;
  const anchor =
    document.getElementById(EDITOR_SCENE_HEADER_ID) ??
    document.getElementById(EDITOR_SCENE_TAB_STRIP_ID);

  if (anchor) {
    const rootRect = scrollRoot.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    if (anchorRect.height > 0 && anchorRect.bottom > rootRect.top) {
      return anchorRect.bottom - rootRect.top + gap;
    }
    // 탭·헤더가 스크롤 영역 바로 위에 고정된 경우
    if (anchorRect.height > 0 && anchorRect.bottom <= rootRect.top) {
      return gap;
    }
  }

  return 100;
}

/** 포커스 블록이 속한 장면 id (포커스가 장면 블록이면 그 id) */
export function resolveSceneBlockIdFromFocus(
  blocks: { id: string; type: string }[],
  focusBlockId: string | null,
  sceneIds: string[],
): string | null {
  if (sceneIds.length === 0) return null;
  if (!focusBlockId) return sceneIds[0] ?? null;

  const focused = blocks.find((b) => b.id === focusBlockId);
  if (focused?.type === "scene") return focusBlockId;

  const focusIndex = blocks.findIndex((b) => b.id === focusBlockId);
  if (focusIndex === -1) return sceneIds[0] ?? null;

  for (let i = focusIndex; i >= 0; i--) {
    if (blocks[i]?.type === "scene") return blocks[i].id;
  }
  return sceneIds[0] ?? null;
}

/** 탭·사이드바 하이라이트 — 탭 클릭(장면 포커스) 우선, 그 외 스크롤 위치 */
export function resolveEditorActiveSceneId(
  blocks: { id: string; type: string }[],
  focusBlockId: string | null,
  sceneIds: string[],
  scrollActiveSceneId: string | null,
): string | null {
  if (sceneIds.length === 0) return null;

  const focused = focusBlockId ? blocks.find((b) => b.id === focusBlockId) : null;
  if (focused?.type === "scene") return focusBlockId;

  return scrollActiveSceneId ?? resolveSceneBlockIdFromFocus(blocks, focusBlockId, sceneIds);
}

/** 스크롤 앵커(장면 탭 하단) 기준으로 현재 보이는 장면 블록 id */
export function resolveActiveSceneBlockIdFromScroll(
  sceneIds: string[],
  scrollRoot: Element,
): string | null {
  if (sceneIds.length === 0) return null;

  const rootRect = scrollRoot.getBoundingClientRect();
  const anchorY = rootRect.top + getEditorScrollTopInset(scrollRoot);

  let activeId = sceneIds[0];
  for (const sceneId of sceneIds) {
    const el = document.getElementById(`block-${sceneId}`);
    if (!el) continue;

    if (el.getBoundingClientRect().top <= anchorY + 1) {
      activeId = sceneId;
    } else {
      break;
    }
  }

  return activeId;
}

export function scrollEditorBlockIntoView(blockId: string): HTMLElement | null {
  const el = document.getElementById(`block-${blockId}`);
  if (!el) return null;

  const scrollRoot = el.closest(`[${EDITOR_SCROLL_ROOT_ATTR}]`);
  if (!(scrollRoot instanceof HTMLElement)) return el;

  const rootRect = scrollRoot.getBoundingClientRect();
  const elementRect = el.getBoundingClientRect();
  const topInset = getEditorScrollTopInset(scrollRoot);
  const scrollOffset =
    scrollRoot.scrollTop + elementRect.top - rootRect.top - topInset;

  scrollRoot.scrollTo({
    top: Math.max(0, scrollOffset),
    behavior: "smooth",
  });

  return el;
}
