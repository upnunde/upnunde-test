"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import VChart from "@visactor/vchart";
import type { IBarChartSpec } from "@visactor/vchart";

/** 차트 세그먼트 색 — 재방문 막대·디자인 시스템 primary 계열과 동일 톤 (`ANALYTICS_DISTRIBUTION_LEGEND_DOT_CLASSES` 순서와 대응) */
const SEGMENT_COLORS = [
  "#FEF0FC",
  "rgba(246, 66, 212, 0.25)",
  "rgba(246, 66, 212, 0.45)",
  "rgba(246, 66, 212, 0.5)",
  "rgba(246, 66, 212, 0.75)",
  "#F642D4",
] as const;

const BAND_ID = "분포";

function buildSpec(rawWeights: readonly number[]): IBarChartSpec {
  const sum = rawWeights.reduce((a, b) => a + b, 0) || 1;
  const n = rawWeights.length;
  const segmentIds = Array.from({ length: n }, (_, i) => `s${i}`);
  const pcts = rawWeights.map((v) => (v / sum) * 100);
  const values = segmentIds.map((seg, i) => ({
    band: BAND_ID,
    segment: seg,
    pct: pcts[i]!,
  }));
  const colors = segmentIds.map((_, i) => SEGMENT_COLORS[i % SEGMENT_COLORS.length]!);

  return {
    type: "bar",
    direction: "horizontal",
    stack: true,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    data: [{ id: "distribution", values }],
    xField: "pct",
    yField: "band",
    seriesField: "segment",
    color: {
      type: "ordinal",
      domain: segmentIds,
      range: colors,
    },
    axes: [
      { orient: "left", visible: false },
      { orient: "bottom", visible: false },
    ],
    legends: [{ visible: false }],
    tooltip: { visible: false },
    series: [
      {
        type: "bar",
        dataIndex: 0,
        xField: "pct",
        yField: "band",
        seriesField: "segment",
        stackCornerRadius: 9999,
      },
    ],
  };
}

export interface AnalyticsDistributionStackedBarChartProps {
  className?: string;
  /** 구간 비율(임의 스케일). 합이 100일 필요 없음 — 내부에서 정규화 */
  values: readonly number[];
  /** 막대 높이(px). 기존 CSS `h-3`과 동일 */
  heightPx?: number;
}

/**
 * 이용자 분포 카드용 100% 가로 스택 막대.
 * `AnalyticsRevisitStackedBarChart`와 동일하게 `@visactor/vchart` 직접 렌더.
 */
export function AnalyticsDistributionStackedBarChart({
  className,
  values,
  heightPx = 12,
}: AnalyticsDistributionStackedBarChartProps) {
  const spec = useMemo(() => (values.length > 0 ? buildSpec(values) : null), [values]);
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

  if (!values.length) {
    return (
      <div
        className={cn("w-full rounded-full bg-surface-20", className)}
        style={{ height: heightPx }}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: heightPx, position: "relative" }}
      aria-hidden
    />
  );
}
