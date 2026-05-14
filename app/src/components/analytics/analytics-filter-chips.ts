import { cn } from "@/lib/utils";

/** 분석 상단 필터 바 셸 — 페이지 `max-w-[1200px] px-5` 안에서 사용 */
export const analyticsScopeFilterShellClassName = cn(
  "flex w-full flex-col gap-1",
);

/**
 * 아웃라인 필터 칩·드롭다운 트리거 공통 스타일.
 * `Button variant="outline" size="lg"`와 함께 쓰거나, 단독 className으로도 사용한다.
 */
export const analyticsOutlineChipClassName = cn(
  "min-w-20 shrink-0 border-divider-10 bg-white px-3 text-sm font-medium text-on-surface-10 shadow-none hover:bg-surface-20 hover:text-on-surface-10",
);

/** 범위 칩 — 선택됨 (다크 필) */
export const analyticsFilledSecondaryChipClassName = cn(
  "inline-flex h-10 min-w-20 cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-md border-0 bg-secondary-secondary px-3 text-sm font-medium leading-5 text-secondary-on-secondary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);

/** 분석 상단 기간 피커 인라인 트리거 */
export const analyticsPeriodInlineTriggerClassName = cn(
  "inline-flex h-10 min-w-20 shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border-0 bg-transparent px-0 text-sm font-medium leading-5 text-on-surface-20 shadow-none transition-colors hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[state=open]:bg-transparent",
);

/** 필터 행 구분선 */
export const analyticsScopeFilterDividerClassName = "h-8 w-px shrink-0 bg-divider-10";

/**
 * 상위 컨트롤(시리즈 가로 탭 등) 옆에 붙는 보조 드롭다운 트리거.
 * 테두리 없는 ghost 형태로 상위 버튼과 시각적 레벨 차이를 둔다.
 */
export const analyticsGhostDropdownChipClassName = cn(
  "inline-flex h-10 min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border-0 bg-transparent px-2 text-sm font-medium text-on-surface-30 transition-colors hover:bg-surface-20 hover:text-on-surface-10 data-[state=open]:bg-surface-20 data-[state=open]:text-on-surface-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);
