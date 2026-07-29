"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Title2 } from "@/components/ui/title2";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import {
  ANALYTICS_KEY_STAT_BUTTON_CLASS,
  ANALYTICS_KEY_STAT_BUTTON_INTERACTION_CLASS,
  ANALYTICS_KEY_STAT_DELTA_CLASS,
  ANALYTICS_KEY_STATS_ROW_CLASS,
  analyticsKeyStatButtonStateClass,
  analyticsKeyStatLabelClass,
  analyticsKeyStatValueClass,
} from "@/components/analytics/analytics-key-stats-layout";
import {
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  PAGE_GUTTER_GAP_CLASS
} from "@/lib/page-layout";
import { cn } from "design-system/utils";
import type { AnalyticsPrimaryMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import { type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import {
  ANALYTICS_TREND_LINE_FIXED_HEIGHT_CLASS,
  ANALYTICS_TREND_LINE_SHELL_CLASS,
} from "@/components/analytics/analytics-trend-chart-shell";
import {
  AnalyticsTopFiveRowList,
  type AnalyticsTopFiveRow,
} from "@/components/analytics/AnalyticsRankParts";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import type { AnalyticsCharacterId } from "@/components/analytics/analytics-character-options";
import type { AnalyticsScenarioId } from "@/components/analytics/analytics-scenario-options";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import {
  deltaClassName,
  getContentDummy,
  getEpisodePrimaryStatsDummy,
  getScopedTop5Dummy,
} from "@/components/analytics/analytics-dummy-by-scope";

const AnalyticsTrendLineChart = dynamic(
  () =>
    import("@/components/analytics/AnalyticsTrendLineChart").then((m) => m.AnalyticsTrendLineChart),
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          ANALYTICS_TREND_LINE_SHELL_CLASS,
          ANALYTICS_TREND_LINE_FIXED_HEIGHT_CLASS,
        )}
        aria-hidden
      />
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
  const [primaryMetric, setPrimaryMetric] = useState<AnalyticsPrimaryMetric>("views");

  const isSeriesScope = scopeCategory === "series";

  const seriesDummy = useMemo(
    () => getContentDummy(scopeCategory, periodRange, seriesId, characterId, scenarioId),
    [scopeCategory, periodRange, seriesId, characterId, scenarioId],
  );

  const episodeStats = useMemo(() => {
    if (!isSeriesScope || statsEpisodeNo === "all") return null;
    return getEpisodePrimaryStatsDummy(seriesId, statsEpisodeNo, periodRange);
  }, [isSeriesScope, statsEpisodeNo, seriesId, periodRange]);

  const primaryStats = episodeStats?.primary ?? seriesDummy.primary;
  const primaryChartSeries = episodeStats?.chartSeries ?? seriesDummy.chartSeries;

  /** 인기/주의 TOP5 — 범위·선택 작품/캐릭터에 맞는 하위 단위 */
  const popularTop5Rows = useMemo<AnalyticsTopFiveRow[]>(
    () => getScopedTop5Dummy(scopeCategory, periodRange, seriesId, characterId, scenarioId, "popular"),
    [scopeCategory, periodRange, seriesId, characterId, scenarioId],
  );
  const attentionTop5Rows = useMemo<AnalyticsTopFiveRow[]>(
    () => getScopedTop5Dummy(scopeCategory, periodRange, seriesId, characterId, scenarioId, "attention"),
    [scopeCategory, periodRange, seriesId, characterId, scenarioId],
  );

  return (
    <div className={`flex flex-col items-start justify-start ${PAGE_GUTTER_GAP_CLASS} self-stretch px-0`}>
      <AnalyticsPanel>
        <Title2 text="주요통계" variant="title" asSectionHeader />

        <div className={ANALYTICS_KEY_STATS_ROW_CLASS}>
          {primaryStats.map((stat, i, arr) => {
            const selected = primaryMetric === stat.id;
            const label = PRIMARY_LABELS[stat.id];

            return (
              <button
                key={stat.id}
                type="button"
                onClick={() => setPrimaryMetric(stat.id)}
                aria-pressed={selected}
                aria-label={`${label} 통계 선택, 하단 그래프에 반영`}
                className={cn(
                  ANALYTICS_KEY_STAT_BUTTON_CLASS,
                  ANALYTICS_KEY_STAT_BUTTON_INTERACTION_CLASS,
                  i < arr.length - 1 && "border-r",
                  analyticsKeyStatButtonStateClass(selected),
                )}
              >
                <div className={analyticsKeyStatLabelClass(selected)}>{label}</div>
                <div className={analyticsKeyStatValueClass(selected)}>{stat.value}</div>
                <div className={cn(ANALYTICS_KEY_STAT_DELTA_CLASS, deltaClassName(stat.deltaTone))}>
                  {stat.delta}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-stretch gap-3 self-stretch px-0 py-10">
          <p className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "text-body3_500 text-foreground-muted")}>
            {PRIMARY_LABELS[primaryMetric] ?? "조회수"} 추이
          </p>
          <AnalyticsTrendLineChart
            metric={primaryMetric}
            periodRange={periodRange}
            valuesOverride={primaryChartSeries[primaryMetric]}
          />
        </div>
      </AnalyticsPanel>

      <div className={`flex w-full flex-col items-stretch ${PAGE_GUTTER_GAP_CLASS} lg:flex-row`}>
        <PopularContentsCard rows={popularTop5Rows} isSeriesScope={isSeriesScope} />
        <AttentionContentsCard rows={attentionTop5Rows} isSeriesScope={isSeriesScope} />
      </div>
    </div>
  );
}

type PopularCriterionId = "views" | "time" | "likes" | "followers";

function PopularContentsCard({
  rows,
  isSeriesScope,
}: {
  rows: readonly AnalyticsTopFiveRow[];
  isSeriesScope: boolean;
}) {
  const [popularCriterion, setPopularCriterion] = useState<PopularCriterionId>("views");

  return (
    <AnalyticsPanel className="w-full min-w-0 flex-1 lg:min-w-[260px]">
      <Title2
        text={isSeriesScope ? "인기 에피소드 TOP5" : "인기 콘텐츠 TOP5"}
        variant="title"
        asSectionHeader
      />
      <div className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "pt-3")}>
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

function AttentionContentsCard({
  rows,
  isSeriesScope,
}: {
  rows: readonly AnalyticsTopFiveRow[];
  isSeriesScope: boolean;
}) {
  const [attentionCriterion, setAttentionCriterion] = useState<AttentionCriterionId>("lowViews");
  const isEmpty = rows.length === 0;

  return (
    <AnalyticsPanel className="w-full min-w-0 flex-1 lg:min-w-[260px]">
      <Title2
        text={isSeriesScope ? "주의 필요한 에피소드 TOP5" : "주의 필요한 콘텐츠 TOP5"}
        variant="title"
        asSectionHeader
      />
      <div className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "pt-3")}>
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
      {isEmpty ? (
        <div className="flex h-[584px] flex-col items-center justify-center gap-4 p-5">
          <p className="text-body3_400 text-foreground-disabled">
            데이터가 충분하지 않아 이 보고서를 표시할 수 없습니다.
          </p>
        </div>
      ) : (
        <AnalyticsTopFiveRowList rows={rows} />
      )}
    </AnalyticsPanel>
  );
}
