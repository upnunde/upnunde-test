"use client";

import { FilterChip } from "@/components/ui/chip";
import { CHIP_GROUP_GAP_CLASS } from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

export interface SegmentedTextTabItem {
  id: string;
  label: string;
}

/** Figma `tab` size: XL=h48, L=h40, M=h32 */
export type SegmentedTabSize = "xl" | "l" | "m";

export type SegmentedTextTabsVariant = "text" | "chip";

const SIZE_STYLES: Record<
  SegmentedTabSize,
  { tabListGap: string; button: string }
> = {
  xl: {
    tabListGap: "gap-5",
    button: "h-12 min-w-0 gap-2.5 text-xl leading-7",
  },
  l: {
    tabListGap: "gap-4",
    button: "h-10 min-w-0 gap-2.5 text-base leading-6",
  },
  m: {
    tabListGap: "gap-3",
    button: "h-8 min-w-0 gap-2.5 text-sm leading-5",
  },
};

const CHIP_TAB_LIST_GAP = CHIP_GROUP_GAP_CLASS;
const CHIP_FILTER_SIZE: Record<SegmentedTabSize, "l" | "m"> = {
  xl: "l",
  l: "l",
  m: "m",
};

/** 비활성 라벨 — XL/L/M 공통 토큰 */
const INACTIVE_TAB_TEXT = "text-on-surface-disabled";

export interface SegmentedTextTabsProps {
  items: readonly SegmentedTextTabItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  /**
   * Figma `tab`에서 selectline true일 때: 트랙 `border-border-10/5` + 활성 `border-border-strong` 2px.
   * false면 밑줄 없음(인스턴스·탭 모두 텍스트만).
   */
  underline?: boolean;
  /** text: 텍스트 탭 | chip: Figma chips 필터 칩 (M/L) */
  variant?: SegmentedTextTabsVariant;
  /** chip variant 기본값 `m`(h-8) — 패널·카드 하위 필터용 */
  size?: SegmentedTabSize;
  className?: string;
  tabListClassName?: string;
  "aria-label"?: string;
}

/**
 * Figma `tab` / `tab instance` 정합.
 * — 활성/비활성 라벨 모두 `font-bold` (chip variant는 FilterChip)
 * — underline: 트랙 `border-b border-border-10/5`, 활성 탭 `border-b-2 border-border-strong`
 */
export function SegmentedTextTabs({
  items,
  activeId,
  onSelect,
  underline = false,
  variant = "text",
  size,
  className,
  tabListClassName,
  "aria-label": ariaLabel,
}: SegmentedTextTabsProps) {
  const isChip = variant === "chip";
  const resolvedSize: SegmentedTabSize = size ?? (isChip ? "m" : "l");
  const { tabListGap, button: sizeButton } = SIZE_STYLES[resolvedSize];
  const resolvedTabListGap = isChip ? CHIP_TAB_LIST_GAP : tabListGap;
  const chipSize = CHIP_FILTER_SIZE[resolvedSize];

  const tabList = (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex max-w-full min-w-0 items-center justify-start overflow-x-auto overflow-y-visible",
        resolvedTabListGap,
        !isChip && underline && "-mb-px w-full min-w-0",
        tabListClassName,
      )}
    >
      {items.map(({ id, label }) => {
        const isActive = activeId === id;
        const isClickable = !!onSelect;

        if (isChip) {
          return (
            <FilterChip
              key={id}
              role="tab"
              aria-selected={isActive}
              selected={isActive}
              chipSize={chipSize}
              disabled={!isClickable}
              className="min-w-0"
              onClick={() => onSelect?.(id)}
            >
              {label}
            </FilterChip>
          );
        }

        const state = underline
          ? isActive
            ? "border-border-strong text-on-surface-10"
            : cn(
                "border-transparent",
                INACTIVE_TAB_TEXT,
                isClickable && "hover:text-on-surface-20",
              )
          : isActive
            ? "text-on-surface-10"
            : cn(INACTIVE_TAB_TEXT, isClickable && "hover:text-on-surface-20");
        const line = underline ? "border-b-2" : "";

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "flex items-center justify-center px-0 font-bold font-['Pretendard_JP',sans-serif] transition-colors",
              isClickable ? "cursor-pointer" : "cursor-default",
              sizeButton,
              line,
              state,
            )}
            onClick={() => onSelect?.(id)}
          >
            <span className="justify-start whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={cn(className)}>
      {!isChip && underline ? (
        <div className="w-full min-w-0 border-b border-border-10/5">{tabList}</div>
      ) : (
        tabList
      )}
    </div>
  );
}
