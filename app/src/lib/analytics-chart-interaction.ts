import type { AnalyticsChartTheme } from "@/lib/analytics-chart-theme";

/**
 * VChart cartesian 기본 crosshair — `axisGridColor` rect · opacity 0.7.
 * 분석 차트는 DS `--divider` 저채도 밴드로 대체한다.
 */
export function buildAnalyticsCrosshairSpec(theme: AnalyticsChartTheme) {
  return [
    {
      xField: {
        visible: true,
        line: {
          visible: true,
          type: "rect" as const,
          style: {
            fill: theme.divider,
            opacity: 0.12,
            lineWidth: 0,
          },
        },
      },
      yField: {
        visible: false,
      },
    },
  ];
}

/** 라인·포인트 — 호버 시 색 밝기 변화 없이, 비호버만 살짝 흐리게 */
export const ANALYTICS_LINE_POINT_HOVER_STATE = {
  hover: {
    fillOpacity: 1,
  },
  hover_reverse: {
    fillOpacity: 0.3,
  },
  dimension_hover: {
    fillOpacity: 1,
  },
  dimension_hover_reverse: {
    fillOpacity: 0.3,
  },
} as const;

export const ANALYTICS_LINE_STROKE_HOVER_STATE = {
  hover_reverse: {
    strokeOpacity: 0.3,
  },
  dimension_hover_reverse: {
    strokeOpacity: 0.3,
  },
} as const;

/** 막대 — primary 유지, 비호버만 흐리게 (기본 highlight 밝기 상승 방지) */
export const ANALYTICS_BAR_HOVER_STATE = {
  hover: {
    fillOpacity: 1,
  },
  hover_reverse: {
    fillOpacity: 0.3,
  },
  dimension_hover: {
    fillOpacity: 1,
  },
  dimension_hover_reverse: {
    fillOpacity: 0.3,
  },
} as const;
