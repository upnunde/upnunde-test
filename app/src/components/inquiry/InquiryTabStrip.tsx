"use client";

import { cn } from "@/lib/utils";

export type InquiryTab = "inquiry" | "history";

export interface InquiryTabStripProps {
  activeTab: InquiryTab;
  onTabChange: (tab: InquiryTab) => void;
}

/** 문의 페이지 상단 탭 — `PAGE_INLINE_TAB_STRIP_SHELL_CLASS`와 형제 스크롤 본문에 배치 */
export function InquiryTabStrip({ activeTab, onTabChange }: InquiryTabStripProps) {
  return (
    <div className="inline-flex w-full flex-col items-start justify-start gap-my-8 pt-0 pb-0 mt-2 mb-0">
      <div
        data-size="L"
        data-underline="true"
        className="inline-flex w-full items-center justify-start gap-my-16 overflow-hidden"
      >
        {(
          [
            { id: "inquiry" as const, label: "문의" },
            { id: "history" as const, label: "문의내역" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            data-height="h40"
            data-selectline="true"
            className={cn(
              "flex h-9 min-w-0 cursor-pointer items-center justify-center gap-my-8 font-['Pretendard_JP'] text-body1_700",
              activeTab === id
                ? "border-b-2 border-slate-800 text-on-surface-10"
                : "text-on-surface-disabled",
            )}
            onClick={() => onTabChange(id)}
            data-activated={activeTab === id}
          >
            <span className="justify-start">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
