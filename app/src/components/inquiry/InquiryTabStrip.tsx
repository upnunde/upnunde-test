"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LINE_TAB_STRIP_SHELL_CLASS, lineTabStripListClassName } from "@/lib/tab-styles";

export type InquiryTab = "faq" | "inquiry" | "history";

export interface InquiryTabStripProps {
  activeTab: InquiryTab;
  onTabChange: (tab: InquiryTab) => void;
}

const TAB_ITEMS = [
  { id: "faq" as const, label: "많이받는 질문" },
  { id: "history" as const, label: "문의내역" },
  { id: "inquiry" as const, label: "문의하기" },
] as const;

/** 문의 페이지 상단 탭 — PageCard 내부에 배치 */
export function InquiryTabStrip({ activeTab, onTabChange }: InquiryTabStripProps) {
  return (
    <div className={LINE_TAB_STRIP_SHELL_CLASS}>
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as InquiryTab)} className="w-full">
        <TabsList variant="line" size="default" aria-label="문의 탭" className={lineTabStripListClassName("l")}>
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
