import { chipVariants } from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

/** 분석 상단 필터 바 셸 — 페이지 `max-w-[1200px] px-5` 안에서 사용 */
export const analyticsScopeFilterShellClassName = cn("flex w-full flex-col gap-my-8");

/** 섹션 헤더 보조 링크(수익 분석 등) — outline default M / h-8(32px) */
export const analyticsOutlineChipClassName = chipVariants({
  chipType: "outline",
  variant: "default",
  corner: "square",
  size: "m",
  icon: false,
});

/** 분석 상단 기간 피커 인라인 트리거 */
export const analyticsPeriodInlineTriggerClassName = cn(
  "inline-flex h-9 min-w-20 shrink-0 cursor-pointer items-center justify-center gap-my-8 overflow-hidden rounded-md border-0 bg-transparent px-0 text-body2_500 text-on-surface-20 shadow-none transition-colors hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[state=open]:bg-transparent",
);

/** 필터 행 구분선 */
export const analyticsScopeFilterDividerClassName = "mx-2 h-9 w-px shrink-0 bg-divider-10";

/**
 * 상위 컨트롤(시리즈 가로 탭 등) 옆에 붙는 보조 드롭다운 트리거.
 * Chip 스펙 밖 — ghost 형태 유지.
 */
export const analyticsGhostDropdownChipClassName = cn(
  "inline-flex h-9 min-w-0 shrink-0 cursor-pointer items-center justify-center gap-my-4 rounded-md border-0 bg-transparent px-my-12 text-body2_500 text-on-surface-30 transition-colors hover:bg-surface-20 hover:text-on-surface-10 data-[state=open]:bg-surface-20 data-[state=open]:text-on-surface-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);
