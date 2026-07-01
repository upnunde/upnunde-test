"use client";

import { Tabs, TabsList, TabsTrigger } from "design-system/ui/tabs";
import { cn } from "design-system/utils";

export interface ContentScopeChipGroupProps<T extends string> {
  items: readonly { id: T; label: string }[];
  activeId: T;
  onSelect: (id: T) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * 시리즈·캐릭터·상황공략 범위 — DS Tabs showcase와 동일 (`TabsList` default size·variant).
 */
export function ContentScopeChipGroup<T extends string>({
  items,
  activeId,
  onSelect,
  ariaLabel,
  className,
}: ContentScopeChipGroupProps<T>) {
  return (
    <Tabs
      value={activeId}
      onValueChange={(value) => onSelect(value as T)}
      className={cn("shrink-0", className)}
    >
      <TabsList aria-label={ariaLabel}>
        {items.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
