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

/** 디자인 목업과 유사한 7포인트 시계열 — 조회 기간 버킷 수에 맞게 보간 */
const MONETIZATION_OVERVIEW_CHART_TEMPLATE = [18, 14, 21, 16, 31, 13, 48] as const;

function resampleMonetizationChartValues(full: readonly number[], targetLen: number): number[] {
  if (targetLen <= 0) return [];
  if (full.length === 0) return Array.from({ length: targetLen }, () => 0);
  if (targetLen === 1) return [full[full.length - 1] ?? 0];
  if (targetLen >= full.length) {
    return Array.from({ length: targetLen }, (_, i) => full[Math.min(i, full.length - 1)] ?? 0);
  }
  return Array.from({ length: targetLen }, (_, i) => {
    const t = i / (targetLen - 1);
    const idx = t * (full.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    const f = idx - lo;
    return Math.round((full[lo] ?? 0) * (1 - f) + (full[hi] ?? 0) * f);
  });
}

const MONETIZATION_REVENUE_STATS = [
  { label: "즉시정산 가능 금액", value: "₩1,442" },
  { label: "5월 정산 예상 수익금", value: "₩321,213" },
  { label: "누적 수익금", value: "₩32,324,522" },
] as const;

const MONETIZATION_KEY_STATS_ROWS = [
  { id: "expectedRevenue", label: "예상수익", value: "₩4,522", delta: "+3,112 (+76%)" },
  { id: "purchaseCount", label: "구매 수", value: "442", delta: "+3,112 (+76%)" },
  { id: "purchaseRate", label: "구매 전환율", value: "21%", delta: "+3,112 (+76%)" },
] as const;

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
  const monetizationChartValues = useMemo(
    () =>
      resampleMonetizationChartValues(
        MONETIZATION_OVERVIEW_CHART_TEMPLATE,
        getAnalyticsTrendPointCount(periodRange),
      ),
    [periodRange],
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
                  {stat.value}
                </div>
                <div
                  className={cn(
                    "justify-center text-center text-sm font-normal leading-5",
                    deltaClassName("gain"),
                  )}
                >
                  {stat.delta}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-stretch gap-3 self-stretch px-0 py-10">
            <p className="px-5 text-sm font-medium leading-5 text-on-surface-20">예상수익 추이</p>
            <AnalyticsTrendLineChart
              metric="views"
              periodRange={periodRange}
              valuesOverride={monetizationChartValues}
            />
          </div>
        </AnalyticsPanel>
      </div>
    </div>
  );
}
