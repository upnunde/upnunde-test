"use client";

import { FilterChip } from "@/components/ui/chip";
import { chipGroupGapClass } from "@/lib/chip-styles";
import {
  TAB_SIZE_META,
  tabInstanceClassName,
  tabListClassName,
  type TabSize,
} from "@/lib/tab-styles";
import { cn } from "@/lib/utils";

export interface SegmentedTextTabItem {
  id: string;
  label: string;
}

/** @deprecated `TabSize` — `app/src/lib/tab-styles.ts` */
export type SegmentedTabSize = TabSize;

export type SegmentedTextTabsVariant = "text" | "chip";

const CHIP_FILTER_SIZE: Record<TabSize, "l" | "m"> = {
  xl: "l",
  l: "l",
  m: "m",
};

export interface SegmentedTextTabsProps {
  items: readonly SegmentedTextTabItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  /**
   * Figma `tab` · `underline` (= tab instance `selectline`)
   * true: 목록 트랙 `border-b border-border-10`, 활성 탭 `border-b-2 border-border-strong`
   */
  underline?: boolean;
  /** `text`: Figma tab / tab instance · `chip`: Figma chips (별도 가이드) */
  variant?: SegmentedTextTabsVariant;
  /** text 기본 `l`, chip 기본 `m` */
  size?: TabSize;
  className?: string;
  tabListClassName?: string;
  "aria-label"?: string;
}

/**
 * Figma `tab` 컴포넌트 — 텍스트 탭 목록.
 * 칩 필터는 `variant="chip"` + `FilterChip` (Chip DS).
 */
export function SegmentedTextTabs({
  items,
  activeId,
  onSelect,
  underline = false,
  variant = "text",
  size,
  className,
  tabListClassName: tabListClassNameProp,
  "aria-label": ariaLabel,
}: SegmentedTextTabsProps) {
  const isChip = variant === "chip";
  const resolvedSize: TabSize = size ?? (isChip ? "m" : "l");
  const chipSize = CHIP_FILTER_SIZE[resolvedSize];
  const resolvedTabListGap = isChip ? chipGroupGapClass(chipSize) : undefined;

  const tabList = (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={
        isChip
          ? cn(
              "inline-flex max-w-full min-w-0 items-center justify-start overflow-x-auto overflow-y-visible",
              resolvedTabListGap,
              tabListClassNameProp,
            )
          : tabListClassName({
              size: resolvedSize,
              underline,
              className: tabListClassNameProp,
            })
      }
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

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-activated={isActive ? "true" : "false"}
            data-selectline={underline ? "true" : "false"}
            data-height={TAB_SIZE_META[resolvedSize].heightToken}
            className={cn(
              tabInstanceClassName({
                activated: isActive,
                selectline: underline,
                size: resolvedSize,
              }),
              isClickable ? "cursor-pointer" : "cursor-default",
              !isActive && isClickable && "hover:text-on-surface-20",
            )}
            onClick={() => onSelect?.(id)}
          >
            <span className="whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );

  return <div className={cn(className)}>{tabList}</div>;
}
