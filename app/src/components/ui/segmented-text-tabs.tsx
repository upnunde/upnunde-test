"use client";

import {
  Tabs as DsTabs,
  TabsList as DsTabsList,
  TabsTrigger as DsTabsTrigger,
} from "design-system/ui/tabs";
import { cn } from "design-system/utils";

export interface SegmentedTextTabItem {
  id: string;
  label: string;
}

export type TabSize = "2xl" | "xl" | "l" | "m";
/** @deprecated `TabSize` — inline export */
export type SegmentedTabSize = TabSize;

export type SegmentedTextTabsVariant = "text" | "chip";

/** DS TabsList variant */
export type DsTabsListVariant = "default" | "line" | "text";

/** 리노벨 size → DS Tabs size (`size` 미지정 시 DS 기본 `default`) */
const DS_TABS_SIZE: Record<TabSize, "sm" | "default" | "lg" | "xl" | "2xl"> = {
  m: "sm",
  l: "default",
  xl: "xl",
  "2xl": "2xl",
};

export interface SegmentedTextTabsProps {
  items: readonly SegmentedTextTabItem[];
  /** `null` — 사용자 지정 등 프리셋 미선택 */
  activeId: string | null;
  onSelect?: (id: string) => void;
  /**
   * DS TabsList variant.
   * 미지정 시 `underline` — true: `line`, false: `default`(pill).
   */
  tabsVariant?: DsTabsListVariant;
  /**
   * @deprecated `tabsVariant="line"` 사용.
   * true: DS Tabs `variant="line"` — 활성 시 하단 언더라인.
   */
  underline?: boolean;
  /** @deprecated `chip` — DS Tabs pill과 동일. 하위 호환용. */
  variant?: SegmentedTextTabsVariant;
  size?: TabSize;
  className?: string;
  tabListClassName?: string;
  "aria-label"?: string;
}

/**
 * 텍스트·필터 탭 — DS `Tabs` 어댑터.
 * pill(`default`) · line · text(`tabsVariant="text"`) DS 정본 스타일.
 */
export function SegmentedTextTabs({
  items,
  activeId,
  onSelect,
  tabsVariant,
  underline = false,
  className,
  size,
  tabListClassName,
  "aria-label": ariaLabel,
}: SegmentedTextTabsProps) {
  const listVariant = tabsVariant ?? (underline ? "line" : "default");
  const dsSize = size ? DS_TABS_SIZE[size] : undefined;

  return (
    <DsTabs
      value={activeId}
      onValueChange={(value) => onSelect?.(String(value))}
      className={cn("max-w-full min-w-0", className)}
    >
      <DsTabsList
        variant={listVariant}
        {...(dsSize ? { size: dsSize } : {})}
        aria-label={ariaLabel}
        className={cn(
          "max-w-full min-w-0 overflow-x-auto",
          tabListClassName,
        )}
      >
        {items.map(({ id, label }) => (
          <DsTabsTrigger key={id} value={id} disabled={!onSelect}>
            {label}
          </DsTabsTrigger>
        ))}
      </DsTabsList>
    </DsTabs>
  );
}
