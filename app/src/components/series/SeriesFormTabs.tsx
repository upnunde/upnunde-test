"use client";

import type { SeriesFormTab } from "@/lib/seriesForm";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

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
    <div className={cn("inline-flex flex-col items-start justify-start gap-2 self-stretch border-b border-border pb-0 pt-0", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
      <SegmentedTextTabs
        aria-label="시리즈 폼 섹션"
        items={ITEMS}
        activeId={activeTab}
        onSelect={(id) => onChange(id as SeriesFormTab)}
        underline
        size="l"
        tabListClassName="mb-0 self-stretch border-b-0"
      />
    </div>
  );
}
