"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "design-system/utils";

export interface ContentScopeChipGroupProps<T extends string> {
  items: readonly { id: T; label: string }[];
  activeId: T;
  onSelect: (id: T) => void;
  ariaLabel: string;
  className?: string;
  /** 기본: 분석 영역 탭과 동일 (`text` · `2xl`) */
  variant?: "default" | "text" | "line";
  size?: "sm" | "default" | "xl" | "2xl";
}

/**
 * 시리즈·캐릭터·상황공략 등 범위 탭.
 * 페이지 1차 탭은 분석 영역과 같이 `text`/`2xl`, 분석 2차 칩은 `default`를 넘긴다.
 */
export function ContentScopeChipGroup<T extends string>({
  items,
  activeId,
  onSelect,
  ariaLabel,
  className,
  variant = "text",
  size = "2xl",
}: ContentScopeChipGroupProps<T>) {
  const isAreaTab = variant === "text" && size === "2xl";

  return (
    <Tabs
      value={activeId}
      onValueChange={(value) => onSelect(value as T)}
      className={cn(isAreaTab ? "max-w-full min-w-0 min-h-12" : "shrink-0", className)}
    >
      <TabsList
        variant={variant}
        size={size}
        aria-label={ariaLabel}
        className={cn(isAreaTab && "max-w-full min-w-0 overflow-x-auto")}
      >
        {items.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
