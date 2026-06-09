import {
  CONTROL_HEIGHT_CLASS,
  CONTROL_HEIGHT_FORM_CLASS,
  CONTROL_HEIGHT_STANDARD_CLASS,
} from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

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
    listGapClass: "gap-my-20",
  },
  l: {
    heightToken: "h40",
    heightClass: CONTROL_HEIGHT_STANDARD_CLASS,
    labelClass: "text-body1_700",
    /** Figma `tab` L 행 — spacing-16(16px) */
    listGapClass: "gap-my-16",
  },
  m: {
    heightToken: "h32",
    heightClass: CONTROL_HEIGHT_CLASS,
    labelClass: "text-body3_700",
    /** Figma `tab` M 행 — spacing-12(12px) */
    listGapClass: "gap-my-12",
  },
};

/** Figma `tab` — underline=true일 때 탭 목록 트랙 하단선 */
export const TAB_LIST_TRACK_UNDERLINE_CLASS = "border-b border-border-10";

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
    "inline-flex min-w-0 shrink-0 items-center justify-center gap-my-8 px-0 font-['Pretendard_JP',sans-serif] transition-colors",
    heightClass,
    labelClass,
    selectline && activated && "border-b-2 border-border-strong",
    selectline && !activated && "border-transparent",
    activated ? "text-on-surface-10" : "text-on-surface-disabled",
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
