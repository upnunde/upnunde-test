import { cn } from "@/lib/utils";

/** 기간 드롭다운 트리거·보조 필터 칩 (테두리형) */
export const analyticsOutlineChipClassName = cn(
  "inline-flex h-10 min-w-20 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);

/** 콘텐츠 범위 `전체` 등 채움형 보조 버튼 */
export const analyticsFilledSecondaryChipClassName = cn(
  "inline-flex h-10 min-w-20 cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-md border-0 bg-secondary-secondary px-3 text-secondary-on-secondary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);

/** 범위 칩 중 선택되지 않은 항목 (시리즈·캐릭터 등) */
export const analyticsScopeChipInactiveClassName = cn(
  "flex h-10 min-w-20 cursor-pointer items-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);
