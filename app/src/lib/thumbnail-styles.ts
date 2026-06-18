import { cn } from "@/lib/utils";

/** label 내부 file input — `hidden`/`display:none` 대신 투명 오버레이 (OS 파일 선택창 안정 동작) */
export const RESOURCE_FILE_INPUT_OVERLAY_CLASS =
  "absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0";

/** 썸네일 슬롯(AddResourceSlot·SeriesImageUploadField 등) 접근성 라벨 — 일반 파일 첨부와 구분 */
export const THUMBNAIL_SLOT_ARIA = {
  addImage: "이미지 추가",
  /** @deprecated 리소스 종류별 `… 이미지 추가` 라벨 사용 */
  addRepresentativeThumbnail: "이미지 추가",
  addRepresentativeImage: "대표 이미지 추가",
  addBackgroundImage: "배경 이미지 추가",
  addSceneImage: "연출 이미지 추가",
  addMediaImage: "미디어 이미지 추가",
  addMediaFile: "미디어 파일 추가",
  addPreviewImage: "미리보기 이미지 추가",
  addGalleryImage: "갤러리 이미지 추가",
  addCharacterImage: "캐릭터 이미지 추가",
  addLogo: "로고 이미지 추가",
  addExpression: "표정 추가",
} as const;

/** 썸네일 이미지 위 #000000 2% 딤 — `surface-disabled` 토큰 */
export const THUMBNAIL_DIM_OVERLAY_CLASS =
  "pointer-events-none absolute inset-0 z-[1] bg-surface-disabled";

/** 썸네일 호버 오버레이·액션 — PC group-hover (모바일 그리드는 ResourceThumbnailActions ⋮ 메뉴) */
export function thumbnailHoverRevealClass(forceVisible = false): string {
  return cn(
    "transition-opacity",
    forceVisible ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100",
  );
}

/** 모달 크롭·미리보기 스테이지 — 최대 400×400px, 작은 화면에서는 뷰포트에 맞춰 축소 */
export const MODAL_CROP_STAGE_SIZE_PX = 400;

export const MODAL_CROP_STAGE_CLASS =
  "relative aspect-square w-[min(400px,calc(100vw-48px),calc(100dvh-240px))] shrink-0 self-center overflow-hidden rounded-lg bg-neutral-900";

/** 리소스 섹션 썸네일 그리드 — 셀 min 90px · 1fr fill · 가로 8/16 · 세로 20 */
export const RESOURCE_THUMBNAIL_GRID_CLASS =
  "grid w-full grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-x-my-8 gap-y-my-20 self-stretch rounded-[4px] p-0 lg:gap-x-my-16";

/** 에디터 리소스 피커(모바일 바텀시트) — ResourceSection 본문과 동일 그리드·인셋 */
export const RESOURCE_PICKER_SHEET_GRID_CLASS = cn(
  RESOURCE_THUMBNAIL_GRID_CLASS,
  "px-my-20 py-my-20",
);

/** `RESOURCE_THUMBNAIL_GRID_CLASS` 열 수 추정 — 피커 키보드 그리드 이동용 */
export function estimateResourceThumbnailGridColumns(contentWidthPx: number): number {
  const gap = 8;
  const minCell = 90;
  return Math.max(1, Math.floor((contentWidthPx + gap) / (minCell + gap)));
}

/** 9:16 고정 썸네일 — 에피소드 폼·상세 등 리소스 그리드 외 화면 */
export const RESOURCE_THUMBNAIL_FIXED_9_16_CLASS = "w-[90px] h-[160px]";

/** 9:16 그리드 셀 — 리소스 관리 페이지 그리드에서만 셀 너비에 맞춰 확장 */
export const RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS = "aspect-[9/16] h-auto w-full min-h-0";

export const RESOURCE_THUMBNAIL_FLUID_IMAGE_SIZES = "(max-width: 1023px) 25vw, 90px";
export const RESOURCE_THUMBNAIL_FIXED_IMAGE_SIZES = "90px";

/** 리소스 썸네일 라이트박스 — 9:16, 최대 384×640, 모바일 뷰포트 축소 */
export const IMAGE_LIGHTBOX_FRAME_CLASS =
  "relative aspect-[9/16] w-[min(384px,calc(100vw-4rem),calc((100dvh-12rem)*9/16))] shrink-0 overflow-hidden rounded-[4px] outline outline-4 outline-offset-[-4px] outline-white shadow-elevation-50";

export const IMAGE_LIGHTBOX_IMAGE_SIZES = "(max-width: 512px) 90vw, 384px";

export const IMAGE_LIGHTBOX_CHECKERBOARD_STYLE = {
  backgroundColor: "#f8fafc",
  backgroundImage:
    "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
} as const;
