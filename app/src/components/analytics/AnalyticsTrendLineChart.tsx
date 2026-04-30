"use client";

import { useEffect, useMemo, useRef } from "react";
import VChart from "@visactor/vchart";
import type { ILineChartSpec } from "@visactor/vchart";

/** 주요통계 카드와 동일한 키 — 선택 시 하단 시계열에 반영 */
export type AnalyticsPrimaryMetric = "views" | "watchTime" | "likes" | "comments" | "shares";

/** 이용자 탭 주요통계 — 플레이스홀더 시계열용 키 */
export type AnalyticsUserMetric = "userCount" | "newFollowers" | "totalFollowers";

export type AnalyticsChartMetric = AnalyticsPrimaryMetric | AnalyticsUserMetric;

const TIME_BUCKETS = [
  "2:00",
  "4:00",
  "6:00",
  "8:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
] as const;

/** 플레이스홀더 시계열 — API 연동 시 동일 키로 치환 */
const METRIC_PLACEHOLDER_VALUES: Record<AnalyticsChartMetric, number[]> = {
  views: [820, 910, 1100, 1420, 1680, 1750, 1720, 1600, 1480, 1210, 980],
  watchTime: [118, 125, 132, 140, 155, 160, 158, 150, 145, 130, 122],
  likes: [2100, 2150, 2220, 2280, 2320, 2350, 2340, 2300, 2250, 2200, 2180],
  comments: [280, 295, 310, 322, 335, 340, 338, 330, 318, 305, 292],
  shares: [320, 335, 348, 360, 372, 378, 375, 368, 355, 342, 330],
  userCount: [3800, 3950, 4100, 4220, 4180, 4050, 3980, 3850, 3720, 3600, 3520],
  newFollowers: [-120, -80, -200, -140, -160, -180, -210, -190, -175, -150, -130],
  totalFollowers: [42000, 42150, 41920, 41800, 41750, 41880, 41950, 42010, 42100, 42200, 42300],
};

function buildLineSpec(metric: AnalyticsChartMetric, valuesOverride?: readonly number[]): ILineChartSpec {
  const base = METRIC_PLACEHOLDER_VALUES[metric];
  const values = TIME_BUCKETS.map((_, i) => valuesOverride?.[i] ?? base[i] ?? 0);
  return {
    type: "line",
    data: [
      {
        id: "lineData",
        values: TIME_BUCKETS.map((time, i) => ({ time, value: values[i] ?? 0 })),
      },
    ],
    xField: "time",
    yField: "value",
    series: [
      {
        type: "line",
        dataIndex: 0,
        xField: "time",
        yField: "value",
        line: {
          style: {
            stroke: "#F642D4",
            lineWidth: 2,
          },
        },
        point: {
          visible: true,
          style: {
            fill: "#F642D4",
            stroke: "#ffffff",
            lineWidth: 1,
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
  /** 범위 필터 등 외부 더미 시계열과 맞출 때 사용 (시점 개수는 TIME_BUCKETS와 동일) */
  valuesOverride?: readonly number[];
}

export function AnalyticsTrendLineChart({
  className,
  metric = "views",
  valuesOverride,
}: AnalyticsTrendLineChartProps) {
  const spec = useMemo(() => buildLineSpec(metric, valuesOverride), [metric, valuesOverride]);
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
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: 320, position: "relative" }}
    />
  );
}
