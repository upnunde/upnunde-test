"use client";

import type { SeriesFormTab } from "@/lib/seriesForm";
import { Tabs, TabsList, TabsTrigger } from "design-system/ui/tabs";
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
      <Tabs value={activeTab} onValueChange={(v) => onChange(v as SeriesFormTab)} className="w-full">
        <TabsList variant="line" size="default" aria-label="시리즈 폼 섹션" className={lineTabStripListClassName("l")}>
          {ITEMS.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
