"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Title2 } from "@/components/ui/title2";
import { Tabs, TabsList, TabsTrigger } from "design-system/ui/tabs";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { AnalyticsViewerHourlyActivityChart } from "@/components/analytics/AnalyticsViewerHourlyActivityChart";
import {
  ANALYTICS_KEY_STAT_BUTTON_INTERACTION_CLASS,
  analyticsKeyStatButtonStateClass,
  analyticsKeyStatLabelClass,
  analyticsKeyStatValueClass,
} from "@/components/analytics/analytics-key-stats-layout";
import {
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  PAGE_GUTTER_GAP_CLASS
} from "@/lib/page-layout";
import { cn } from "design-system/utils";
import type { AnalyticsUserMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import { type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import { analyticsScopeFilterDividerClassName } from "@/components/analytics/analytics-filter-chips";
import { AnalyticsTopFiveRowList } from "@/components/analytics/AnalyticsRankParts";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import type { AnalyticsCharacterId } from "@/components/analytics/analytics-character-options";
import type { AnalyticsScenarioId } from "@/components/analytics/analytics-scenario-options";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import {
  deltaClassName,
  getContentDummy,
  getUserDummy,
  getUserTimeOfDayHourlyDummy,
} from "@/components/analytics/analytics-dummy-by-scope";
import {
  ANALYTICS_TREND_LINE_FIXED_HEIGHT_CLASS,
  ANALYTICS_TREND_LINE_SHELL_CLASS,
} from "@/components/analytics/analytics-trend-chart-shell";
import {
  ANALYTICS_PRIMARY_DESCENDING_DOT_CLASSES,
  mapPaletteByDescendingRank,
} from "@/lib/analytics-distribution-constants";

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

const AnalyticsDistributionStackedBarChart = dynamic(
  () =>
    import("@/components/analytics/AnalyticsDistributionStackedBarChart").then(
      (m) => m.AnalyticsDistributionStackedBarChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-3 w-full animate-pulse rounded-full bg-primary-container" aria-hidden />
    ),
  },
);

const AnalyticsRevisitStackedBarChart = dynamic(
  () =>
    import("@/components/analytics/AnalyticsRevisitStackedBarChart").then(
      (m) => m.AnalyticsRevisitStackedBarChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-4 w-full animate-pulse rounded-[999px] bg-primary-container" aria-hidden />
    ),
  },
);

type RevisitSegmentId = "once" | "twice" | "threePlus";

type AudienceTabId = "all" | "general" | "follower";

function getFollowerDummyProfileUrl(nick: string): string {
  const seed = encodeURIComponent(nick);
  return `https://api.dicebear.com/9.x/adventurer-neutral/png?seed=${seed}&radius=50&size=128`;
}

function LegendRow({ dotClass, label, value }: { dotClass: string; label: string; value: string }) {
  return (
    <div className="inline-flex h-5 w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("h-3 w-3 shrink-0 rounded-full", dotClass)} />
        <span className="text-body3_500 text-foreground-muted">{label}</span>
      </div>
      <span className="text-body3_500 text-foreground-muted">{value}</span>
    </div>
  );
}

const USER_PRIMARY_LABELS: Record<AnalyticsUserMetric, string> = {
  userCount: "이용자 수",
  totalFollowers: "팔로워",
};

export function AnalyticsUserTab({
  periodRange,
  scopeCategory,
  seriesId,
  characterId,
  scenarioId,
}: {
  periodRange: AnalyticsPeriodRange;
  scopeCategory: AnalyticsScopeCategoryId;
  seriesId: AnalyticsSeriesId;
  characterId: AnalyticsCharacterId;
  scenarioId: AnalyticsScenarioId;
}) {
  const [userMetric, setUserMetric] = useState<AnalyticsUserMetric>("userCount");
  const [revisitSegment, setRevisitSegment] = useState<RevisitSegmentId>("once");
  const [audienceGender, setAudienceGender] = useState<AudienceTabId>("all");
  const [audienceAge, setAudienceAge] = useState<AudienceTabId>("all");
  const [audienceTimeSegment, setAudienceTimeSegment] = useState<AudienceTabId>("all");
  const [ageBand, setAgeBand] = useState("all");
  const [genderBand, setGenderBand] = useState("all");
  const userDummy = useMemo(
    () => getUserDummy(scopeCategory, periodRange, seriesId, characterId, scenarioId),
    [scopeCategory, periodRange, seriesId, characterId, scenarioId],
  );
  const timeOfDayHourlyForPeriod = useMemo(
    () => getUserTimeOfDayHourlyDummy(scopeCategory, periodRange, seriesId, characterId, scenarioId),
    [scopeCategory, periodRange, seriesId, characterId, scenarioId],
  );
  const contentDummyForRevisit = useMemo(
    () => getContentDummy(scopeCategory, periodRange, seriesId, characterId, scenarioId),
    [scopeCategory, periodRange, seriesId, characterId, scenarioId],
  );
  const revisitRates = contentDummyForRevisit.revisit[revisitSegment];
  const followerFavoriteRows = userDummy.listA.map((r, i) => ({
    ...r,
    countLabel: userDummy.listBCounts[i] ?? "0",
  }));

  return (
    <div className={`flex flex-col items-start justify-start ${PAGE_GUTTER_GAP_CLASS} self-stretch px-0`}>
      <AnalyticsPanel>
        <Title2 text="주요통계" variant="title" asSectionHeader />
        <div className="inline-flex w-full flex-wrap items-stretch sm:flex-nowrap">
          {userDummy.primary.map((stat, i, arr) => {
            const selected = userMetric === stat.id;
            const label = USER_PRIMARY_LABELS[stat.id];
            return (
              <button
                key={stat.id}
                type="button"
                onClick={() => setUserMetric(stat.id)}
                aria-pressed={selected}
                className={cn(
                  "flex min-w-[140px] flex-1 flex-col items-center gap-1 border-b border-border py-10 text-left",
                  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
                  ANALYTICS_KEY_STAT_BUTTON_INTERACTION_CLASS,
                  i < arr.length - 1 && "border-r border-border",
                  analyticsKeyStatButtonStateClass(selected),
                )}
              >
                <span className={analyticsKeyStatLabelClass(selected)}>{label}</span>
                <span className={analyticsKeyStatValueClass(selected)}>{stat.value}</span>
                <div className="inline-flex items-center justify-center gap-1">
                  <span className={cn("text-body3_400", deltaClassName(stat.deltaTone))}>
                    {stat.delta}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col items-stretch gap-3 self-stretch px-0 py-10">
          <p className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "text-body3_500 text-foreground-muted")}>
            {USER_PRIMARY_LABELS[userMetric] ?? "이용자 수"} 추이
          </p>
          <AnalyticsTrendLineChart
            metric={userMetric}
            periodRange={periodRange}
            valuesOverride={userDummy.chartSeries[userMetric]}
          />
        </div>
      </AnalyticsPanel>

      <AnalyticsPanel>
        <Title2 text="이용자 재방문률" variant="title" asSectionHeader />
        <div className={cn("mb-2 mt-2 inline-flex flex-col items-start justify-start gap-2 self-stretch pb-0 pt-0", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
          <Tabs value={revisitSegment} onValueChange={(v) => setRevisitSegment(v as RevisitSegmentId)}>
            <TabsList variant="line" size="sm" aria-label="재방문 횟수 구간" className="self-stretch">
              <TabsTrigger value="once">1회</TabsTrigger>
              <TabsTrigger value="twice">2회</TabsTrigger>
              <TabsTrigger value="threePlus">3회 이상</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col items-start justify-start gap-3 self-stretch rounded-lg pb-5 pt-3">
          <div
            className="flex h-4 w-full items-center"
            role="img"
            aria-label={`재방문 비율 막대 다시 방문함 ${revisitRates.revisitPct}퍼센트`}
          >
            <AnalyticsRevisitStackedBarChart
              key={revisitSegment}
              revisitPercent={revisitRates.revisitPct}
              noRevisitPercent={revisitRates.noRevisitPct}
            />
          </div>
          <div className={cn("inline-flex items-start justify-between self-stretch", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
            <div className="inline-flex flex-1 flex-col items-start justify-center gap-0.5">
              <div className="text-justify text-heading4_700 text-foreground">
                {revisitRates.revisitPct.toFixed(1)}%
              </div>
              <div className="text-justify text-body3_400 text-foreground-muted">다시 방문함</div>
            </div>
            <div className="inline-flex flex-1 flex-col items-end justify-center gap-0.5">
              <div className="text-justify text-heading4_700 text-foreground">
                {revisitRates.noRevisitPct.toFixed(1)}%
              </div>
              <div className="text-justify text-body3_400 text-foreground-muted">재방문 안 함</div>
            </div>
          </div>
        </div>
      </AnalyticsPanel>

      <div className={`inline-flex w-full flex-col items-stretch ${PAGE_GUTTER_GAP_CLASS} lg:inline-flex lg:flex-row`}>
        <div className={`flex min-w-0 flex-1 flex-col ${PAGE_GUTTER_GAP_CLASS}`}>
          <AnalyticsPanel>
            <Title2 text="연령 및 성별" variant="title" asSectionHeader />
            <div className={cn("flex flex-col gap-3 pt-3", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
              <div className="flex min-w-0 flex-nowrap items-center gap-4 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <Tabs value={ageBand} onValueChange={setAgeBand}>
                  <TabsList variant="line" size="sm" aria-label="연령 필터">
                    <TabsTrigger value="all">전체</TabsTrigger>
                    <TabsTrigger value="10">10대</TabsTrigger>
                    <TabsTrigger value="20">20대</TabsTrigger>
                    <TabsTrigger value="30">30대</TabsTrigger>
                    <TabsTrigger value="40">40대</TabsTrigger>
                    <TabsTrigger value="50">50대 이상</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div
                  className={cn(analyticsScopeFilterDividerClassName, "self-center")}
                  role="separator"
                  aria-orientation="vertical"
                  aria-hidden
                />
                <Tabs value={genderBand} onValueChange={setGenderBand}>
                  <TabsList variant="line" size="sm" aria-label="성별 필터">
                    <TabsTrigger value="all">전체</TabsTrigger>
                    <TabsTrigger value="male">남성</TabsTrigger>
                    <TabsTrigger value="female">여성</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <AnalyticsTopFiveRowList rows={userDummy.listA} />
          </AnalyticsPanel>

          <AnalyticsPanel>
            <Title2 text="내 팔로워가 좋아하는 콘텐츠" variant="title" asSectionHeader />
            <AnalyticsTopFiveRowList rows={followerFavoriteRows} />
          </AnalyticsPanel>
        </div>

        <div className={`flex min-w-0 flex-1 flex-col ${PAGE_GUTTER_GAP_CLASS}`}>
          <AudienceBreakdownPanel
            title="이용자 성별"
            audienceTab={audienceGender}
            onAudienceChange={setAudienceGender}
            stackValues={userDummy.gender.flex}
            legend={[
              { label: "남성", value: userDummy.gender.legend[0] },
              { label: "여성", value: userDummy.gender.legend[1] },
              { label: "알 수 없음", value: userDummy.gender.legend[2] },
            ]}
          />
          <AudienceBreakdownPanel
            title="이용자 연령층"
            audienceTab={audienceAge}
            onAudienceChange={setAudienceAge}
            stackValues={userDummy.age.flex}
            legend={[
              { label: "10대", value: userDummy.age.legend[0] },
              { label: "20대", value: userDummy.age.legend[1] },
              { label: "30대", value: userDummy.age.legend[2] },
              { label: "40대", value: userDummy.age.legend[3] },
              { label: "50대 이상", value: userDummy.age.legend[4] },
            ]}
          />
          <SimpleDistributionPanel
            title="평균 이용시간"
            stackValues={userDummy.avgTime.flex}
            legend={[
              { label: "신규 이용자", value: userDummy.avgTime.legend[0] },
              { label: "일반 이용자", value: userDummy.avgTime.legend[1] },
              { label: "팔로워", value: userDummy.avgTime.legend[2] },
            ]}
          />
          <SimpleDistributionPanel
            title="이용자 구분"
            stackValues={userDummy.userMix.flex}
            legend={[
              { label: "신규 이용자", value: userDummy.userMix.legend[0] },
              { label: "일반 이용자", value: userDummy.userMix.legend[1] },
              { label: "팔로워", value: userDummy.userMix.legend[2] },
            ]}
          />
          <AnalyticsPanel>
            <Title2 text="이용 시간대" variant="title" asSectionHeader />
            <div className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "pt-3")}>
              <Tabs value={audienceTimeSegment} onValueChange={(v) => setAudienceTimeSegment(v as AudienceTabId)}>
                <TabsList variant="line" size="sm" aria-label="이용 시간대 기준">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="general">일반 이용자</TabsTrigger>
                  <TabsTrigger value="follower">팔로워</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="p-5">
              <AnalyticsViewerHourlyActivityChart
                hourlyWeights={timeOfDayHourlyForPeriod}
                periodRange={periodRange}
                scopeCategory={scopeCategory}
              />
            </div>
          </AnalyticsPanel>

          <AnalyticsPanel>
            <Title2 text="가장 적극 활동중인 팔로워" variant="title" asSectionHeader />
            <div className="grid grid-cols-3 justify-items-center gap-x-3 gap-y-4 px-4 py-5 sm:grid-cols-4 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-6 lg:p-5">
              {userDummy.activeFollowers.map(({ id, nick }) => (
                <div key={id} className="flex w-full min-w-0 max-w-28 flex-col items-center justify-center gap-2">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted sm:h-16 sm:w-16">
                    <img
                      src={getFollowerDummyProfileUrl(nick)}
                      alt={`${nick} 프로필`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="w-full truncate text-center text-caption1_400 text-foreground-muted sm:text-body4_400">
                    {nick}
                  </span>
                </div>
              ))}
            </div>
          </AnalyticsPanel>
        </div>
      </div>
    </div>
  );
}

function AudienceBreakdownPanel({
  title,
  audienceTab,
  onAudienceChange,
  stackValues,
  legend,
}: {
  title: string;
  audienceTab: AudienceTabId;
  onAudienceChange: (id: AudienceTabId) => void;
  stackValues: readonly number[];
  legend: { label: string; value: string }[];
}) {
  const dotClasses = mapPaletteByDescendingRank(stackValues, ANALYTICS_PRIMARY_DESCENDING_DOT_CLASSES);

  return (
    <AnalyticsPanel>
      <Title2 text={title} variant="title" asSectionHeader />
      <div className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "pt-3")}>
        <Tabs value={audienceTab} onValueChange={(v) => onAudienceChange(v as AudienceTabId)}>
          <TabsList variant="line" size="sm" aria-label={`${title} 기준`}>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="general">일반 이용자</TabsTrigger>
            <TabsTrigger value="follower">팔로워</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className={`flex flex-col ${PAGE_GUTTER_GAP_CLASS} pb-5 pt-3`}>
        <AnalyticsDistributionStackedBarChart values={stackValues} />
        <div className={cn("flex flex-col gap-2", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
          {legend.map((row, i) => (
            <LegendRow
              key={`${row.label}-${row.value}`}
              dotClass={dotClasses[i] ?? "bg-primary/25"}
              label={row.label}
              value={row.value}
            />
          ))}
        </div>
      </div>
    </AnalyticsPanel>
  );
}

function SimpleDistributionPanel({
  title,
  audienceTab,
  onAudienceChange,
  stackValues,
  legend,
}: {
  title: string;
  audienceTab?: AudienceTabId;
  onAudienceChange?: (id: AudienceTabId) => void;
  stackValues: readonly number[];
  legend: { label: string; value: string }[];
}) {
  const dotClasses = mapPaletteByDescendingRank(stackValues, ANALYTICS_PRIMARY_DESCENDING_DOT_CLASSES);

  return (
    <AnalyticsPanel>
      <Title2 text={title} variant="title" asSectionHeader />
      {audienceTab != null && onAudienceChange != null ? (
        <div className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "pt-3")}>
          <Tabs value={audienceTab} onValueChange={(v) => onAudienceChange(v as AudienceTabId)}>
            <TabsList variant="line" size="sm" aria-label={`${title} 기준`}>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="general">일반 이용자</TabsTrigger>
              <TabsTrigger value="follower">팔로워</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ) : null}
      <div className={`flex flex-col ${PAGE_GUTTER_GAP_CLASS} pb-5 pt-3`}>
        <AnalyticsDistributionStackedBarChart values={stackValues} />
        <div className={cn("flex flex-col gap-2", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
          {legend.map((row, i) => (
            <LegendRow
              key={`${row.label}-${row.value}`}
              dotClass={dotClasses[i] ?? "bg-primary/25"}
              label={row.label}
              value={row.value}
            />
          ))}
        </div>
      </div>
    </AnalyticsPanel>
  );
}
