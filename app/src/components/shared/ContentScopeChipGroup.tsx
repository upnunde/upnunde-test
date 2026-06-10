"use client";

import { analyticsFilterChipResponsiveClassName } from "@/components/analytics/analytics-filter-chips";
import { FilterChip } from "@/components/ui/chip";
import { CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS } from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

export interface ContentScopeChipGroupProps<T extends string> {
  items: readonly { id: T; label: string }[];
  activeId: T;
  onSelect: (id: T) => void;
  ariaLabel: string;
  className?: string;
}

/** 시리즈·캐릭터·상황공략 범위 칩 — 분석·내 작품 공통 */
export function ContentScopeChipGroup<T extends string>({
  items,
  activeId,
  onSelect,
  ariaLabel,
  className,
}: ContentScopeChipGroupProps<T>) {
  return (
    <div
      className={cn("flex shrink-0 items-center", CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS, className)}
      role="group"
      aria-label={ariaLabel}
    >
      {items.map(({ id, label }) => {
        const selected = activeId === id;
        return (
          <FilterChip
            key={id}
            selected={selected}
            chipSize="l"
            aria-pressed={selected}
            className={cn("min-w-20", analyticsFilterChipResponsiveClassName)}
            onClick={() => onSelect(id)}
          >
            {label}
          </FilterChip>
        );
      })}
    </div>
  );
}
