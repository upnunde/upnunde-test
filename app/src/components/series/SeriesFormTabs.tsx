"use client";

import type { SeriesFormTab } from "@/lib/seriesForm";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";

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
    <div className="mb-2 mt-2 inline-flex flex-col items-start justify-start gap-2.5 self-stretch border-b border-border-10 px-5 pb-0 pt-0">
      <SegmentedTextTabs
        aria-label="시리즈 폼 섹션"
        items={ITEMS}
        activeId={activeTab}
        onSelect={(id) => onChange(id as SeriesFormTab)}
        mode="underline"
        dimension="section"
        tabListClassName="self-stretch"
      />
    </div>
  );
}
