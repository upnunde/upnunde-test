"use client";

import { startTransition, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "design-system/ui/tabs";
import {
  LINE_TAB_STRIP_SHELL_CLASS,
  lineTabStripListClassName,
  type TabSize,
} from "@/lib/tab-styles";
import { cn } from "design-system/utils";

export interface LineTabStripItem {
  id: string;
  label: string;
}

/** 리노벨 TabSize → DS TabsList size */
const DS_LINE_TAB_SIZE: Record<TabSize, "sm" | "default" | "xl"> = {
  m: "sm",
  l: "default",
  xl: "xl",
};

export interface LineTabStripProps {
  items: readonly LineTabStripItem[];
  activeId: string;
  onSelect: (id: string) => void;
  size?: TabSize;
  "aria-label": string;
  className?: string;
}

/**
 * PageCard 상단 라인 탭 — DS Tabs `variant="line"`.
 * 트리거에 칩·타이포 오버라이드를 넣지 않음 (tabs.css 정본 유지).
 */
export function LineTabStrip({
  items,
  activeId,
  onSelect,
  size = "l",
  "aria-label": ariaLabel,
  className,
}: LineTabStripProps) {
  const handleValueChange = useCallback(
    (value: string | number | null) => {
      if (value == null) return;
      const next = String(value);
      if (next === activeId) return;
      startTransition(() => onSelect(next));
    },
    [activeId, onSelect],
  );

  return (
    <div className={cn(LINE_TAB_STRIP_SHELL_CLASS, className)}>
      <Tabs
        value={activeId}
        onValueChange={handleValueChange}
        className="w-full min-w-0 max-w-full"
      >
        <TabsList
          variant="line"
          size={DS_LINE_TAB_SIZE[size]}
          aria-label={ariaLabel}
          className={cn("max-w-full min-w-0 overflow-x-auto", lineTabStripListClassName(size))}
        >
          {items.map(({ id, label }) => (
            <TabsTrigger key={id} value={id}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
