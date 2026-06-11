import { cn } from "@/lib/utils";

/** 썸네일 슬롯(AddResourceSlot·SeriesImageUploadField 등) 접근성 라벨 — 일반 파일 첨부와 구분 */
export const THUMBNAIL_SLOT_ARIA = {
  addImage: "이미지 추가",
  addRepresentativeThumbnail: "대표 썸네일 추가",
  addRepresentativeImage: "대표 이미지 추가",
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

/** 9:16 그리드 셀 — 셀 너비에 맞춰 확장 (비율 유지) */
export const RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS = "aspect-[9/16] h-auto w-full min-h-0";
