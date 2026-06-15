import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";

/** 분석·수익 `주요통계` 카드 행 — 카드 min 160px, 공간 부족 시 줄바꿈 */
export const ANALYTICS_KEY_STATS_ROW_CLASS =
  "inline-flex min-h-0 min-w-0 flex-1 flex-wrap items-stretch justify-start self-stretch";

export const ANALYTICS_KEY_STAT_BUTTON_CLASS =
  `min-w-[160px] flex-[1_1_160px] self-stretch border-b border-border-10 py-my-40 inline-flex flex-col items-center justify-start gap-my-4 ${PAGE_FLUSH_CONTENT_PAD_X_CLASS}`;

export const ANALYTICS_KEY_STAT_LABEL_CLASS =
  "w-full min-w-0 break-words text-center text-body3_500 text-on-surface-20";

export const ANALYTICS_KEY_STAT_VALUE_CLASS =
  "w-full min-w-0 break-words text-center text-heading2_700 text-on-surface-10";

export const ANALYTICS_KEY_STAT_DELTA_CLASS =
  "w-full min-w-0 break-words text-center text-body3_400";
