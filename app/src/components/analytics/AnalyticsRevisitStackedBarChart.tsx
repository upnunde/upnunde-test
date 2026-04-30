"use client";

import { useEffect, useMemo, useRef } from "react";
import VChart from "@visactor/vchart";
import type { IBarChartSpec } from "@visactor/vchart";

/** 디자인 시스템 Primary / Primary container (핑크 팔레트) */
const COLOR_REVISIT = "#F642D4";
const COLOR_NO_REVISIT = "#FEF0FC";

function buildRevisitStackedBarSpec(revisitPct: number, noRevisitPct: number): IBarChartSpec {
  return {
    type: "bar",
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
      range: [COLOR_REVISIT, COLOR_NO_REVISIT],
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
  const spec = useMemo(
    () => buildRevisitStackedBarSpec(revisitPercent, noRevisitPercent),
    [revisitPercent, noRevisitPercent],
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
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: 16, position: "relative" }}
      aria-hidden
    />
  );
}
