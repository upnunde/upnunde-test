import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

/**
 * 모바일·태블릿 주요통계 타일 그룹 — Title2 아래·좌우·아래 인셋
 * `@container` 1·2열 전환은 모바일만. 데스크톱(`lg+`)은 셸 인셋 없음.
 */
export const ANALYTICS_KEY_STATS_GROUP_SHELL_CLASS =
  "flex w-full flex-col self-stretch max-md:@container max-lg:px-5 max-lg:pb-3 max-lg:pt-3";

/**
 * 분석·수익 `주요통계` 카드 행
 * - 모바일 · 컨테이너 &lt; 320(2×160): 1열
 * - 모바일 · 컨테이너 ≥ 320: 2열
 * - 태블릿(768–1023): 6열 그리드 — 상단 3칸(span2)·하단 2칸(span3)으로 가로 fill
 * - 데스크톱(≥1024): flex wrap · min 160px
 */
export const ANALYTICS_KEY_STATS_ROW_CLASS = cn(
  "min-h-0 min-w-0 flex-1 self-stretch",
  "max-md:grid max-md:grid-cols-1 max-md:overflow-hidden max-md:rounded-sm max-md:border max-md:border-border",
  "max-md:@min-[320px]:grid-cols-[repeat(2,minmax(160px,1fr))] max-md:@min-[320px]:overflow-x-auto max-md:@min-[320px]:overscroll-x-contain",
  "md:max-lg:grid md:max-lg:grid-cols-6 md:max-lg:overflow-hidden md:max-lg:rounded-sm md:max-lg:border md:max-lg:border-border",
  "lg:inline-flex lg:flex-wrap lg:items-stretch lg:justify-start",
);

/**
 * 타일 버튼
 * - 1열(좁은 모바일): 전체 폭
 * - 2열·데스크톱: min 160px · 태블릿·데스크톱 py-10
 * - 태블릿: 앞 3개 span2, 4번째부터 span3(하단 fill) · 행 끝 우측 보더 제거
 */
export const ANALYTICS_KEY_STAT_BUTTON_CLASS = cn(
  "self-stretch border-b border-border inline-flex flex-col items-center justify-start gap-1",
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  "min-w-0 max-md:w-full max-md:py-4",
  "max-md:@min-[320px]:min-w-[160px] max-md:@min-[320px]:odd:border-r",
  "md:max-lg:col-span-2 md:max-lg:min-w-0 md:max-lg:w-full md:max-lg:border-r md:max-lg:py-10",
  "md:max-lg:[&:nth-child(n+4)]:col-span-3 md:max-lg:[&:nth-child(3)]:border-r-0 md:max-lg:[&:nth-child(5)]:border-r-0 md:max-lg:last:border-r-0",
  "lg:col-auto lg:min-w-[160px] lg:flex-[1_1_160px] lg:py-10",
);

export const ANALYTICS_KEY_STAT_LABEL_CLASS =
  "w-full min-w-0 break-words text-center text-body3_500 text-foreground-muted";

export const ANALYTICS_KEY_STAT_VALUE_CLASS =
  "w-full min-w-0 break-words text-center text-heading3_700 md:text-heading2_700 text-foreground";

export const ANALYTICS_KEY_STAT_DELTA_CLASS =
  "w-full min-w-0 break-words text-center text-body3_400";

/** 주요통계 아래 추이 차트 블록 — 모바일만 상하 패딩 축소 */
export const ANALYTICS_KEY_STATS_CHART_SHELL_CLASS =
  "flex flex-col items-stretch gap-3 self-stretch px-0 py-5 md:py-10";

/** 주요통계 타일 — 포인터·키보드 포커스 전환 */
export const ANALYTICS_KEY_STAT_BUTTON_INTERACTION_CLASS =
  "cursor-pointer text-left transition-colors outline-none aria-[pressed=false]:hover:bg-muted-low focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/**
 * 주요통계 타일 표면
 * - 선택: `bg-background-muted` (`--background-muted` · grayscale-10) — 선택 타일을 muted로 눌린 느낌
 * - 비선택: `bg-background` + hover 시 `bg-muted-low`
 */
export function analyticsKeyStatButtonStateClass(selected: boolean): string {
  return selected ? "z-0 bg-background-muted" : "bg-background";
}

/** @deprecated `ANALYTICS_KEY_STAT_LABEL_CLASS` — 하위 호환 */
export function analyticsKeyStatLabelClass(_selected?: boolean): string {
  return ANALYTICS_KEY_STAT_LABEL_CLASS;
}

/** @deprecated `ANALYTICS_KEY_STAT_VALUE_CLASS` — 하위 호환 */
export function analyticsKeyStatValueClass(_selected?: boolean): string {
  return ANALYTICS_KEY_STAT_VALUE_CLASS;
}
