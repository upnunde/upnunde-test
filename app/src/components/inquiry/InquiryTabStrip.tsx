"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterTabStripSize } from "@/hooks/useFilterTabStripSize";
import { FILTER_TAB_STRIP_SHELL_CLASS } from "@/lib/chip-styles";
import { cn } from "design-system/utils";

export type InquiryTab = "faq" | "inquiry" | "history";

export interface InquiryTabStripProps {
  activeTab: InquiryTab;
  onTabChange: (tab: InquiryTab) => void;
  className?: string;
}

const TAB_ITEMS = [
  { id: "faq" as const, label: "많이받는 질문" },
  { id: "history" as const, label: "문의내역" },
  { id: "inquiry" as const, label: "문의하기" },
] as const;

/** 문의 페이지 필터 띠 탭 — 분석·내 작품과 동일 (`text` · 모바일 `xl` · lg+ `2xl`) */
export function InquiryTabStrip({ activeTab, onTabChange, className }: InquiryTabStripProps) {
  const size = useFilterTabStripSize();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as InquiryTab)}
      className={cn(FILTER_TAB_STRIP_SHELL_CLASS, className)}
    >
      <TabsList
        variant="text"
        size={size}
        aria-label="문의 탭"
        className="max-w-full min-w-0 overflow-x-auto"
      >
        {TAB_ITEMS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
