/**
 * VN 미리보기 레이아웃·플레이어 chroma 단일 소스
 * (PreviewScreen · IPhone15ProFrame · EditorMobilePreviewPlayer · SeriesPreviewPanel)
 *
 * 정책:
 * - 플레이어 영역 색은 `preview-player-chroma.css` 고정 팔레트만 사용 (앱 다크모드 무관)
 * - spacing·radius·z-index·typography는 DS 파운데이션 유지
 * - 배경·캐릭터 `<Image>`는 리소스 콘텐츠(시맨틱 색 아님)
 */

/** 미리보기 플레이어 루트 — chroma 격리 스코프 */
export const PREVIEW_PLAYER_ROOT_CLASS = "preview-player-root";

/** iPhone 15 Pro 디바이스 프레임 — 치수·라운드는 도메인 고정값 */
export const PREVIEW_DEVICE_FRAME_OUTER_CLASS =
  "relative flex h-[650px] w-[300px] flex-col overflow-hidden rounded-[2.25rem] preview-bg-frame outline outline-[3px] preview-outline-frame";

export const PREVIEW_DEVICE_FRAME_INNER_CLASS =
  "relative h-full w-full min-h-0 min-w-0 overflow-hidden rounded-[2rem] preview-bg-canvas";

/** PreviewScreen 루트 */
export const PREVIEW_ROOT_CLASS =
  "relative flex h-full min-h-0 w-full flex-shrink-0 items-stretch justify-stretch overflow-hidden overscroll-none preview-player-root preview-bg-canvas";

/** Layer 1 — 배경 (이미지 없을 때도 canvas 단색) */
export const PREVIEW_BG_LAYER_CLASS = "absolute inset-0 z-base preview-bg-canvas";

export const PREVIEW_BG_IMAGE_CLASS = "object-cover object-center";

/** Layer 2 — 캐릭터 스탠딩 */
export const PREVIEW_CHARACTER_LAYER_CLASS =
  "pointer-events-none absolute inset-0 z-dropdown flex items-end justify-center pb-24";

export const PREVIEW_CHARACTER_IMAGE_CLASS =
  "h-auto max-h-[55%] w-auto max-w-[80%] object-contain";

/** 미리보기 상단 플로팅 바 — 진행·top_desc·BGM */
export const PREVIEW_TOP_BAR_CLASS =
  "pointer-events-none absolute inset-x-0 top-0 z-sticky flex h-14 w-full items-center justify-between gap-3 px-4";

export const PREVIEW_PROGRESS_BADGE_CLASS =
  "inline-flex shrink-0 items-center rounded-full preview-bg-dim-20 px-3 py-2 text-caption1_400 preview-text-body backdrop-blur-sm";

export const PREVIEW_TOP_BADGE_CLASS =
  "inline-flex min-h-8 items-center rounded-lg border preview-border-overlay preview-bg-dim-20 px-3 py-2 text-caption1_400 preview-text-body backdrop-blur-sm";

/** 배경 리소스 없을 때 */
export const PREVIEW_EMPTY_SCENE_BG_CLASS = "h-full w-full preview-bg-canvas";

/** 대사·선택지 오버레이 패널 */
export const PREVIEW_DIALOGUE_SHELL_CLASS =
  "border-2 preview-border-overlay preview-bg-dim-30 backdrop-blur-sm";

export const PREVIEW_OVERLAY_PANEL_POSITION_CLASS =
  "absolute bottom-0 left-0 right-0 z-sticky mx-3 mb-3 rounded-sm";

export const PREVIEW_OVERLAY_DIVIDER_CLASS = "border-b preview-border-overlay-subtle";

export const PREVIEW_SPEAKER_TEXT_CLASS = "text-body3_500 preview-text-speaker";

export const PREVIEW_DIALOGUE_BODY_CLASS = "min-h-16 px-4 py-3";

export const PREVIEW_DIALOGUE_TEXT_CLASS =
  "whitespace-pre-wrap text-body3_400 preview-text-body";

/** 선택지 */
export const PREVIEW_CHOICE_SECTION_LABEL_CLASS =
  "mb-2 px-2 text-caption2_500 tracking-wide preview-text-muted";

export const PREVIEW_CHOICE_ITEM_CLASS =
  "rounded-lg border preview-border-overlay preview-bg-dim-20 px-3 py-2";

export const PREVIEW_CHOICE_ITEM_INTERACTIVE_CLASS =
  "preview-choice-interactive w-full text-left";

export const PREVIEW_CHOICE_ITEM_TEXT_CLASS = "text-body3_400 preview-text-body";

/** 모바일 재생 힌트 */
export const PREVIEW_HINT_BADGE_CLASS =
  "rounded-full preview-bg-dim-20 px-3 py-1 text-caption2_400 preview-text-muted backdrop-blur-sm";

export const PREVIEW_END_HINT_BADGE_CLASS =
  "rounded-full preview-bg-dim-20 px-4 py-2 text-caption1_400 preview-text-subtle backdrop-blur-sm";

/** 모바일 풀스크린 미리보기 셸 */
export const PREVIEW_MOBILE_SHELL_CLASS =
  "flex min-h-0 flex-1 flex-col overflow-hidden preview-player-root preview-bg-canvas";
