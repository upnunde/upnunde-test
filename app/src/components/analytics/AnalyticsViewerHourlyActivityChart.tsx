"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import VChart from "@visactor/vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { getAnalyticsPeriodInclusiveDays, type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";

/** 제품 primary (`globals.css` --primary) */
const ANALYTICS_BAR_PRIMARY = "#F642D4";

/** 참고 UI와 동일하게 0a~11p 표기 */
function hourToAmPmAxisLabel(hour: number): string {
  if (hour === 0) return "0a";
  if (hour <= 11) return `${hour}a`;
  if (hour === 12) return "12p";
  return `${hour - 12}p`;
}

function formatPeakHourRangeKo(hour: number): string {
  const end = hour + 1;
  return `${hour}시~${end}시`;
}

function buildSummaryLine(period: AnalyticsPeriodRange, peakHour: number): string {
  const peak = formatPeakHourRangeKo(peakHour);
  const days = getAnalyticsPeriodInclusiveDays(period);
  if (days == null) {
    return `전체 기간 동안 내 시청자는 ${peak}에 가장 많이 활동했습니다`;
  }
  return `지난 ${days}일 동안 내 시청자는 ${peak}에 가장 많이 활동했습니다`;
}

function calcPeakHour(weights: readonly number[]): number {
  let best = 0;
  let maxW = -Infinity;
  for (let h = 0; h < weights.length; h++) {
    const w = weights[h] ?? 0;
    if (w > maxW) {
      maxW = w;
      best = h;
    }
  }
  return best;
}

function buildHourlyBarSpec(hourlyWeights: readonly number[]): IBarChartSpec {
  const values = hourlyWeights.map((y, hour) => ({
    hour: hourToAmPmAxisLabel(hour),
    value: y,
  }));

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
    tooltip: { visible: false },
    series: [
      {
        type: "bar",
        dataIndex: 0,
        xField: "hour",
        yField: "value",
        barWidth: "60%",
        barMinHeight: 2,
        animationNormal: {
          bar: [
            {
              loop: true,
              startTime: 100,
              oneByOne: 100,
              timeSlices: [
                {
                  delay: 1000,
                  duration: 500,
                  effects: {
                    channel: {
                      fillOpacity: { to: 0.5 },
                    },
                    easing: "linear",
                  },
                },
                {
                  duration: 500,
                  effects: {
                    channel: {
                      fillOpacity: { to: 1 },
                    },
                    easing: "linear",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

export interface AnalyticsViewerHourlyActivityChartProps {
  className?: string;
  /** 길이 24, 0~23시 가중치 */
  hourlyWeights: readonly number[];
  periodRange: AnalyticsPeriodRange;
}

const CHART_HEIGHT_PX = 200;

/**
 * 시청자 24시간 활동 막대 그래프 (@visactor/vchart).
 */
export function AnalyticsViewerHourlyActivityChart({
  className,
  hourlyWeights,
  periodRange,
}: AnalyticsViewerHourlyActivityChartProps) {
  const peakHour = useMemo(() => calcPeakHour(hourlyWeights), [hourlyWeights]);
  const summaryText = buildSummaryLine(periodRange, peakHour);

  const spec = useMemo(
    () => (hourlyWeights.length > 0 ? buildHourlyBarSpec(hourlyWeights) : null),
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
        aria-label={`24시간 시청 활동, 피크 ${formatPeakHourRangeKo(peakHour)}`}
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
