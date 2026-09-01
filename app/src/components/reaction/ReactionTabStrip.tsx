"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterTabStripSize } from "@/hooks/useFilterTabStripSize";
import { FILTER_TAB_STRIP_SHELL_CLASS } from "@/lib/chip-styles";
import { cn } from "design-system/utils";
import type { ReactionTab } from "@/types/reaction";

const TAB_ITEMS = [
  { id: "comments" as const, label: "댓글" },
  { id: "follows" as const, label: "구독자" },
] as const;

/** 반응 유형 필터 띠 탭 — 분석·내 작품과 동일 (`text` · 모바일 `xl` · lg+ `2xl`) */
export function ReactionTabStrip({
  activeTab,
  onTabChange,
  className,
}: {
  activeTab: ReactionTab;
  onTabChange: (tab: ReactionTab) => void;
  className?: string;
}) {
  const size = useFilterTabStripSize();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as ReactionTab)}
      className={cn(FILTER_TAB_STRIP_SHELL_CLASS, className)}
    >
      <TabsList
        variant="text"
        size={size}
        aria-label="반응 유형"
        className="max-w-full min-w-0 overflow-x-auto"
      >
        {TAB_ITEMS.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
