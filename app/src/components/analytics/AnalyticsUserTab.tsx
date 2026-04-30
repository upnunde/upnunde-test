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
import type { AnalyticsUserMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import {
  ANALYTICS_PERIOD_OPTIONS,
  type AnalyticsPeriodRange,
} from "@/components/analytics/analytics-date";
import {
  analyticsFilledSecondaryChipClassName,
  analyticsOutlineChipClassName,
  analyticsScopeChipInactiveClassName,
} from "@/components/analytics/analytics-filter-chips";
import { AnalyticsTopFiveRowList } from "@/components/analytics/AnalyticsRankParts";
import {
  ANALYTICS_SCOPE_CHIPS,
  type AnalyticsScopeCategoryId,
} from "@/components/analytics/analytics-scope-category";
import { deltaClassName, getContentDummy, getUserDummy } from "@/components/analytics/analytics-dummy-by-scope";
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
      <div className="h-[320px] w-full animate-pulse rounded-[4px] bg-slate-100" aria-hidden />
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
      <div className="h-3 w-full animate-pulse rounded-full bg-primary-primary-container" aria-hidden />
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
      <div className="h-4 w-full animate-pulse rounded-[999px] bg-primary-primary-container" aria-hidden />
    ),
  },
);

type RevisitSegmentId = "once" | "twice" | "threePlus";

type AudienceTabId = "all" | "general" | "follower";

const NICKNAME_PREFIXES = [
  "달빛",
  "모노",
  "하늘",
  "코코",
  "별빛",
  "루나",
  "토리",
  "밀키",
  "도토리",
  "바닐라",
] as const;

const NICKNAME_SUFFIXES = [
  "고양이",
  "토끼",
  "펭귄",
  "여우",
  "곰돌이",
  "나무",
  "파도",
  "구름",
  "냥",
  "별",
] as const;

function hashNick(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

const ACTIVE_FOLLOWER_NICKS = Array.from({ length: 10 }, (_, i) => {
  const seed = `follower-${i + 1}`;
  const h = hashNick(seed);
  const prefix = NICKNAME_PREFIXES[h % NICKNAME_PREFIXES.length] ?? "달빛";
  const suffix = NICKNAME_SUFFIXES[(h >>> 4) % NICKNAME_SUFFIXES.length] ?? "냥";
  return `${prefix}${suffix}`;
});

function getFollowerDummyProfileUrl(nick: string): string {
  const seed = encodeURIComponent(nick);
  return `https://api.dicebear.com/9.x/adventurer-neutral/png?seed=${seed}&radius=50&size=128`;
}

function LegendRow({ dotClass, label, value }: { dotClass: string; label: string; value: string }) {
  return (
    <div className="inline-flex h-5 w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("h-3 w-3 shrink-0 rounded-full", dotClass)} />
        <span className="text-sm font-medium leading-5 text-on-surface-20">{label}</span>
      </div>
      <span className="text-sm font-medium leading-5 text-on-surface-20">{value}</span>
    </div>
  );
}

const USER_PRIMARY_LABELS: Record<AnalyticsUserMetric, string> = {
  userCount: "이용자 수",
  newFollowers: "새 팔로워",
  totalFollowers: "총 팔로워",
};

export function AnalyticsUserTab({
  periodRange,
  onPeriodRangeChange,
  dateRangeLabel,
}: {
  periodRange: AnalyticsPeriodRange;
  onPeriodRangeChange: (v: AnalyticsPeriodRange) => void;
  dateRangeLabel: string;
}) {
  const [scopeCategory, setScopeCategory] = useState<AnalyticsScopeCategoryId>("all");
  const [userMetric, setUserMetric] = useState<AnalyticsUserMetric>("userCount");
  const [revisitSegment, setRevisitSegment] = useState<RevisitSegmentId>("once");
  const [audienceGender, setAudienceGender] = useState<AudienceTabId>("all");
  const [audienceAge, setAudienceAge] = useState<AudienceTabId>("all");
  const [audienceTimeSegment, setAudienceTimeSegment] = useState<AudienceTabId>("all");
  const [ageBand, setAgeBand] = useState("all");
  const [genderBand, setGenderBand] = useState("all");
  const periodLabel =
    ANALYTICS_PERIOD_OPTIONS.find((o) => o.value === periodRange)?.label ?? "7일 전";
  const userDummy = getUserDummy(scopeCategory);
  const contentDummyForRevisit = getContentDummy(scopeCategory);
  const revisitRates = contentDummyForRevisit.revisit[revisitSegment];
  const followerFavoriteRows = userDummy.listA.map((r, i) => ({
    ...r,
    countLabel: userDummy.listBCounts[i] ?? "0",
  }));

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
          <div className="flex shrink-0 items-end justify-end gap-3">
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
                  "flex min-w-[140px] flex-1 flex-col items-center gap-1 border-b border-border-10 px-5 py-10 text-left outline-none transition-colors",
                  i < arr.length - 1 && "border-r border-border-10",
                  selected ? "bg-white" : "bg-surface-disabled-10 hover:bg-surface-10/80",
                )}
              >
                <span className="text-center text-sm font-medium leading-5 text-on-surface-20">{label}</span>
                <span className="text-center text-2xl font-bold leading-8 text-on-surface-10">{stat.value}</span>
                <div className="inline-flex items-center justify-center gap-1">
                  <span className={cn("text-sm font-normal leading-5", deltaClassName(stat.deltaTone))}>
                    {stat.delta}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col items-stretch gap-3 self-stretch px-0 py-10">
          <p className="px-5 text-sm font-medium leading-5 text-on-surface-20">
            {USER_PRIMARY_LABELS[userMetric] ?? "이용자 수"} 추이
          </p>
          <AnalyticsTrendLineChart metric={userMetric} valuesOverride={userDummy.chartSeries[userMetric]} />
        </div>
      </AnalyticsPanel>

      <AnalyticsPanel>
        <Title2 text="이용자 재방문률" variant="title" asSectionHeader />
        <div className="mb-2 mt-2 inline-flex flex-col items-start justify-start gap-2.5 self-stretch px-5 pb-0 pt-0">
          <SegmentedTextTabs
            aria-label="재방문 횟수 구간"
            items={[
              { id: "once", label: "1회" },
              { id: "twice", label: "2회" },
              { id: "threePlus", label: "3회 이상" },
            ]}
            activeId={revisitSegment}
            onSelect={(id) => setRevisitSegment(id as RevisitSegmentId)}
            size="m"
            tabListClassName="self-stretch"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-3 self-stretch rounded-lg px-5 pb-5 pt-3">
          <div
            className="flex h-4 w-full items-center"
            role="img"
            aria-label={`재방문 비율 막대 다시 방문함 ${revisitRates.revisitPct}퍼센트`}
          >
            <AnalyticsRevisitStackedBarChart
              key={revisitSegment}
              revisitPercent={revisitRates.revisitPct}
              noRevisitPercent={revisitRates.noRevisitPct}
              className="w-full"
            />
          </div>
          <div className="inline-flex items-start justify-between self-stretch">
            <div className="inline-flex flex-1 flex-col items-start justify-center gap-0.5">
              <div className="text-justify text-xl font-bold leading-7 text-on-surface-10">
                {revisitRates.revisitPct.toFixed(1)}%
              </div>
              <div className="text-justify text-sm font-normal leading-5 text-on-surface-20">다시 방문함</div>
            </div>
            <div className="inline-flex flex-1 flex-col items-end justify-center gap-0.5">
              <div className="text-justify text-xl font-bold leading-7 text-on-surface-10">
                {revisitRates.noRevisitPct.toFixed(1)}%
              </div>
              <div className="text-justify text-sm font-normal leading-5 text-on-surface-20">재방문 안 함</div>
            </div>
          </div>
        </div>
      </AnalyticsPanel>

      <div className="inline-flex w-full flex-col items-stretch gap-5 lg:inline-flex lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <AnalyticsPanel>
            <Title2 text="연령 및 성별" variant="title" asSectionHeader />
            <div className="flex flex-col gap-3 px-5 pt-3">
              <div className="flex min-w-0 flex-nowrap items-center gap-4 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <SegmentedTextTabs
                  aria-label="연령 필터"
                  items={[
                    { id: "all", label: "모든 연령" },
                    { id: "10", label: "10대" },
                    { id: "20", label: "20대" },
                    { id: "30", label: "30대" },
                    { id: "40", label: "40대" },
                    { id: "50", label: "50대 이상" },
                  ]}
                  activeId={ageBand}
                  onSelect={setAgeBand}
                  size="m"
                />
                <div className="hidden h-4 w-px bg-border-20 sm:block" aria-hidden />
                <SegmentedTextTabs
                  aria-label="성별 필터"
                  items={[
                    { id: "all", label: "전체" },
                    { id: "male", label: "남성" },
                    { id: "female", label: "여성" },
                  ]}
                  activeId={genderBand}
                  onSelect={setGenderBand}
                  size="m"
                />
              </div>
            </div>
            <AnalyticsTopFiveRowList rows={userDummy.listA} />
          </AnalyticsPanel>

          <AnalyticsPanel>
            <Title2 text="내 팔로워가 좋아하는 콘텐츠" variant="title" asSectionHeader />
            <AnalyticsTopFiveRowList rows={followerFavoriteRows} />
          </AnalyticsPanel>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
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
          <SimpleDistributionPanel
            title="이용 시간대"
            audienceTab={audienceTimeSegment}
            onAudienceChange={setAudienceTimeSegment}
            stackValues={userDummy.timeOfDay.flex}
            legend={[
              { label: "00시~06시", value: userDummy.timeOfDay.legend[0] },
              { label: "06시~12시", value: userDummy.timeOfDay.legend[1] },
              { label: "12시~18시", value: userDummy.timeOfDay.legend[2] },
              { label: "18시~00시", value: userDummy.timeOfDay.legend[3] },
            ]}
          />

          <AnalyticsPanel>
            <Title2 text="가장 적극 활동중인 팔로워" variant="title" asSectionHeader />
            <div className="grid grid-cols-5 justify-items-center gap-x-5 gap-y-6 p-5">
              {ACTIVE_FOLLOWER_NICKS.map((nick) => (
                <div key={nick} className="flex w-full max-w-28 flex-col items-center justify-center gap-2">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-zinc-100">
                    <img
                      src={getFollowerDummyProfileUrl(nick)}
                      alt={`${nick} 프로필`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="w-full text-center text-[13px] font-normal leading-5 text-on-surface-20">{nick}</span>
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
      <div className="px-5 pt-3">
        <SegmentedTextTabs
          aria-label={`${title} 기준`}
          items={[
            { id: "all", label: "전체" },
            { id: "general", label: "일반 이용자" },
            { id: "follower", label: "팔로워" },
          ]}
          activeId={audienceTab}
          onSelect={(id) => onAudienceChange(id as AudienceTabId)}
          size="m"
        />
      </div>
      <div className="flex flex-col gap-5 p-5">
        <AnalyticsDistributionStackedBarChart values={stackValues} />
        <div className="flex flex-col gap-2.5">
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
        <div className="px-5 pt-3">
          <SegmentedTextTabs
            aria-label={`${title} 기준`}
            items={[
              { id: "all", label: "전체" },
              { id: "general", label: "일반 이용자" },
              { id: "follower", label: "팔로워" },
            ]}
            activeId={audienceTab}
            onSelect={(id) => onAudienceChange(id as AudienceTabId)}
            size="m"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-5 p-5">
        <AnalyticsDistributionStackedBarChart values={stackValues} />
        <div className="flex flex-col gap-2.5">
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
