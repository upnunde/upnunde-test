"use client";

import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { LINE_TAB_STRIP_SHELL_CLASS, lineTabStripListClassName } from "@/lib/tab-styles";

export type InquiryTab = "faq" | "inquiry" | "history";

export interface InquiryTabStripProps {
  activeTab: InquiryTab;
  onTabChange: (tab: InquiryTab) => void;
}

const TAB_ITEMS = [
  { id: "faq" as const, label: "많이받는 질문" },
  { id: "inquiry" as const, label: "문의" },
  { id: "history" as const, label: "문의내역" },
] as const;

/** 문의 페이지 상단 탭 — PageCard 내부에 배치 */
export function InquiryTabStrip({ activeTab, onTabChange }: InquiryTabStripProps) {
  return (
    <div className={LINE_TAB_STRIP_SHELL_CLASS}>
      <SegmentedTextTabs
        aria-label="문의 탭"
        items={TAB_ITEMS}
        activeId={activeTab}
        onSelect={(id) => onTabChange(id as InquiryTab)}
        tabsVariant="line"
        size="l"
        className="w-full"
        tabListClassName={lineTabStripListClassName("l")}
      />
    </div>
  );
}
