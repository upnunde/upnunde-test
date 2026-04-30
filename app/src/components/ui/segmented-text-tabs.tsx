"use client";

import { cn } from "@/lib/utils";

export interface SegmentedTextTabItem {
  id: string;
  label: string;
}

export interface SegmentedTextTabsProps {
  items: readonly SegmentedTextTabItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  /** 밑줄 활성 표시 (시리즈 폼 탭·알림 목록 등) */
  mode?: "underline" | "plain";
  /** 페이지 상단용 큰 탭 vs 카드 내부 기본 탭 */
  dimension?: "page" | "section";
  /** plain 모드 비활성 탭 톤 — 이용자 영역 상단 등 */
  plainInactiveTone?: "default" | "soft";
  className?: string;
  tabListClassName?: string;
  /** 예: 알림·분석 카드 내 서브탭 */
  "aria-label"?: string;
}

/**
 * 텍스트만 있는 세그먼트 탭 (밑줄형 / 색상형).
 * `SeriesFormTabs`, 알림 탭, 분석 화면 등에서 공통 패턴으로 사용한다.
 */
export function SegmentedTextTabs({
  items,
  activeId,
  onSelect,
  mode = "underline",
  dimension = "section",
  plainInactiveTone = "default",
  className,
  tabListClassName,
  "aria-label": ariaLabel,
}: SegmentedTextTabsProps) {
  return (
    <div className={cn(className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-start overflow-hidden",
          dimension === "page" ? "gap-5" : "gap-4",
          tabListClassName,
        )}
      >
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          const dim =
            dimension === "page"
              ? "h-12 gap-2.5 text-xl font-bold leading-7"
              : "h-10 min-w-0 gap-2.5 text-base font-bold leading-6";
          const state =
            mode === "underline"
              ? isActive
                ? "border-slate-800 text-on-surface-10"
                : "border-transparent text-on-surface-disabled"
              : isActive
                ? "text-on-surface-10"
                : plainInactiveTone === "soft"
                  ? "text-on-surface-disabled/20"
                  : "text-on-surface-disabled";
          const underline = mode === "underline" ? "border-b-2" : "";

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex items-center justify-center px-0 transition-colors font-['Pretendard_JP',sans-serif]",
                onSelect ? "cursor-pointer" : "cursor-default",
                dim,
                underline,
                state,
              )}
              onClick={() => onSelect?.(id)}
            >
              <span className="justify-start">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
