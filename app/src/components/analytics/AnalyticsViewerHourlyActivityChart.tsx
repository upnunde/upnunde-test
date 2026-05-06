"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import VChart from "@visactor/vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { getAnalyticsPeriodInclusiveDays, type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";

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

function formatPeakTwoHourRangeKo(startHour: number): string {
  return `${startHour}시~${startHour + 2}시`;
}

function buildSummaryLine(period: AnalyticsPeriodRange, peakBinStartHour: number): string {
  const peak = formatPeakTwoHourRangeKo(peakBinStartHour);
  const days = getAnalyticsPeriodInclusiveDays(period);
  if (days == null) {
    return `전체 기간 동안 내 시청자는 ${peak}에 가장 많이 활동했습니다`;
  }
  return `지난 ${days}일 동안 내 시청자는 ${peak}에 가장 많이 활동했습니다`;
}

/** 합산 활동량이 가장 큰 2시간 구간의 시작 시각(0,2,…,22) */
function calcPeakTwoHourBinStart(weights: readonly number[]): number {
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
  return bestStart;
}

function buildTwoHourBarSpec(hourlyWeights: readonly number[]): IBarChartSpec {
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
    tooltip: {
      visible: true,
      mark: {
        content: [
          {
            key: (datum) => {
              const d = datum as { hourStart?: number };
              const h = d.hourStart;
              if (typeof h !== "number") return "시간대";
              return `${h}시~${h + 2}시`;
            },
            value: (datum) => {
              const d = datum as { value?: number };
              const v = d.value;
              if (typeof v !== "number") return "";
              return `활동량 ${Math.round(v)}`;
            },
          },
        ],
      },
    },
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
  /** 길이 24, 0~23시 시간대별 가중치(2시간 단위로 합산해 표시) */
  hourlyWeights: readonly number[];
  periodRange: AnalyticsPeriodRange;
}

const CHART_HEIGHT_PX = 200;

/**
 * 시청자 24시간 활동 막대 그래프 — 2시간 단위 12개 막대 (@visactor/vchart).
 */
export function AnalyticsViewerHourlyActivityChart({
  className,
  hourlyWeights,
  periodRange,
}: AnalyticsViewerHourlyActivityChartProps) {
  const peakBinStartHour = useMemo(() => calcPeakTwoHourBinStart(hourlyWeights), [hourlyWeights]);
  const summaryText = buildSummaryLine(periodRange, peakBinStartHour);

  const spec = useMemo(
    () => (hourlyWeights.length > 0 ? buildTwoHourBarSpec(hourlyWeights) : null),
    [hourlyWeights],
  );

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

  if (!hourlyWeights.length) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <p className="text-sm font-medium leading-5 text-on-surface-20">{summaryText}</p>
        <div
          className="w-full rounded-[4px] bg-surface-20"
          style={{ height: CHART_HEIGHT_PX }}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="text-sm font-medium leading-5 text-on-surface-20">{summaryText}</p>

      <div
        className="w-full min-w-0"
        role="img"
        aria-label={`24시간 시청 활동(2시간 단위), 피크 ${formatPeakTwoHourRangeKo(peakBinStartHour)}`}
      >
        <div
          ref={containerRef}
          className="w-full"
          style={{ height: CHART_HEIGHT_PX, position: "relative" }}
        />
      </div>
    </div>
  );
}
