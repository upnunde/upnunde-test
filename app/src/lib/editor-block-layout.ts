/** 블록 행 번호 열 — 모바일 32px, 데스크톱 36px */
export const EDITOR_BLOCK_INDEX_COLUMN_CLASS = "w-9 max-lg:w-8 shrink-0";

/** 에디터 스크롤 루트·블록 행 모바일 좌우 인셋 — 8px */
export const EDITOR_MOBILE_GUTTER_X_CLASS = "max-lg:px-my-8";

/** 블록 타입·라벨 열 — 모바일 80px, 데스크톱 100px */
export const EDITOR_BLOCK_LABEL_COLUMN_CLASS = "w-[100px] max-lg:w-[80px] shrink-0";

/** 텍스트 블록 화자 열 — 모바일 80px, 데스크톱 100px */
export const EDITOR_BLOCK_SPEAKER_COLUMN_CLASS =
  "w-[100px] max-lg:w-[80px] min-w-14 shrink-0";

/** 장면·장면정보 값 필드 — 긴 제목·식별자 줄바꿈 */
export const EDITOR_SCENE_VALUE_FIELD_CLASS =
  "min-h-8 h-fit min-w-0 w-full flex-1 resize-none overflow-hidden border-0 bg-transparent px-0 pt-my-4 pb-0 text-on-surface-10 outline-none placeholder:text-on-surface-30 focus:outline-none focus:ring-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere]";

/** 장면 제목 typography — globals.css `.editor-scene-title-typography`와 쌍 */
export const EDITOR_SCENE_TITLE_TYPOGRAPHY_CLASS = "editor-scene-title-typography";

/** 장면 제목 값 래퍼 — min-height 32px · 줄 수에 따라 높이 확장 */
export const EDITOR_SCENE_TITLE_FIELD_SHELL_CLASS =
  "editor-scene-title-field-shell flex min-w-0 w-full flex-1 self-start items-start max-lg:min-h-8 lg:min-h-[34px]";

/** 장면 제목 표시·입력 공통 */
export const EDITOR_SCENE_TITLE_DISPLAY_CLASS =
  "block w-full min-h-8 min-w-0 resize-none overflow-hidden border-0 bg-transparent px-0 py-0 editor-scene-title-typography text-on-surface-10 whitespace-pre-wrap break-words [overflow-wrap:anywhere]";

/** 장면 제목 입력 */
export const EDITOR_SCENE_TITLE_INPUT_CLASS =
  "block w-full min-h-8 min-w-0 resize-none overflow-hidden border-0 bg-transparent px-0 py-0 editor-scene-title-typography text-on-surface-10 placeholder:text-on-surface-30 outline-none transition-colors focus:outline-none focus:ring-0 cursor-text whitespace-pre-wrap break-words [overflow-wrap:anywhere]";

/**
 * 모바일 입력 16px 강제 규칙(`globals.css`) 예외 — 장면 제목 typography 유지
 * @see EDITOR_SCENE_TITLE_TYPOGRAPHY_CLASS
 */
export const EDITOR_SCENE_TITLE_TYPOGRAPHY_INPUT_ATTR = "data-editor-typography-input";
export const EDITOR_SCENE_TITLE_TYPOGRAPHY_INPUT_VALUE = "scene-title";

/** 장면정보 값 표시 */
export const EDITOR_TOP_DESC_DISPLAY_CLASS =
  "min-w-0 flex-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-body1_500 text-on-surface-10 pt-my-4 pb-0";

/** 장면정보 입력 */
export const EDITOR_TOP_DESC_INPUT_CLASS =
  "min-w-0 flex-1 h-8 min-h-8 max-w-full rounded-md border-0 bg-transparent px-0 pt-my-4 pb-0 text-body1_500 text-on-surface-10 placeholder:text-on-surface-30 outline-none transition-colors focus:outline-none focus:ring-0";
