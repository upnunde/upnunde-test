"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  ANALYTICS_HORIZONTAL_STACK_BAR_AXES,
  analyticsHorizontalStackBarTrackClassName,
} from "@/components/analytics/analytics-horizontal-stacked-bar";
import { cn } from "design-system/utils";
import VChart from "@visactor/vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { useAnalyticsChartTheme, type AnalyticsChartTheme } from "@/lib/analytics-chart-theme";

function buildRevisitStackedBarSpec(
  revisitPct: number,
  noRevisitPct: number,
  theme: AnalyticsChartTheme,
): IBarChartSpec {
  return {
    type: "bar",
    background: "transparent",
    direction: "horizontal",
    stack: true,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    data: [
      {
        id: "revisitSplit",
        values: [
          { band: "재방문률", segment: "again", pct: revisitPct },
          { band: "재방문률", segment: "notAgain", pct: noRevisitPct },
        ],
      },
    ],
    xField: "pct",
    yField: "band",
    seriesField: "segment",
    color: {
      type: "ordinal",
      domain: ["again", "notAgain"],
      range: [theme.primary, theme.primaryContainer],
    },
    axes: ANALYTICS_HORIZONTAL_STACK_BAR_AXES,
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

export interface AnalyticsRevisitStackedBarChartProps {
  className?: string;
  revisitPercent: number;
  noRevisitPercent: number;
}

/**
 * 이용자 재방문률 상단 pill 바와 동일 시각(100% 스택 막대).
 * @see https://www.visactor.io/vchart — @visactor/vchart 직접 렌더
 */
export function AnalyticsRevisitStackedBarChart({
  className,
  revisitPercent,
  noRevisitPercent,
}: AnalyticsRevisitStackedBarChartProps) {
  const chartTheme = useAnalyticsChartTheme();
  const spec = useMemo(
    () => buildRevisitStackedBarSpec(revisitPercent, noRevisitPercent, chartTheme),
    [revisitPercent, noRevisitPercent, chartTheme],
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = new VChart(spec, {
      dom: el,
      autoFit: true,
    });
    chart.renderSync();

    return () => {
      chart.release();
    };
  }, [spec]);

  return (
    <div
      className={cn(analyticsHorizontalStackBarTrackClassName, className)}
      style={{ height: 16 }}
      aria-hidden
    >
      <div ref={containerRef} className="h-full w-full" style={{ position: "relative" }} />
    </div>
  );
}
