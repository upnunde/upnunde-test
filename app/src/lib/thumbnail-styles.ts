/** 썸네일 이미지 위 #000000 2% 딤 — `surface-disabled` 토큰 */
export const THUMBNAIL_DIM_OVERLAY_CLASS =
  "pointer-events-none absolute inset-0 z-[1] bg-surface-disabled";

/** 모달 크롭·미리보기 스테이지 — 최대 400×400px, 작은 화면에서는 뷰포트에 맞춰 축소 */
export const MODAL_CROP_STAGE_SIZE_PX = 400;

export const MODAL_CROP_STAGE_CLASS =
  "relative aspect-square w-[min(400px,calc(100vw-48px),calc(100dvh-240px))] shrink-0 self-center overflow-hidden rounded-lg bg-neutral-900";
