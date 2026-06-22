import { isMobileDocumentScrollMode } from "@/lib/mobile-document-scroll";

/** 에디터 본문 스크롤 루트 식별자 */
export const EDITOR_SCROLL_ROOT_ATTR = "data-editor-scroll-root";

export function findEditorScrollRoot(): HTMLElement | null {
  const root = document.querySelector(`[${EDITOR_SCROLL_ROOT_ATTR}]`);
  return root instanceof HTMLElement ? root : null;
}

/** 모바일 에디터 — 문서(body) 스크롤 대신 본문 루트 내부 스크롤 사용 여부 */
export function usesEditorDocumentScroll(): boolean {
  if (!isMobileDocumentScrollMode()) return false;
  const root = findEditorScrollRoot();
  if (!root) return true;
  const { overflowY } = getComputedStyle(root);
  return overflowY !== "auto" && overflowY !== "scroll";
}

/** 모바일 에디터 편집 셸 — 글로벌 헤더 아래 남은 높이 · 본문만 내부 스크롤 */
export const EDITOR_MOBILE_EDIT_SHELL_TRAP_CLASS =
  "max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:overflow-hidden";

/** 모바일 에디터 페이지 루트 — 뷰포트 높이 고정(문서 스크롤 차단) */
export const EDITOR_MOBILE_PAGE_ROOT_TRAP_CLASS =
  "max-lg:h-dvh max-lg:max-h-dvh max-lg:overflow-hidden";

/** 모바일 에디터 본문 스크롤 루트 — 서브헤더·장면 탭 아래 overflow 트랩 */
export const EDITOR_MOBILE_SCROLL_ROOT_TRAP_CLASS =
  "max-lg:flex-1 max-lg:min-h-0 max-lg:overflow-y-auto max-lg:overscroll-contain";

export const EDITOR_SCENE_TAB_STRIP_ID = "editor-scene-tab-strip";

/** 모바일 — 장면 탭 + 생성기 버튼 등 스크롤 상단 고정 영역 */
export const EDITOR_SCENE_HEADER_ID = "editor-scene-header";

/** 모바일 — 서브헤더 sticky 셸 (숨김 높이 변화 감지용) */
export const EDITOR_SUB_HEADER_SHELL_ID = "editor-sub-header-shell";

/** 모바일 에디터 서브헤더 높이(px) — h-14 */
export const EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX = 56;

/** @deprecated 내부 스크롤 전환 후 미사용 — 하위 호환용 빈 문자열 */
export const EDITOR_MOBILE_STICKY_CHROME_Z_CLASS = "";

/** @deprecated `EDITOR_MOBILE_EDIT_SHELL_TRAP_CLASS` 사용 */
export const EDITOR_MOBILE_WORKSPACE_PANEL_CLASS = "";

/** @deprecated 모바일 에디터는 sticky 대신 셸 트랩 + 내부 스크롤 */
export const EDITOR_SUB_HEADER_STICKY_CLASS = "max-lg:shrink-0";

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

/** 모바일 에디터 서브헤더 내부 — 숨김 오프셋만큼 위로 이동 (transform은 sticky 스택을 깨므로 margin 사용) */
export const EDITOR_MOBILE_SUB_HEADER_INNER_CLASS =
  "max-lg:-mt-[var(--editor-sub-header-hide,0px)]";

/** 모바일 장면 탭·생성기 버튼 셸 — 스크롤 루트 위 고정(shrink-0) */
export function editorMobileSceneHeaderShellClass() {
  return [
    "relative hidden w-full shrink-0 overflow-visible border-b border-border-10 bg-white",
  ].join(" ");
}

const EDITOR_GLOBAL_HEADER_PX = 56;
const EDITOR_SCROLL_ANCHOR_GAP_PX = 8;
/** 장면 탭 strip 기본 높이(px) — 측정 실패 시 fallback */
const EDITOR_SCENE_TAB_STRIP_FALLBACK_PX = 48;

/** main에 설정된 서브헤더 숨김(px) — sticky 겹침 시 rect 대신 사용 */
export function getEditorMobileSubHeaderHidePx(): number {
  if (typeof document === "undefined") return 0;

  const el =
    document.getElementById(EDITOR_SCENE_HEADER_ID) ??
    document.querySelector("main");
  if (!el) return 0;

  const raw = getComputedStyle(el).getPropertyValue(EDITOR_SUB_HEADER_HIDE_VAR).trim();
  if (!raw) return 0;

  const parsed = parseFloat(raw);
  if (!Number.isFinite(parsed)) return 0;

  return Math.max(0, Math.min(EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX, parsed));
}

function getEditorSceneTabStripHeightPx(): number {
  const tabStrip = document.getElementById(EDITOR_SCENE_TAB_STRIP_ID);
  if (!tabStrip) return 0;

  const height = tabStrip.getBoundingClientRect().height;
  return height > 0 ? height : EDITOR_SCENE_TAB_STRIP_FALLBACK_PX;
}

/**
 * 모바일 sticky 크롬 기준 앵커 Y(px).
 * `#editor-scene-header` rect는 서브헤더·탭 펼침 시 겹쳐 오측정되므로, 고정 높이 + hide 변수로 계산한다.
 */
function getEditorMobileStickyChromeAnchorViewportY(): number {
  const hidePx = getEditorMobileSubHeaderHidePx();
  const visibleSubHeader = EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX - hidePx;
  const tabStrip = document.getElementById(EDITOR_SCENE_TAB_STRIP_ID);

  if (tabStrip) {
    return (
      EDITOR_GLOBAL_HEADER_PX +
      visibleSubHeader +
      getEditorSceneTabStripHeightPx() +
      EDITOR_SCROLL_ANCHOR_GAP_PX
    );
  }

  return EDITOR_GLOBAL_HEADER_PX + visibleSubHeader + EDITOR_SCROLL_ANCHOR_GAP_PX;
}

function getEditorScrollAnchorElement(): HTMLElement | null {
  return document.getElementById(EDITOR_SCENE_TAB_STRIP_ID);
}

/** 장면 탭·고정 헤더 하단 기준 뷰포트 Y(px) — 모바일 문서 스크롤(레거시) */
export function getEditorScrollAnchorViewportY(): number {
  if (usesEditorDocumentScroll()) {
    return getEditorMobileStickyChromeAnchorViewportY();
  }

  const gap = EDITOR_SCROLL_ANCHOR_GAP_PX;
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
  const gap = EDITOR_SCROLL_ANCHOR_GAP_PX;
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
  if (usesEditorDocumentScroll()) {
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

const MOBILE_KEYBOARD_INPUT_SCROLL_GAP_PX = 12;

/** 모바일 키보드 편집 — 크롬·키보드 사이에 입력란이 보이도록 스크롤 보정 */
export function scrollMobileEditorInputIntoView(target: HTMLElement): void {
  if (!isMobileDocumentScrollMode()) return;

  const scrollRoot = target.closest(`[${EDITOR_SCROLL_ROOT_ATTR}]`);
  if (!(scrollRoot instanceof HTMLElement)) return;

  const vv = window.visualViewport;
  if (!vv) return;

  const rect = target.getBoundingClientRect();
  const visibleBottom = vv.offsetTop + vv.height - MOBILE_KEYBOARD_INPUT_SCROLL_GAP_PX;

  if (usesEditorDocumentScroll()) {
    const anchorTop = getEditorScrollAnchorViewportY();
    let delta = 0;
    if (rect.top < anchorTop) {
      delta = rect.top - anchorTop;
    } else if (rect.bottom > visibleBottom) {
      delta = rect.bottom - visibleBottom;
    }
    if (delta !== 0) {
      window.scrollBy({ top: delta, behavior: "auto" });
    }
    return;
  }

  const rootRect = scrollRoot.getBoundingClientRect();
  const anchorTop = rootRect.top + getEditorScrollTopInset(scrollRoot);
  let delta = 0;
  if (rect.top < anchorTop) {
    delta = rect.top - anchorTop;
  } else if (rect.bottom > visibleBottom) {
    delta = rect.bottom - visibleBottom;
  }
  if (delta !== 0) {
    scrollRoot.scrollBy({ top: delta, behavior: "auto" });
  }
}

export type EditorBlockScrollAlign = "start" | "center";

export function scrollEditorBlockIntoView(
  blockId: string,
  options?: { align?: EditorBlockScrollAlign },
): HTMLElement | null {
  const align = options?.align ?? "start";
  const el = document.getElementById(`block-${blockId}`);
  if (!el) return null;

  const scrollRoot = el.closest(`[${EDITOR_SCROLL_ROOT_ATTR}]`);
  if (!(scrollRoot instanceof HTMLElement)) return el;

  const elementRect = el.getBoundingClientRect();

  if (align === "center") {
    if (usesEditorDocumentScroll()) {
      const vv = window.visualViewport;
      const viewportTop = vv?.offsetTop ?? 0;
      const viewportHeight = vv?.height ?? window.innerHeight;
      const visibleCenterY = viewportTop + viewportHeight / 2;
      const elementCenterY = elementRect.top + elementRect.height / 2;
      window.scrollBy({
        top: elementCenterY - visibleCenterY,
        behavior: "smooth",
      });
      return el;
    }

    const rootRect = scrollRoot.getBoundingClientRect();
    const visibleCenterY = rootRect.top + rootRect.height / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;
    scrollRoot.scrollBy({
      top: elementCenterY - visibleCenterY,
      behavior: "smooth",
    });
    return el;
  }

  if (usesEditorDocumentScroll()) {
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
