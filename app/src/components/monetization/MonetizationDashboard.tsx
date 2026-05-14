"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { AnalyticsScopeFilterBar } from "@/components/analytics/AnalyticsScopeFilterBar";
import { AnalyticsEpisodeScopePicker } from "@/components/analytics/AnalyticsEpisodeScopePicker";
import type { AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import {
  ANALYTICS_TREND_LINE_FIXED_HEIGHT_CLASS,
  ANALYTICS_TREND_LINE_SHELL_CLASS,
} from "@/components/analytics/analytics-trend-chart-shell";
import { deltaClassName, getMonetizationDummy } from "@/components/analytics/analytics-dummy-by-scope";
import { AnalyticsTopFiveRowList } from "@/components/analytics/AnalyticsRankParts";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import type { AnalyticsCharacterId } from "@/components/analytics/analytics-character-options";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import { cn } from "@/lib/utils";

const AnalyticsTrendLineChart = dynamic(
  () =>
    import("@/components/analytics/AnalyticsTrendLineChart").then((m) => m.AnalyticsTrendLineChart),
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(ANALYTICS_TREND_LINE_SHELL_CLASS, ANALYTICS_TREND_LINE_FIXED_HEIGHT_CLASS)}
        aria-hidden
      />
    ),
  },
);

const MONETIZATION_KEY_STATS_ROWS = [
  { id: "expectedRevenue", label: "수익금" },
  { id: "purchaseCount", label: "구매 수" },
  { id: "purchaseRate", label: "구매 전환율" },
] as const;

type MonetizationStatId = (typeof MONETIZATION_KEY_STATS_ROWS)[number]["id"];

export function MonetizationDashboard({
  periodRange,
  onPeriodRangeChange,
  scopeCategory,
  onScopeCategoryChange,
  seriesId,
  onSeriesIdChange,
  characterId,
  onCharacterIdChange,
}: {
  periodRange: AnalyticsPeriodRange;
  onPeriodRangeChange: (v: AnalyticsPeriodRange) => void;
  scopeCategory: AnalyticsScopeCategoryId;
  onScopeCategoryChange: (id: AnalyticsScopeCategoryId) => void;
  seriesId: AnalyticsSeriesId;
  onSeriesIdChange: (id: AnalyticsSeriesId) => void;
  characterId: AnalyticsCharacterId;
  onCharacterIdChange: (id: AnalyticsCharacterId) => void;
}) {
  const [selectedMonetizationStat, setSelectedMonetizationStat] = useState<MonetizationStatId>("expectedRevenue");
  const [statsEpisodeNo, setStatsEpisodeNo] = useState<"all" | number>("all");

  const isSeriesScope = scopeCategory === "series";

  useEffect(() => {
    setStatsEpisodeNo("all");
  }, [seriesId, scopeCategory]);

  const dummy = useMemo(
    () => getMonetizationDummy(scopeCategory, periodRange, seriesId, characterId, statsEpisodeNo),
    [scopeCategory, periodRange, seriesId, characterId, statsEpisodeNo],
  );

  const monetizationChartValues = dummy.chartSeries[selectedMonetizationStat];

  return (
    <div className="flex flex-col items-start justify-start gap-5 self-stretch px-0 pt-5 pb-10">
      <AnalyticsScopeFilterBar
        periodRange={periodRange}
        onPeriodRangeChange={onPeriodRangeChange}
        scopeCategory={scopeCategory}
        onScopeCategoryChange={onScopeCategoryChange}
        seriesId={seriesId}
        onSeriesIdChange={onSeriesIdChange}
        characterId={characterId}
        onCharacterIdChange={onCharacterIdChange}
      />

      <AnalyticsPanel>
        <Title2
          text="주요통계"
          variant="title"
          asSectionHeader
          sectionEnd={
            isSeriesScope ? (
              <AnalyticsEpisodeScopePicker
                seriesId={seriesId}
                value={statsEpisodeNo}
                onChange={setStatsEpisodeNo}
              />
            ) : undefined
          }
        />
        <div className="inline-flex min-h-0 min-w-0 flex-1 flex-wrap items-stretch justify-start self-stretch sm:flex-nowrap">
          {MONETIZATION_KEY_STATS_ROWS.map((stat, i, arr) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => setSelectedMonetizationStat(stat.id)}
              aria-pressed={selectedMonetizationStat === stat.id}
              aria-label={`${stat.label} 통계 선택`}
              className={cn(
                "min-w-[120px] flex-1 sm:min-w-0 self-stretch border-b border-border-10 px-5 py-10 inline-flex flex-col items-center justify-start gap-1",
                "cursor-pointer text-left transition-colors outline-none",
                i < arr.length - 1 && "border-r",
                selectedMonetizationStat === stat.id
                  ? "z-[1] bg-white"
                  : "bg-surface-disabled-10 hover:bg-surface-10/80",
              )}
            >
              <div className="justify-center text-center text-sm font-medium leading-5 text-on-surface-20">
                {stat.label}
              </div>
              <div className="justify-center text-center text-2xl font-bold leading-8 text-on-surface-10">
                {dummy.stats[stat.id].value}
              </div>
              <div
                className={cn(
                  "justify-center text-center text-sm font-normal leading-5",
                  deltaClassName(dummy.stats[stat.id].deltaTone),
                )}
              >
                {dummy.stats[stat.id].delta}
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-stretch gap-3 self-stretch px-0 py-10">
          <p className="px-5 text-sm font-medium leading-5 text-on-surface-20">수익금 추이</p>
          <AnalyticsTrendLineChart
            metric="views"
            periodRange={periodRange}
            valuesOverride={monetizationChartValues}
          />
        </div>
      </AnalyticsPanel>

      <div className="flex w-full flex-col items-stretch gap-5 lg:flex-row">
        <AnalyticsPanel className="w-full min-w-0 flex-1 lg:min-w-[260px]">
          <Title2 text="매출 기여 콘텐츠 TOP5" variant="title" asSectionHeader />
          <AnalyticsTopFiveRowList rows={dummy.top5} />
        </AnalyticsPanel>
        <AnalyticsPanel className="w-full min-w-0 flex-1 lg:min-w-[260px]">
          <Title2 text="개선 필요 콘텐츠 TOP5" variant="title" asSectionHeader />
          <AnalyticsTopFiveRowList rows={dummy.low5} />
        </AnalyticsPanel>
      </div>
    </div>
  );
}
