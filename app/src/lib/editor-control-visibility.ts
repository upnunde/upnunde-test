import { cn } from "@/lib/utils";

/**
 * 에디터 블록 행 보조 컨트롤 노출 규칙
 *
 * ## 데스크톱 (hover 가능)
 * - + · 삭제 · 드래그 핸들: 행 hover 또는 focus-within 시 페이드인
 *
 * ## 모바일
 * - 좌측 + · 드래그 · 행 삭제: **렌더하지 않음** → `EditorMobileBlockToolbar`
 * - 드래그: 번호 열 길게 눌러 순서 변경
 * - 행 hover 하이라이트 없음
 */

/** 블록 행 hover·포커스 배경 — 데스크톱만 (모바일은 focusBlockId 기반 하이라이트) */
export function editorRowHoverClass() {
  return "lg:hover:bg-surface-20/50 lg:focus-within:bg-surface-20/50";
}

/** 모바일 블록·필드 선택 하이라이트 — 데스크톱 행 hover와 동일 */
export const EDITOR_MOBILE_ACTIVE_SURFACE_CLASS = "bg-surface-20/50";

/** 모바일 포커스된 블록 행 배경 */
export const EDITOR_MOBILE_FOCUSED_ROW_CLASS = "max-lg:bg-surface-20/50";

/** 좌측 + · 드래그 핸들 — 데스크톱 전용 (`lg` 미만에서는 렌더하지 않음) */
export function editorLeadingControlsClass() {
  return cn(
    "relative hidden shrink-0 items-center justify-start gap-0 opacity-0 transition-opacity",
    "lg:flex lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
  );
}

/** 우측 삭제 — text · choice (`group/row`), 데스크톱만 */
export function editorRowTrailingActionClass() {
  return cn(
    "max-lg:hidden opacity-0 transition-opacity",
    "lg:group-hover/row:opacity-100 lg:group-focus-within/row:opacity-100",
  );
}

/** 우측 삭제 — compact 한 줄 블록 (`group`), 데스크톱만 */
export function editorBlockTrailingActionClass() {
  return cn(
    "max-lg:hidden opacity-0 transition-opacity",
    "lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
  );
}
