import { isMobileDocumentScrollMode } from "@/lib/mobile-document-scroll";

/** 에디터 본문 스크롤 루트 식별자 */
export const EDITOR_SCROLL_ROOT_ATTR = "data-editor-scroll-root";

export const EDITOR_SCENE_TAB_STRIP_ID = "editor-scene-tab-strip";

/** 모바일 — 장면 탭 + 생성기 버튼 등 스크롤 상단 고정 영역 */
export const EDITOR_SCENE_HEADER_ID = "editor-scene-header";

/** 모바일 에디터 서브헤더 높이(px) — h-14 */
export const EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX = 56;

/** 모바일 에디터 서브헤더 — 글로벌 헤더(h-14) 바로 아래 sticky */
export const EDITOR_SUB_HEADER_STICKY_CLASS =
  "max-lg:sticky max-lg:top-14 max-lg:z-30";

/** 스크롤 숨김 오프셋 CSS 변수 — 조상(main)에 설정 */
export const EDITOR_SUB_HEADER_HIDE_VAR = "--editor-sub-header-hide";

export function editorMobileSubHeaderHideVarStyle(hiddenPx: number): Record<string, string> {
  return { [EDITOR_SUB_HEADER_HIDE_VAR]: `${hiddenPx}px` };
}

/** 모바일 에디터 서브헤더 셸 — 스크롤 이동량만큼 높이·클립 축소 */
export function editorMobileSubHeaderShellClass(isFullyHidden: boolean) {
  return [
    "w-full shrink-0 overflow-hidden border-b border-border-10 bg-white",
    EDITOR_SUB_HEADER_STICKY_CLASS,
    "max-lg:h-[calc(3.5rem-var(--editor-sub-header-hide,0px))]",
    isFullyHidden ? "max-lg:border-b-0" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** 모바일 에디터 서브헤더 내부 — 숨김 오프셋만큼 위로 이동 */
export const EDITOR_MOBILE_SUB_HEADER_INNER_CLASS =
  "max-lg:[transform:translateY(calc(-1*var(--editor-sub-header-hide,0px)))]";

/**
 * 모바일 장면 탭·생성기 버튼 셸 — 서브헤더 숨김량과 동일하게 sticky top 이동.
 * overflow-hidden 조상 없이 문서 스크롤 시 sticky 유지.
 */
export function editorMobileSceneHeaderShellClass() {
  return [
    "relative hidden w-full shrink-0 overflow-visible border-b border-border-10 bg-white",
    "max-lg:sticky max-lg:top-[calc(7rem-var(--editor-sub-header-hide,0px))] max-lg:z-30",
  ].join(" ");
}

function getEditorScrollAnchorElement(): HTMLElement | null {
  return (
    document.getElementById(EDITOR_SCENE_HEADER_ID) ??
    document.getElementById(EDITOR_SCENE_TAB_STRIP_ID)
  );
}

/** 장면 탭·고정 헤더 하단 기준 뷰포트 Y(px) — 모바일 문서 스크롤 */
export function getEditorScrollAnchorViewportY(): number {
  const gap = 8;
  const anchor = getEditorScrollAnchorElement();
  if (anchor) {
    const anchorRect = anchor.getBoundingClientRect();
    if (anchorRect.height > 0) {
      return anchorRect.bottom + gap;
    }
  }
  return 100;
}

/** 장면 블록이 탭·고정 영역 바로 아래 오도록 스크롤 inset(px) — 데스크톱 내부 스크롤 루트 기준 */
export function getEditorScrollTopInset(scrollRoot: Element): number {
  const gap = 8;
  const anchor = getEditorScrollAnchorElement();

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

/** 활성 장면 판별·블록 스크롤용 앵커 Y(px) */
function getEditorScrollAnchorY(scrollRoot: Element): number {
  if (isMobileDocumentScrollMode()) {
    return getEditorScrollAnchorViewportY();
  }
  const rootRect = scrollRoot.getBoundingClientRect();
  return rootRect.top + getEditorScrollTopInset(scrollRoot);
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

  const anchorY = getEditorScrollAnchorY(scrollRoot);

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

  const elementRect = el.getBoundingClientRect();

  if (isMobileDocumentScrollMode()) {
    const anchorY = getEditorScrollAnchorViewportY();
    window.scrollTo({
      top: Math.max(0, window.scrollY + elementRect.top - anchorY),
      behavior: "smooth",
    });
    return el;
  }

  const rootRect = scrollRoot.getBoundingClientRect();
  const topInset = getEditorScrollTopInset(scrollRoot);
  const scrollOffset =
    scrollRoot.scrollTop + elementRect.top - rootRect.top - topInset;

  scrollRoot.scrollTo({
    top: Math.max(0, scrollOffset),
    behavior: "smooth",
  });

  return el;
}
