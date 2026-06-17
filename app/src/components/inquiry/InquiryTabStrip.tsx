"use client";

import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

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
    <div className={cn("inline-flex flex-col items-start justify-start gap-my-8 self-stretch border-b border-border-10 pb-0 pt-0", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
      <SegmentedTextTabs
        aria-label="문의 탭"
        items={TAB_ITEMS}
        activeId={activeTab}
        onSelect={(id) => onTabChange(id as InquiryTab)}
        underline
        size="l"
        tabListClassName="mb-0 self-stretch border-b-0"
      />
    </div>
  );
}
