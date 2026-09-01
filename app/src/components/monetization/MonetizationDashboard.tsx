"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import {
  ANALYTICS_KEY_STAT_BUTTON_CLASS,
  ANALYTICS_KEY_STAT_BUTTON_INTERACTION_CLASS,
  ANALYTICS_KEY_STAT_DELTA_CLASS,
  ANALYTICS_KEY_STATS_CHART_SHELL_CLASS,
  ANALYTICS_KEY_STATS_GROUP_SHELL_CLASS,
  ANALYTICS_KEY_STATS_ROW_CLASS,
  analyticsKeyStatButtonStateClass,
  analyticsKeyStatLabelClass,
  analyticsKeyStatValueClass,
} from "@/components/analytics/analytics-key-stats-layout";
import type { AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import {
  ANALYTICS_TREND_LINE_FIXED_HEIGHT_CLASS,
  ANALYTICS_TREND_LINE_SHELL_CLASS,
} from "@/components/analytics/analytics-trend-chart-shell";
import {
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  PAGE_GUTTER_GAP_CLASS
} from "@/lib/page-layout";
import { deltaClassName, getMonetizationDummy } from "@/components/analytics/analytics-dummy-by-scope";
import { cn } from "design-system/utils";
import {
  AnalyticsMonthlyRevenueRangeFilter,
  DEFAULT_MONTHLY_REVENUE_RANGE_MONTHS,
  type MonthlyRevenueRangeMonths,
} from "@/components/analytics/AnalyticsMonthlyRevenueRangeFilter";
import { AnalyticsTopFiveRowList } from "@/components/analytics/AnalyticsRankParts";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import type { AnalyticsCharacterId } from "@/components/analytics/analytics-character-options";
import type { AnalyticsScenarioId } from "@/components/analytics/analytics-scenario-options";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import { AnalyticsMonthlyRevenueSection } from "@/components/analytics/AnalyticsMonthlyRevenueSection";

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
  { id: "expectedRevenue", label: "추정 수익금" },
  { id: "purchaseCount", label: "구매 수" },
  { id: "purchaseRate", label: "구매 전환율" },
] as const;

type MonetizationStatId = (typeof MONETIZATION_KEY_STATS_ROWS)[number]["id"];

export function MonetizationDashboard({
  periodRange,
  scopeCategory,
  seriesId,
  characterId,
  scenarioId,
  statsEpisodeNo,
}: {
  periodRange: AnalyticsPeriodRange;
  scopeCategory: AnalyticsScopeCategoryId;
  seriesId: AnalyticsSeriesId;
  characterId: AnalyticsCharacterId;
  scenarioId: AnalyticsScenarioId;
  statsEpisodeNo: "all" | number;
}) {
  const [selectedMonetizationStat, setSelectedMonetizationStat] = useState<MonetizationStatId>("expectedRevenue");
  const [monthlyRevenueRange, setMonthlyRevenueRange] = useState<MonthlyRevenueRangeMonths>(
    DEFAULT_MONTHLY_REVENUE_RANGE_MONTHS,
  );

  const dummy = useMemo(
    () =>
      getMonetizationDummy(
        scopeCategory,
        periodRange,
        seriesId,
        characterId,
        scenarioId,
        statsEpisodeNo,
      ),
    [scopeCategory, periodRange, seriesId, characterId, scenarioId, statsEpisodeNo],
  );

  const monetizationChartValues = dummy.chartSeries[selectedMonetizationStat];

  return (
      <div className={`flex flex-col items-start justify-start ${PAGE_GUTTER_GAP_CLASS} self-stretch px-0`}>
        <AnalyticsPanel>
          <Title2 text="주요통계" variant="title" asSectionHeader />
          <div className={ANALYTICS_KEY_STATS_GROUP_SHELL_CLASS}>
            <div className={ANALYTICS_KEY_STATS_ROW_CLASS}>
            {MONETIZATION_KEY_STATS_ROWS.map((stat, i, arr) => (
              <button
                key={stat.label}
                type="button"
                onClick={() => setSelectedMonetizationStat(stat.id)}
                aria-pressed={selectedMonetizationStat === stat.id}
                aria-label={`${stat.label} 통계 선택`}
                className={cn(
                  ANALYTICS_KEY_STAT_BUTTON_CLASS,
                  ANALYTICS_KEY_STAT_BUTTON_INTERACTION_CLASS,
                  i < arr.length - 1 && "lg:border-r",
                  analyticsKeyStatButtonStateClass(selectedMonetizationStat === stat.id),
                )}
              >
                <div className={analyticsKeyStatLabelClass(selectedMonetizationStat === stat.id)}>
                  {stat.label}
                </div>
                <div className={analyticsKeyStatValueClass(selectedMonetizationStat === stat.id)}>
                  {dummy.stats[stat.id].value}
                </div>
                <div className={cn(ANALYTICS_KEY_STAT_DELTA_CLASS, deltaClassName(dummy.stats[stat.id].deltaTone))}>
                  {dummy.stats[stat.id].delta}
                </div>
              </button>
            ))}
            </div>
          </div>

          <div className={ANALYTICS_KEY_STATS_CHART_SHELL_CLASS}>
            <p className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "text-body3_500 text-foreground-muted")}>수익금 추이</p>
            <AnalyticsTrendLineChart
              metric="views"
              periodRange={periodRange}
              valuesOverride={monetizationChartValues}
            />
          </div>
        </AnalyticsPanel>

      <div className={`flex w-full flex-col items-stretch ${PAGE_GUTTER_GAP_CLASS} lg:flex-row lg:items-start`}>
          <AnalyticsPanel className="w-full min-w-0 flex-1 lg:min-w-[260px]">
            <Title2 text="매출 기여 콘텐츠 TOP5" variant="title" asSectionHeader />
          <AnalyticsTopFiveRowList rows={dummy.top5} />
          </AnalyticsPanel>
        <AnalyticsPanel className="h-fit w-full min-w-0 flex-1 self-start lg:min-w-[260px]">
          <Title2 text="월별 수익" variant="title" asSectionHeader />
          <div className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "pt-3")}>
            <AnalyticsMonthlyRevenueRangeFilter
              value={monthlyRevenueRange}
              onChange={setMonthlyRevenueRange}
            />
          </div>
          <div className="p-5">
            <AnalyticsMonthlyRevenueSection
              scopeCategory={scopeCategory}
              seriesId={seriesId}
              characterId={characterId}
              scenarioId={scenarioId}
              monthCount={monthlyRevenueRange}
            />
          </div>
          </AnalyticsPanel>
      </div>
    </div>
  );
}
