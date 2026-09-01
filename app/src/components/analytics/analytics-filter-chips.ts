import {
  chipVariants,
  CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS,
  CONTROL_HEIGHT_CLASS,
} from "@/lib/chip-styles";
import { cn } from "design-system/utils";

/** 분석 필터 행 칩·드롭다운 — 모바일 32px · lg+ 36px */
export const analyticsFilterControlResponsiveClassName = cn(
  CONTROL_HEIGHT_CLASS,
  "text-body3_500 lg:h-9 lg:min-h-9 lg:text-body1_500",
);

/** FilterChip L 행 — 모바일 M(32px) 패딩 · lg+ L(36px) 패딩 */
export const analyticsFilterChipResponsiveClassName = cn(
  analyticsFilterControlResponsiveClassName,
  "px-3 lg:px-4",
);

/** 분석 상단 필터 바 셸 — 행 간격 8px (`gap-2`) */
export const analyticsScopeFilterShellClassName = cn(
  "flex w-full flex-col",
  "gap-2",
);

/** 분석 필터 행·칩 그룹 가로 간격 — 모바일 4px · lg+ 8px */
export const analyticsScopeFilterGroupGapClassName = CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS;

/** 섹션 헤더 보조 링크(수익 분석 등) — outline default M / h-8(32px) */
export const analyticsOutlineChipClassName = chipVariants({
  chipType: "outline",
  variant: "default",
  corner: "square",
  size: "m",
  icon: false,
});

/**
 * 분석 상단 기간 피커 인라인 트리거.
 * - 모바일 (`max-md`): 네이버항공권형 메타 행 — 보더 없이 날짜 텍스트 + 셰브론
 * - 태블릿·데스크톱 (`md+`): DS outline 버튼 (동일 구조)
 */
export const analyticsPeriodInlineTriggerClassName = cn(
  "inline-flex min-w-0 shrink-0 cursor-pointer items-center select-none outline-none transition-colors",
  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  // 모바일 — 텍스트 + 셰브론
  "max-md:h-auto max-md:gap-1 max-md:border-0 max-md:bg-transparent max-md:px-0 max-md:py-1",
  "max-md:text-body2_500 max-md:text-foreground max-md:hover:bg-transparent max-md:hover:text-foreground",
  "max-md:aria-expanded:bg-transparent",
  // 태블릿·데스크톱 — outline 버튼
  "md:gap-2 md:overflow-hidden",
  "md:border md:border-border md:bg-transparent md:hover:bg-muted md:hover:text-foreground",
  "md:aria-expanded:bg-muted md:aria-expanded:text-foreground",
  "md:rounded-md md:h-9 md:px-2.5 md:text-sm md:font-medium",
  "md:dark:border-border-emphasis md:dark:hover:bg-muted",
);

/** 필터 행 구분선 — 모바일 32px · lg+ 36px */
export const analyticsScopeFilterDividerClassName =
  "mx-2 h-8 w-px shrink-0 bg-divider lg:h-9";

/**
 * 상위 컨트롤(시리즈 가로 탭 등) 옆에 붙는 보조 드롭다운 트리거.
 * Chip 스펙 밖 — ghost 형태 유지.
 */
export const analyticsGhostDropdownChipClassName = cn(
  "inline-flex h-9 min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border-0 bg-transparent px-3 text-body2_500 text-foreground-placeholder transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);
