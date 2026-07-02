import {
  CONTROL_HEIGHT_CLASS,
  CONTROL_HEIGHT_FORM_CLASS,
  CONTROL_HEIGHT_STANDARD_CLASS,
} from "@/lib/chip-styles";
import { cn } from "design-system/utils";

/** Figma `tab` · `tab instance` size (구 h48/h40/h32 → 서비스 42/36/32px) */
export type TabSize = "xl" | "l" | "m";

/** Figma `tab instance` data-height 토큰 (문서·디버그용) */
export type TabHeightToken = "h48" | "h40" | "h32";

export const TAB_SIZE_META: Record<
  TabSize,
  { heightToken: TabHeightToken; heightClass: string; labelClass: string; listGapClass: string }
> = {
  xl: {
    heightToken: "h48",
    heightClass: CONTROL_HEIGHT_FORM_CLASS,
    labelClass: "text-heading4_700",
    /** Figma `tab` XL 행 — 탭 사이 spacing-20(20px) */
    listGapClass: "gap-5",
  },
  l: {
    heightToken: "h40",
    heightClass: CONTROL_HEIGHT_STANDARD_CLASS,
    labelClass: "text-body1_700",
    /** Figma `tab` L 행 — spacing-16(16px) */
    listGapClass: "gap-4",
  },
  m: {
    heightToken: "h32",
    heightClass: CONTROL_HEIGHT_CLASS,
    labelClass: "text-body3_700",
    /** Figma `tab` M 행 — spacing-12(12px) */
    listGapClass: "gap-3",
  },
};

/** Figma `tab` — underline=true일 때 탭 목록 트랙 하단선 */
export const TAB_LIST_TRACK_UNDERLINE_CLASS = "border-b border-border";

/** PageCard 상단 라인 탭(`tabsVariant="line"`) — 알림·시리즈 폼·문의 등 공통 */
export function lineTabStripListClassName(
  size: TabSize,
  className?: string,
): string {
  return cn(
    "-mb-px w-full min-w-0 self-stretch",
    TAB_SIZE_META[size].listGapClass,
    TAB_LIST_TRACK_UNDERLINE_CLASS,
    HORIZONTAL_SCROLLBAR_HIDE_CLASS,
    className,
  );
}

/** PageCard 라인 탭 스트립 좌우 인셋 — spacing-16 (16px) */
export const LINE_TAB_STRIP_PAD_X_CLASS = "px-4";

/** PageCard 내부 라인 탭 스트립 래퍼 */
export const LINE_TAB_STRIP_SHELL_CLASS = `self-stretch pb-0 pt-0 ${LINE_TAB_STRIP_PAD_X_CLASS}`;

/** 가로 스크롤 탭·칩 행 — 스크롤바 비노출 (스와이프·휠 스크롤은 유지) */
export const HORIZONTAL_SCROLLBAR_HIDE_CLASS =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

export interface TabInstanceStyleOptions {
  activated: boolean;
  /** Figma `selectline` — 활성 탭만 border-b-2 */
  selectline: boolean;
  size: TabSize;
}

/** Figma `tab instance` 단일 탭 버튼 */
export function tabInstanceClassName({
  activated,
  selectline,
  size,
}: TabInstanceStyleOptions): string {
  const { heightClass, labelClass } = TAB_SIZE_META[size];
  return cn(
    "inline-flex min-w-0 shrink-0 items-center justify-center gap-2 px-0 font-['Pretendard_JP',sans-serif] transition-colors",
    heightClass,
    labelClass,
    selectline && activated && "border-b-2 border-border-strong",
    selectline && !activated && "border-transparent",
    activated ? "text-foreground" : "text-foreground-disabled",
  );
}

export function tabListClassName({
  size,
  underline,
  className,
}: {
  size: TabSize;
  underline: boolean;
  className?: string;
}): string {
  const { listGapClass } = TAB_SIZE_META[size];
  return cn(
    "inline-flex max-w-full min-w-0 items-center justify-start overflow-x-auto overflow-y-visible",
    listGapClass,
    underline && cn("-mb-px w-full min-w-0", TAB_LIST_TRACK_UNDERLINE_CLASS),
    className,
  );
}
