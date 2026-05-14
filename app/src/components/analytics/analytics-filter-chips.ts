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

/**
 * 상위 컨트롤(시리즈 가로 탭 등) 옆에 붙는 보조 드롭다운 트리거.
 * 테두리 없는 ghost 형태로 상위 버튼과 시각적 레벨 차이를 둔다.
 */
export const analyticsGhostDropdownChipClassName = cn(
  "inline-flex h-10 min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border-0 bg-transparent px-2 text-sm font-medium text-on-surface-30 transition-colors hover:bg-surface-20 hover:text-on-surface-10 data-[state=open]:bg-surface-20 data-[state=open]:text-on-surface-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);
