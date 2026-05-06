"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import VChart from "@visactor/vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { getAnalyticsPeriodInclusiveDays, type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";

/** 제품 primary (`globals.css` --primary) */
const ANALYTICS_BAR_PRIMARY = "#F642D4";

/** 24시 정각 → 12시간제 시각 숫자(1~12) + 오전/오후 */
function hour24To12Parts(h: number): { h12: number; pm: boolean } {
  const x = ((h % 24) + 24) % 24;
  if (x === 0) return { h12: 12, pm: false };
  if (x < 12) return { h12: x, pm: false };
  if (x === 12) return { h12: 12, pm: true };
  return { h12: x - 12, pm: true };
}

/** 2시간 구간 축 라벨 — `12~2am`, `10~12pm` 등 (끝 시각 기준 am/pm 한 번만) */
function twoHourBinAmPmLabel(startHour: number): string {
  const endHour = startHour + 2;
  const a = hour24To12Parts(startHour);
  const b = hour24To12Parts(endHour);
  const suf = b.pm ? "pm" : "am";
  return `${a.h12}~${b.h12}${suf}`;
}

const TWO_HOUR_BIN_COUNT = 12;

/** 구간 이용자 수 표기 — 툴팁·요약·접근성 공통 (`1,234명`) */
function formatViewerCountKo(n: number): string {
  return `${Math.round(n).toLocaleString("ko-KR")}명`;
}

function tooltipTimeTitleFromDatum(datum: { hour?: string; hourStart?: number }): string {
  if (typeof datum.hour === "string" && datum.hour.length > 0) return datum.hour;
  const h = datum.hourStart;
  if (typeof h !== "number") return "";
  return formatPeakTwoHourRangeKo(h);
}

function formatPeakTwoHourRangeKo(startHour: number): string {
  return `${startHour}시~${startHour + 2}시`;
}

function buildSummaryLine(
  period: AnalyticsPeriodRange,
  peakBinStartHour: number,
  peakViewerSum: number,
): string {
  /* 축 라벨·툴팁 시간대 행과 동일 표기 */
  const range = twoHourBinAmPmLabel(peakBinStartHour);
  const count = formatViewerCountKo(peakViewerSum);
  const days = getAnalyticsPeriodInclusiveDays(period);
  if (days == null) {
    return `전체 기간 동안 이용자 수가 가장 많았던 시간대는 ${range}입니다 (${count})`;
  }
  return `지난 ${days}일 동안 이용자 수가 가장 많았던 시간대는 ${range}입니다 (${count})`;
}

/** 24시간 합계가 0 — 표시할 시간대 이용 데이터 없음 */
function summaryWhenNoHourlyActivity(scopeCategory: AnalyticsScopeCategoryId | undefined): string {
  if (scopeCategory === "character") {
    return "등록된 캐릭터 콘텐츠가 없어 시간대별 이용 현황을 표시할 수 없습니다.";
  }
  return "선택한 범위에서 시간대별 이용 데이터가 없습니다.";
}

/** 피크 2시간 구간 시작 시각(0,2,…,22)과 해당 구간 합산 이용자 수 */
function calcPeakTwoHourBin(weights: readonly number[]): { startHour: number; viewerSum: number } {
  let bestStart = 0;
  let maxSum = -Infinity;
  for (let i = 0; i < TWO_HOUR_BIN_COUNT; i++) {
    const start = i * 2;
    const sum = (weights[start] ?? 0) + (weights[start + 1] ?? 0);
    if (sum > maxSum) {
      maxSum = sum;
      bestStart = start;
    }
  }
  return { startHour: bestStart, viewerSum: maxSum === -Infinity ? 0 : maxSum };
}

function buildTwoHourBarSpec(
  hourlyWeights: readonly number[],
  options?: { showTooltip: boolean },
): IBarChartSpec {
  const showTooltip = options?.showTooltip ?? true;
  const values = Array.from({ length: TWO_HOUR_BIN_COUNT }, (_, i) => {
    const start = i * 2;
    const value = (hourlyWeights[start] ?? 0) + (hourlyWeights[start + 1] ?? 0);
    return {
      hour: twoHourBinAmPmLabel(start),
      /** 구간 시작 시각(0,2,…,22) — 툴팁·요약용 */
      hourStart: start,
      value,
    };
  });

  return {
    type: "bar",
    background: "transparent",
    padding: { top: 12, bottom: 8, left: 8, right: 8 },
    color: [ANALYTICS_BAR_PRIMARY],
    data: [{ id: "hourly", values }],
    xField: "hour",
    yField: "value",
    axes: [
      {
        orient: "bottom",
        type: "band",
        domainLine: { visible: true, style: { stroke: "#e2e8f0", lineWidth: 1 } },
        label: {
          style: {
            fontSize: 9,
            fill: "#64748b",
          },
        },
        tick: { visible: false },
      },
      {
        orient: "left",
        type: "linear",
        label: { visible: false },
        domainLine: { visible: false },
        tick: { visible: false },
        grid: {
          visible: true,
          style: {
            lineDash: [4, 4],
            stroke: "#e2e8f0",
            lineWidth: 1,
          },
        },
      },
    ],
    legends: [{ visible: false }],
    tooltip: showTooltip
      ? {
          visible: true,
          /** 막대 호버만 (축 교차 등 차원 툴팁 비활성) */
          activeType: ["mark"],
          mark: {
            /** 상단: 축과 동일 시간대 (`12~2am` 등) */
            title: {
              visible: true,
              value: (datum) => tooltipTimeTitleFromDatum(datum as { hour?: string; hourStart?: number }),
            },
            hasShape: true,
            shapeType: "square",
            shapeFill: ANALYTICS_BAR_PRIMARY,
            shapeSize: 8,
            content: [
              {
                key: () => "이용자 수",
                value: (datum) => {
                  const v = (datum as { value?: number }).value;
                  if (typeof v !== "number") return "";
                  return formatViewerCountKo(v);
                },
              },
            ],
          },
        }
      : { visible: false },
    series: [
      {
        type: "bar",
        dataIndex: 0,
        xField: "hour",
        yField: "value",
        barWidth: "60%",
        barMinHeight: 2,
      },
    ],
  };
}

export interface AnalyticsViewerHourlyActivityChartProps {
  className?: string;
  /** 길이 24, 0~23시 시간대별 이용자 수(동일 스케일·더미는 모의값). 막대는 2시간 구간 합산 */
  hourlyWeights: readonly number[];
  periodRange: AnalyticsPeriodRange;
  /** 상단 범위 칩 — 캐릭터·전 구간 0일 때 안내 문구 분기 */
  scopeCategory?: AnalyticsScopeCategoryId;
}

const CHART_HEIGHT_PX = 200;

/**
 * 시청자 24시간 이용 막대 그래프 — 2시간 단위 12개 막대, 호버 시 구간 이용자 수 (@visactor/vchart).
 */
export function AnalyticsViewerHourlyActivityChart({
  className,
  hourlyWeights,
  periodRange,
  scopeCategory,
}: AnalyticsViewerHourlyActivityChartProps) {
  const peakBin = useMemo(() => calcPeakTwoHourBin(hourlyWeights), [hourlyWeights]);
  const totalHourlyActivity = useMemo(
    () => hourlyWeights.reduce((a, b) => a + b, 0),
    [hourlyWeights],
  );
  const noTimeSlotActivity =
    hourlyWeights.length === 0 || totalHourlyActivity === 0;

  /** 길이만 있고 합이 0인 경우에도 기존에는 막대 차트가 마운트됨 → 캔버스 제거 */
  const hideChart =
    scopeCategory === "character" || noTimeSlotActivity;

  const summaryText = useMemo(() => {
    if (scopeCategory === "character" || noTimeSlotActivity) {
      return summaryWhenNoHourlyActivity(scopeCategory);
    }
    return buildSummaryLine(periodRange, peakBin.startHour, peakBin.viewerSum);
  }, [scopeCategory, noTimeSlotActivity, periodRange, peakBin.startHour, peakBin.viewerSum]);

  const spec = useMemo(() => {
    if (hideChart) return null;
    return buildTwoHourBarSpec(hourlyWeights, { showTooltip: true });
  }, [hideChart, hourlyWeights]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !spec) return;

    const chart = new VChart(spec, {
      dom: el,
      autoFit: true,
    });
    chart.renderSync();

    return () => {
      chart.release();
    };
  }, [spec]);

  if (hideChart) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <p className="text-sm font-medium leading-5 text-on-surface-20">{summaryText}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="text-sm font-medium leading-5 text-on-surface-20">{summaryText}</p>

      <div
        className="w-full min-w-0 overflow-hidden rounded-[4px]"
        role="img"
        aria-label={`24시간 이용자 분포(2시간 단위), 피크 시간대 ${twoHourBinAmPmLabel(peakBin.startHour)}, 이용자 수 ${formatViewerCountKo(peakBin.viewerSum)}`}
      >
        <div
          ref={containerRef}
          className="h-full w-full"
          style={{ height: CHART_HEIGHT_PX, position: "relative" }}
        />
      </div>
    </div>
  );
}
