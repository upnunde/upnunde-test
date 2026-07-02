"use client";

import type { SeriesFormTab } from "@/lib/seriesForm";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { LINE_TAB_STRIP_SHELL_CLASS, lineTabStripListClassName } from "@/lib/tab-styles";

interface SeriesFormTabsProps {
  activeTab: SeriesFormTab;
  onChange: (tab: SeriesFormTab) => void;
}

const ITEMS: Array<{ id: SeriesFormTab; label: string }> = [
  { id: "image", label: "이미지" },
  { id: "info", label: "정보" },
  { id: "worldview", label: "세계관" },
];

export function SeriesFormTabs({ activeTab, onChange }: SeriesFormTabsProps) {
  return (
    <div className={LINE_TAB_STRIP_SHELL_CLASS}>
      <SegmentedTextTabs
        aria-label="시리즈 폼 섹션"
        items={ITEMS}
        activeId={activeTab}
        onSelect={(id) => onChange(id as SeriesFormTab)}
        tabsVariant="line"
        size="l"
        className="w-full"
        tabListClassName={lineTabStripListClassName("l")}
      />
    </div>
  );
}
