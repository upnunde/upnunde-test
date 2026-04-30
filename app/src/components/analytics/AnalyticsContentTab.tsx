"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Title2 } from "@/components/ui/title2";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { cn } from "@/lib/utils";
import type { AnalyticsPrimaryMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import {
  ANALYTICS_PERIOD_OPTIONS,
  type AnalyticsPeriodRange,
} from "@/components/analytics/analytics-date";
import {
  analyticsFilledSecondaryChipClassName,
  analyticsOutlineChipClassName,
  analyticsScopeChipInactiveClassName,
} from "@/components/analytics/analytics-filter-chips";
import {
  AnalyticsTopFiveRowList,
  type AnalyticsTopFiveRow,
} from "@/components/analytics/AnalyticsRankParts";
import {
  ANALYTICS_SCOPE_CHIPS,
  type AnalyticsScopeCategoryId,
} from "@/components/analytics/analytics-scope-category";
import { deltaClassName, getContentDummy } from "@/components/analytics/analytics-dummy-by-scope";

const AnalyticsTrendLineChart = dynamic(
  () =>
    import("@/components/analytics/AnalyticsTrendLineChart").then((m) => m.AnalyticsTrendLineChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] w-full animate-pulse rounded-[4px] bg-slate-100" aria-hidden />
    ),
  },
);

const PRIMARY_LABELS: Record<AnalyticsPrimaryMetric, string> = {
  views: "조회수",
  watchTime: "이용시간",
  likes: "좋아요",
  comments: "댓글",
  shares: "공유",
};

export function AnalyticsContentTab({
  periodRange,
  onPeriodRangeChange,
  dateRangeLabel,
}: {
  periodRange: AnalyticsPeriodRange;
  onPeriodRangeChange: (v: AnalyticsPeriodRange) => void;
  dateRangeLabel: string;
}) {
  const [scopeCategory, setScopeCategory] = useState<AnalyticsScopeCategoryId>("all");
  const [primaryMetric, setPrimaryMetric] = useState<AnalyticsPrimaryMetric>("views");
  const periodLabel =
    ANALYTICS_PERIOD_OPTIONS.find((o) => o.value === periodRange)?.label ?? "7일 전";
  const contentDummy = getContentDummy(scopeCategory);

  return (
    <div className="flex flex-col items-start justify-start gap-5 self-stretch px-0 pt-5 pb-10">
      <div className="flex flex-col items-start justify-start gap-2 self-stretch">
        <div className="inline-flex items-center justify-between self-stretch">
          <div className="flex flex-wrap items-center justify-start gap-2" role="group" aria-label="콘텐츠 범위">
            {ANALYTICS_SCOPE_CHIPS.map(({ id, label }) => {
              const selected = scopeCategory === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setScopeCategory(id)}
                  className={selected ? analyticsFilledSecondaryChipClassName : analyticsScopeChipInactiveClassName}
                >
                  <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-base font-medium leading-5">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-end justify-end gap-4">
            <span className="text-sm font-medium leading-5 text-on-surface-30">{dateRangeLabel}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className={analyticsOutlineChipClassName} aria-label="조회 기간 선택">
                  <span className="min-w-0 max-w-[140px] truncate">{periodLabel}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-700" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuRadioGroup
                  value={periodRange}
                  onValueChange={(v) => onPeriodRangeChange(v as AnalyticsPeriodRange)}
                >
                  {ANALYTICS_PERIOD_OPTIONS.map(({ value, label }) => (
                    <DropdownMenuRadioItem key={value} value={value}>
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <AnalyticsPanel>
        <Title2 text="주요통계" variant="title" asSectionHeader />
        <div className="inline-flex min-h-0 min-w-0 flex-1 flex-wrap items-stretch justify-start self-stretch sm:flex-nowrap">
          {contentDummy.primary.map((stat, i, arr) => {
            const isFirst = i === 0;
            const selected = primaryMetric === stat.id;
            const shell = cn(
              "min-w-[120px] flex-1 sm:min-w-0 self-stretch border-b border-border-10 px-5 py-10 inline-flex flex-col items-center justify-start gap-1",
              i < arr.length - 1 && "border-r",
            );
            const label = PRIMARY_LABELS[stat.id];

            return (
              <button
                key={stat.id}
                type="button"
                onClick={() => setPrimaryMetric(stat.id)}
                aria-pressed={selected}
                aria-label={`${label} 통계 선택, 하단 그래프에 반영`}
                className={cn(
                  shell,
                  "cursor-pointer text-left transition-colors outline-none",
                  selected ? "z-[1] bg-white" : "bg-surface-disabled-10 hover:bg-surface-10/80",
                )}
              >
                <div className="justify-center text-center text-sm font-medium leading-5 text-on-surface-20">
                  {label}
                </div>
                <div className="justify-center text-center text-2xl font-bold leading-8 text-on-surface-10">
                  {stat.value}
                </div>
                {isFirst ? (
                  <div className="inline-flex items-center justify-center gap-1">
                    <div
                      className={cn(
                        "justify-center text-center text-sm font-normal leading-5",
                        deltaClassName(stat.deltaTone),
                      )}
                    >
                      {stat.delta}
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "justify-center text-center text-sm font-normal leading-5",
                      deltaClassName(stat.deltaTone),
                    )}
                  >
                    {stat.delta}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-stretch gap-3 self-stretch px-0 py-10">
          <p className="px-5 text-sm font-medium leading-5 text-on-surface-20">
            {PRIMARY_LABELS[primaryMetric] ?? "조회수"} 추이
          </p>
          <AnalyticsTrendLineChart
            metric={primaryMetric}
            valuesOverride={contentDummy.chartSeries[primaryMetric]}
          />
        </div>
      </AnalyticsPanel>

      <div className="inline-flex items-start justify-start gap-5 self-stretch">
        <PopularContentsCard rows={contentDummy.top5} />
        <AttentionContentsCard rows={contentDummy.top5} />
      </div>
    </div>
  );
}

type PopularCriterionId = "views" | "time" | "likes" | "followers";

function PopularContentsCard({ rows }: { rows: readonly AnalyticsTopFiveRow[] }) {
  const [popularCriterion, setPopularCriterion] = useState<PopularCriterionId>("views");

  return (
    <AnalyticsPanel className="min-w-0 flex-1">
      <Title2 text="인기 콘텐츠 TOP5" variant="title" asSectionHeader />
      <div className="mb-2 mt-2 inline-flex flex-col items-start justify-start gap-2.5 self-stretch px-5 pb-0 pt-0">
        <SegmentedTextTabs
          aria-label="인기 콘텐츠 기준"
          items={[
            { id: "views", label: "최다 조회수" },
            { id: "time", label: "최다 이용시간" },
            { id: "likes", label: "최다 좋아요" },
            { id: "followers", label: "최다 팔로워" },
          ]}
          activeId={popularCriterion}
          onSelect={(id) => setPopularCriterion(id as PopularCriterionId)}
          size="m"
          tabListClassName="self-stretch"
        />
      </div>
      <AnalyticsTopFiveRowList rows={rows} />
    </AnalyticsPanel>
  );
}

type AttentionCriterionId = "lowViews" | "lowTime";

function AttentionContentsCard({ rows }: { rows: readonly AnalyticsTopFiveRow[] }) {
  const [attentionCriterion, setAttentionCriterion] = useState<AttentionCriterionId>("lowViews");

  return (
    <AnalyticsPanel className="min-w-0 flex-1">
      <Title2 text="주의 필요한 콘텐츠 TOP5" variant="title" asSectionHeader />
      <div className="mb-2 mt-2 inline-flex flex-col items-start justify-start gap-2.5 self-stretch px-5 pb-0 pt-0">
        <SegmentedTextTabs
          aria-label="주의 콘텐츠 기준"
          items={[
            { id: "lowViews", label: "최저 조회수" },
            { id: "lowTime", label: "최저 이용시간" },
          ]}
          activeId={attentionCriterion}
          onSelect={(id) => setAttentionCriterion(id as AttentionCriterionId)}
          size="m"
          tabListClassName="self-stretch"
        />
      </div>
      <AnalyticsTopFiveRowList rows={rows} />
    </AnalyticsPanel>
  );
}
