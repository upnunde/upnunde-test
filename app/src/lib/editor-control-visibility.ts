import { cn } from "@/lib/utils";

/**
 * 에디터 블록 행 보조 컨트롤 노출 규칙
 *
 * ## 데스크톱 (hover 가능)
 * - + · 삭제 · 드래그 핸들: 행 hover 또는 focus-within 시 페이드인
 *
 * ## 모바일
 * - 좌측 + · 드래그 열: **DOM에서 제거** (`hidden lg:flex`) → `EditorMobileBlockToolbar`
 * - 드래그: 번호 열 길게 눌러 순서 변경
 */

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
    "opacity-0 transition-opacity max-lg:pointer-events-none max-lg:opacity-0",
    "group-hover/row:opacity-100 group-focus-within/row:opacity-100",
  );
}

/** 우측 삭제 — compact 한 줄 블록 (`group`), 데스크톱만 */
export function editorBlockTrailingActionClass() {
  return cn(
    "opacity-0 transition-opacity max-lg:pointer-events-none max-lg:opacity-0",
    "group-hover:opacity-100 group-focus-within:opacity-100",
  );
}
