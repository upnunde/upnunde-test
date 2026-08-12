import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

/** 분석·수익 `주요통계` 카드 행 — 카드 min 160px, 공간 부족 시 줄바꿈 */
export const ANALYTICS_KEY_STATS_ROW_CLASS =
  "inline-flex min-h-0 min-w-0 flex-1 flex-wrap items-stretch justify-start self-stretch";

export const ANALYTICS_KEY_STAT_BUTTON_CLASS =
  `min-w-[160px] flex-[1_1_160px] self-stretch border-b border-border py-10 inline-flex flex-col items-center justify-start gap-1 ${PAGE_FLUSH_CONTENT_PAD_X_CLASS}`;

export const ANALYTICS_KEY_STAT_LABEL_CLASS =
  "w-full min-w-0 break-words text-center text-body3_500 text-foreground-muted";

export const ANALYTICS_KEY_STAT_VALUE_CLASS =
  "w-full min-w-0 break-words text-center text-heading2_700 text-foreground";

export const ANALYTICS_KEY_STAT_DELTA_CLASS =
  "w-full min-w-0 break-words text-center text-body3_400";

/** 주요통계 타일 — 포인터·키보드 포커스 전환 */
export const ANALYTICS_KEY_STAT_BUTTON_INTERACTION_CLASS =
  "cursor-pointer text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/**
 * 주요통계 타일 표면
 * - 선택: `bg-background-muted` (`--background-muted` · grayscale-10) — 선택 타일을 muted로 눌린 느낌
 * - 비선택: `bg-background`
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
