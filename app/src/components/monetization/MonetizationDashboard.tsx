"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import {
  ANALYTICS_PERIOD_OPTIONS,
  getAnalyticsDateRangeLabel,
  getAnalyticsTrendPointCount,
  type AnalyticsPeriodRange,
} from "@/components/analytics/analytics-date";
import {
  ANALYTICS_TREND_LINE_FIXED_HEIGHT_CLASS,
  ANALYTICS_TREND_LINE_SHELL_CLASS,
} from "@/components/analytics/analytics-trend-chart-shell";
import { deltaClassName } from "@/components/analytics/analytics-dummy-by-scope";
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

function resampleMonetizationChartValues(full: readonly number[], targetLen: number): number[] {
  if (targetLen <= 0) return [];
  if (full.length === 0) return Array.from({ length: targetLen }, () => 0);
  if (targetLen === 1) return [full[full.length - 1] ?? 0];
  if (full.length === 1) return Array.from({ length: targetLen }, () => full[0] ?? 0);

  // targetLen이 원본 길이보다 커도 마지막 값을 반복하지 않고, 전 구간을 선형 보간한다.
  return Array.from({ length: targetLen }, (_, i) => {
    const t = i / (targetLen - 1);
    const idx = t * (full.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    const f = idx - lo;
    return Math.round((full[lo] ?? 0) * (1 - f) + (full[hi] ?? 0) * f);
  });
}

const MONETIZATION_TOTAL_REVENUE_ALL = 32_324_522;
const MONETIZATION_OPERATION_DAYS = 365 * 2;

const MONETIZATION_REVENUE_STATS = [
  { label: "즉시정산 가능 금액", value: "₩1,442" },
  { label: "5월 정산 예상 수익금", value: "₩321,213" },
  { label: "누적 수익금", value: `₩${MONETIZATION_TOTAL_REVENUE_ALL.toLocaleString("ko-KR")}` },
] as const;

const MONETIZATION_KEY_STATS_ROWS = [
  { id: "expectedRevenue", label: "수익금" },
  { id: "purchaseCount", label: "구매 수" },
  { id: "purchaseRate", label: "구매 전환율" },
] as const;

type MonetizationStatId = (typeof MONETIZATION_KEY_STATS_ROWS)[number]["id"];

const MONETIZATION_STAT_DUMMY = {
  expectedRevenue: {
    baseValue: 4522,
    seriesTemplate: [22, 9, 37, 14, 45, 18, 62] as const,
  },
  purchaseCount: {
    baseValue: 1842,
    seriesTemplate: [18, 24, 16, 29, 21, 35, 26] as const,
  },
  purchaseRate: {
    baseValue: 27.4,
    seriesTemplate: [14, 17, 15, 20, 18, 23, 27] as const,
  },
} as const;

const MONETIZATION_PERIOD_MULTIPLIER: Record<AnalyticsPeriodRange, number> = {
  "7d": 1,
  "30d": 1.24,
  "90d": 1.62,
  "365d": 2.18,
  all: 2.86,
};

/**
 * 가설: 서비스 운영 2년(730일), 누적 수익금은 `MONETIZATION_TOTAL_REVENUE_ALL`.
 * 최근 기간이 더 높은 추세를 보이도록 기간별 수익금을 분배한 더미.
 */
const MONETIZATION_REVENUE_BY_PERIOD: Record<AnalyticsPeriodRange, number> = {
  "7d": 486_000,
  "30d": 2_040_000,
  "90d": 6_120_000,
  "365d": 18_790_000,
  all: MONETIZATION_TOTAL_REVENUE_ALL,
};

const MONETIZATION_REVENUE_TOP5: AnalyticsTopFiveRow[] = [
  { rank: 1, badge: "캐릭터", title: "캐릭터 A 심층 설정", tone: "character", countLabel: "12,840,000", countSuffix: "원" },
  { rank: 2, badge: "상황공략", title: "상황공략 #12 첫 대화", tone: "scenario", countLabel: "8,210,000", countSuffix: "원" },
  { rank: 3, badge: "시리즈", title: "캐릭터 B 스페셜 에피소드", tone: "series", countLabel: "5,930,000", countSuffix: "원" },
  { rank: 4, badge: "시리즈", title: "주말 한정 에피소드", tone: "seriesBlue", countLabel: "3,420,000", countSuffix: "원" },
  { rank: 5, badge: "상황공략", title: "상황공략 #08 후속편", tone: "scenario", countLabel: "1,924,000", countSuffix: "원" },
];

const MONETIZATION_REVENUE_LOW5: AnalyticsTopFiveRow[] = [
  { rank: 1, badge: "시리즈", title: "튜토리얼 프롤로그", tone: "series", countLabel: "84,000", countSuffix: "원" },
  { rank: 2, badge: "캐릭터", title: "캐릭터 C 서브 설정", tone: "character", countLabel: "96,000", countSuffix: "원" },
  { rank: 3, badge: "상황공략", title: "상황공략 #03", tone: "scenario", countLabel: "122,000", countSuffix: "원" },
  { rank: 4, badge: "시리즈", title: "재편집 하이라이트", tone: "seriesBlue", countLabel: "149,000", countSuffix: "원" },
  { rank: 5, badge: "캐릭터", title: "캐릭터 D 첫 공개", tone: "character", countLabel: "181,000", countSuffix: "원" },
];

const MONETIZATION_REVENUE_PREV_BY_PERIOD: Record<AnalyticsPeriodRange, number | null> = {
  "7d": 462_000,
  "30d": 1_910_000,
  "90d": 5_700_000,
  "365d": 17_220_000,
  all: null,
};

const MONETIZATION_PREV_PERIOD: Record<AnalyticsPeriodRange, AnalyticsPeriodRange | null> = {
  "7d": null,
  "30d": "7d",
  "90d": "30d",
  "365d": "90d",
  all: "365d",
};

function formatMonetizationStatValue(statId: MonetizationStatId, value: number): string {
  if (statId === "expectedRevenue") return `₩${Math.round(value).toLocaleString("ko-KR")}`;
  if (statId === "purchaseCount") return Math.round(value).toLocaleString("ko-KR");
  return `${value.toFixed(1)}%`;
}

function getMonetizationDelta(
  statId: MonetizationStatId,
  currentValue: number,
  prevValue: number | null,
): { text: string; tone: "gain" | "loss" | "neutral" } {
  if (prevValue == null || prevValue <= 0) return { text: "—", tone: "neutral" };
  const diff = currentValue - prevValue;
  if (Math.abs(diff) < 0.0001) return { text: "0", tone: "neutral" };

  const sign = diff > 0 ? "+" : "";
  if (statId === "purchaseRate") {
    const pctPoint = `${sign}${diff.toFixed(1)}%p`;
    const relative = `${sign}${Math.round((diff / prevValue) * 100)}%`;
    return { text: `${pctPoint} (${relative})`, tone: diff > 0 ? "gain" : "loss" };
  }

  const formattedDiff = `${sign}${Math.round(diff).toLocaleString("ko-KR")}`;
  const relative = `${sign}${Math.round((diff / prevValue) * 100)}%`;
  return { text: `${formattedDiff} (${relative})`, tone: diff > 0 ? "gain" : "loss" };
}

function MonetizationRevenueSummaryCard() {
  return (
    <div className="inline-flex w-full flex-col items-center justify-start overflow-hidden rounded-[4px] border border-border-10 bg-surface-10 shadow-none drop-shadow-none">
      <div className="flex h-fit w-full items-center justify-between self-stretch border-b border-border-10 px-5 py-3">
        <div className="text-base font-bold leading-6 text-on-surface-10">수익금</div>
        <Link
          href="/monetization/settlements"
          className={cn(analyticsOutlineChipClassName, "h-9 min-w-0 px-3 text-sm")}
        >
          정산신청 및 내역
        </Link>
      </div>
      <div className="inline-flex w-full flex-wrap items-stretch justify-start self-stretch sm:flex-nowrap">
        {MONETIZATION_REVENUE_STATS.map((stat, i, arr) => (
          <div
            key={stat.label}
            className={cn(
              "inline-flex h-40 min-w-[120px] flex-1 flex-col items-center justify-center gap-1 bg-surface-10 px-5 py-10 sm:min-w-0",
              i < arr.length - 1 && "sm:border-r",
            )}
          >
            <div className="text-center text-sm font-medium leading-5 text-on-surface-20">{stat.label}</div>
            <div className="text-center text-2xl font-bold leading-8 text-on-surface-10">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonetizationDashboard() {
  const [scopeCategory, setScopeCategory] = useState<AnalyticsScopeCategoryId>("all");
  const [periodRange, setPeriodRange] = useState<AnalyticsPeriodRange>("7d");
  const [selectedMonetizationStat, setSelectedMonetizationStat] = useState<
    (typeof MONETIZATION_KEY_STATS_ROWS)[number]["id"]
  >("expectedRevenue");
  const setPeriodRangeDeferred = useCallback((v: AnalyticsPeriodRange) => {
    queueMicrotask(() => setPeriodRange(v));
  }, []);
  const periodLabel =
    ANALYTICS_PERIOD_OPTIONS.find((o) => o.value === periodRange)?.label ?? "7일 전";
  const dateRangeLabel = useMemo(
    () => getAnalyticsDateRangeLabel(periodRange, new Date()),
    [periodRange],
  );
  const monetizationStatValues = useMemo(() => {
    const currentMultiplier = MONETIZATION_PERIOD_MULTIPLIER[periodRange];
    const prevPeriod = MONETIZATION_PREV_PERIOD[periodRange];
    const prevMultiplier = prevPeriod ? MONETIZATION_PERIOD_MULTIPLIER[prevPeriod] : null;

    return {
      expectedRevenue: (() => {
        const current = MONETIZATION_REVENUE_BY_PERIOD[periodRange];
        const prev = MONETIZATION_REVENUE_PREV_BY_PERIOD[periodRange];
        return {
          value: formatMonetizationStatValue("expectedRevenue", current),
          ...getMonetizationDelta("expectedRevenue", current, prev),
        };
      })(),
      purchaseCount: (() => {
        const current = MONETIZATION_STAT_DUMMY.purchaseCount.baseValue * currentMultiplier;
        const prev =
          prevMultiplier == null ? null : MONETIZATION_STAT_DUMMY.purchaseCount.baseValue * prevMultiplier;
        return {
          value: formatMonetizationStatValue("purchaseCount", current),
          ...getMonetizationDelta("purchaseCount", current, prev),
        };
      })(),
      purchaseRate: (() => {
        const current = MONETIZATION_STAT_DUMMY.purchaseRate.baseValue + (currentMultiplier - 1) * 6.8;
        const prev =
          prevMultiplier == null ? null : MONETIZATION_STAT_DUMMY.purchaseRate.baseValue + (prevMultiplier - 1) * 6.8;
        return {
          value: formatMonetizationStatValue("purchaseRate", current),
          ...getMonetizationDelta("purchaseRate", current, prev),
        };
      })(),
    };
  }, [periodRange]);
  const monetizationChartValues = useMemo(
    () => {
      const baseSeries = MONETIZATION_STAT_DUMMY[selectedMonetizationStat].seriesTemplate;
      const scaledSeries = baseSeries.map((v) =>
        selectedMonetizationStat === "purchaseRate"
          ? Math.round((v + (MONETIZATION_PERIOD_MULTIPLIER[periodRange] - 1) * 8) * 10) / 10
          : Math.round(v * MONETIZATION_PERIOD_MULTIPLIER[periodRange]),
      );
      return resampleMonetizationChartValues(scaledSeries, getAnalyticsTrendPointCount(periodRange));
    },
    [periodRange, selectedMonetizationStat],
  );

  return (
    <div className="flex w-full flex-col items-stretch">
      <div className="flex flex-col items-start justify-start gap-5 self-stretch px-0 pt-5 pb-10">
        <MonetizationRevenueSummaryCard />
        <div className="flex flex-col items-start justify-start gap-2 self-stretch">
          <div className="mt-5 inline-flex items-center justify-between self-stretch">
            <div className="flex flex-wrap items-center justify-start gap-2" role="group" aria-label="콘텐츠 범위">
              {ANALYTICS_SCOPE_CHIPS.map(({ id, label }) => {
                const selected = scopeCategory === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setScopeCategory(id)}
                    className={
                      selected ? analyticsFilledSecondaryChipClassName : analyticsScopeChipInactiveClassName
                    }
                  >
                    <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-base font-medium leading-5">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-end justify-end gap-3">
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
                    onValueChange={(v) => setPeriodRangeDeferred(v as AnalyticsPeriodRange)}
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
                  {monetizationStatValues[stat.id].value}
                </div>
                <div
                  className={cn(
                    "justify-center text-center text-sm font-normal leading-5",
                    deltaClassName(monetizationStatValues[stat.id].tone),
                  )}
                >
                  {monetizationStatValues[stat.id].text}
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
            <AnalyticsTopFiveRowList rows={MONETIZATION_REVENUE_TOP5} />
          </AnalyticsPanel>
          <AnalyticsPanel className="w-full min-w-0 flex-1 lg:min-w-[260px]">
            <Title2 text="개선 필요 콘텐츠 TOP5" variant="title" asSectionHeader />
            <AnalyticsTopFiveRowList rows={MONETIZATION_REVENUE_LOW5} />
          </AnalyticsPanel>
        </div>
      </div>
    </div>
  );
}
