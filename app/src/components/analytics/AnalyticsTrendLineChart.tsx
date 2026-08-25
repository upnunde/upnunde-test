"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "design-system/utils";
import VChart from "@visactor/vchart";
import type { ILineChartSpec } from "@visactor/vchart";
import { ANALYTICS_TREND_LINE_SHELL_CLASS } from "@/components/analytics/analytics-trend-chart-shell";
import { buildAnalyticsCartesianAxes } from "@/lib/analytics-chart-axes";
import {
  ANALYTICS_LINE_POINT_HOVER_STATE,
  ANALYTICS_LINE_STROKE_HOVER_STATE,
  buildAnalyticsCrosshairSpec,
} from "@/lib/analytics-chart-interaction";
import {
  useAnalyticsChartTheme,
  type AnalyticsChartTheme,
} from "@/lib/analytics-chart-theme";
import {
  buildAnalyticsTrendDateLabels,
  getAnalyticsTrendPointCount,
  type AnalyticsPeriodRange,
} from "@/components/analytics/analytics-date";

/** 주요통계 카드와 동일한 키 — 선택 시 하단 시계열에 반영 */
export type AnalyticsPrimaryMetric = "views" | "watchTime" | "likes" | "comments" | "shares";

/** 이용자 탭 주요통계 — 플레이스홀더 시계열용 키 */
export type AnalyticsUserMetric = "userCount" | "totalFollowers";

export type AnalyticsChartMetric = AnalyticsPrimaryMetric | AnalyticsUserMetric;

/** 플레이스홀더 시계열 템플릿(11포인트) — 기간에 따라 리샘플 */
const METRIC_PLACEHOLDER_VALUES: Record<AnalyticsChartMetric, number[]> = {
  views: [820, 910, 1100, 1420, 1680, 1750, 1720, 1600, 1480, 1210, 980],
  watchTime: [118, 125, 132, 140, 155, 160, 158, 150, 145, 130, 122],
  likes: [2100, 2150, 2220, 2280, 2320, 2350, 2340, 2300, 2250, 2200, 2180],
  comments: [280, 295, 310, 322, 335, 340, 338, 330, 318, 305, 292],
  shares: [320, 335, 348, 360, 372, 378, 375, 368, 355, 342, 330],
  userCount: [3800, 3950, 4100, 4220, 4180, 4050, 3980, 3850, 3720, 3600, 3520],
  totalFollowers: [42000, 42150, 41920, 41800, 41750, 41880, 41950, 42010, 42100, 42200, 42300],
};

/** 호버 툴팁 값 — 이용자·구독자는 `명` 고정 */
function formatTrendTooltipValue(metric: AnalyticsChartMetric, raw: number): string {
  const v = Math.round(raw);
  const n = v.toLocaleString("ko-KR");
  if (metric === "userCount" || metric === "totalFollowers") {
    return `${n}명`;
  }
  return n;
}

/** 템플릿 시계열을 목표 길이로 선형 보간 */
function resamplePlaceholderSeries(full: readonly number[], targetLen: number): number[] {
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

function buildLineSpec(
  metric: AnalyticsChartMetric,
  periodRange: AnalyticsPeriodRange,
  referenceDate: Date,
  theme: AnalyticsChartTheme,
  valuesOverride?: readonly number[],
): ILineChartSpec {
  const bucketCount = valuesOverride?.length ?? getAnalyticsTrendPointCount(periodRange);
  const dateLabels = buildAnalyticsTrendDateLabels(periodRange, bucketCount, referenceDate);
  const base = resamplePlaceholderSeries(METRIC_PLACEHOLDER_VALUES[metric], bucketCount);
  const values = Array.from({ length: bucketCount }, (_, i) => valuesOverride?.[i] ?? base[i] ?? 0);

  return {
    type: "line",
    background: "transparent",
    crosshair: buildAnalyticsCrosshairSpec(theme),
    data: [
      {
        id: "lineData",
        values: dateLabels.map((date, i) => ({ date, value: values[i] ?? 0 })),
      },
    ],
    xField: "date",
    yField: "value",
    axes: buildAnalyticsCartesianAxes(theme),
    tooltip: {
      visible: true,
      mark: {
        content: [
          {
            key: (datum) => String((datum as { date?: string }).date ?? ""),
            value: (datum) => {
              const v = (datum as { value?: number }).value;
              if (typeof v !== "number") return "";
              return formatTrendTooltipValue(metric, v);
            },
          },
        ],
      },
    },
    line: {
      state: ANALYTICS_LINE_STROKE_HOVER_STATE,
    },
    point: {
      visible: true,
      style: {
        fill: theme.primary,
        stroke: theme.surface,
        lineWidth: 1,
      },
      state: ANALYTICS_LINE_POINT_HOVER_STATE,
    },
    series: [
      {
        type: "line",
        dataIndex: 0,
        xField: "date",
        yField: "value",
        line: {
          style: {
            stroke: theme.primary,
            lineWidth: 2,
          },
        },
      },
    ],
  };
}

/**
 * VisActor 라인 차트.
 * `react-vchart`의 VChart는 첫 페인트에서 container ref 타이밍 이슈로
 * `please specify container or renderCanvas!` 가 날 수 있어, 마운트된 DOM에 대해
 * `@visactor/vchart`를 직접 생성한다.
 */
export interface AnalyticsTrendLineChartProps {
  className?: string;
  /** 주요통계에서 선택된 지표 — 미지정 시 조회수 */
  metric?: AnalyticsChartMetric;
  /** 조회 기간 — X축 날짜 범위·포인트 수와 더미 시계열 길이와 일치 */
  periodRange: AnalyticsPeriodRange;
  /** 외부 시계열(API·더미). 길이가 곧 버킷 수 */
  valuesOverride?: readonly number[];
}

export function AnalyticsTrendLineChart({
  className,
  metric = "views",
  periodRange,
  valuesOverride,
}: AnalyticsTrendLineChartProps) {
  const [referenceDate] = useState(() => new Date());
  const chartTheme = useAnalyticsChartTheme();
  const spec = useMemo(
    () => buildLineSpec(metric, periodRange, referenceDate, chartTheme, valuesOverride),
    [metric, periodRange, referenceDate, chartTheme, valuesOverride],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<VChart | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = new VChart(spec, {
      dom: el,
      autoFit: true,
    });
    chartRef.current = chart;
    chart.renderSync();

    return () => {
      chart.release();
      chartRef.current = null;
    };
  }, [spec]);

  return (
    <div className={cn(ANALYTICS_TREND_LINE_SHELL_CLASS, className)}>
      <div ref={containerRef} style={{ width: "100%", height: 320, position: "relative" }} />
    </div>
  );
}
