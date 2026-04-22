"use client";

import { cn } from "@/lib/utils";
import type { SeriesFormTab } from "@/lib/seriesForm";

interface SeriesFormTabsProps {
  activeTab: SeriesFormTab;
  onChange: (tab: SeriesFormTab) => void;
}

const SERIES_FORM_TABS: Array<{ id: SeriesFormTab; label: string }> = [
  { id: "image", label: "이미지" },
  { id: "info", label: "정보" },
  { id: "worldview", label: "세계관" },
];

export function SeriesFormTabs({ activeTab, onChange }: SeriesFormTabsProps) {
  return (
    <div className="self-stretch px-5 pt-0 pb-0 mt-2 mb-2 border-b border-border-10 inline-flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch inline-flex justify-start items-center gap-4 overflow-hidden">
        {SERIES_FORM_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={cn(
              "h-10 flex cursor-pointer justify-center items-center gap-2.5 min-w-0 border-b-2 transition-colors font-['Pretendard_JP',sans-serif] text-base font-bold leading-6",
              activeTab === id
                ? "border-slate-800 text-on-surface-10"
                : "border-transparent text-on-surface-disabled"
            )}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
