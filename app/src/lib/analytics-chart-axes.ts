import type { ILineChartSpec } from "@visactor/vchart";
import type { AnalyticsChartTheme } from "@/lib/analytics-chart-theme";

type CartesianAxes = NonNullable<ILineChartSpec["axes"]>;

export type AnalyticsCartesianAxesOptions = {
  xLabelFontSize?: number;
  yLabelVisible?: boolean;
  yLabelFontSize?: number;
};

/** 라인·막대 차트 공통 — X domainLine + Y grid (DS `--divider`, `--foreground-muted`) */
export function buildAnalyticsCartesianAxes(
  theme: AnalyticsChartTheme,
  options: AnalyticsCartesianAxesOptions = {},
): CartesianAxes {
  const {
    xLabelFontSize = 10,
    yLabelVisible = true,
    yLabelFontSize = 10,
  } = options;

  return [
    {
      orient: "bottom",
      type: "band",
      domainLine: { visible: true, style: { stroke: theme.divider, lineWidth: 1 } },
      label: {
        style: {
          fontSize: xLabelFontSize,
          fill: theme.axisLabel,
        },
      },
    },
    {
      orient: "left",
      type: "linear",
      label: {
        visible: yLabelVisible,
        formatMethod: (text) => {
          const raw = Array.isArray(text) ? text[0] : text;
          const n = Number(raw);
          if (Number.isFinite(n)) return Math.round(n).toLocaleString("ko-KR");
          return raw != null ? String(raw) : "";
        },
        style: {
          fontSize: yLabelFontSize,
          fill: theme.axisLabel,
        },
      },
      domainLine: { visible: false },
      grid: {
        visible: true,
        style: {
          lineDash: [4, 4],
          stroke: theme.divider,
          lineWidth: 1,
        },
      },
    },
  ];
}

/** 시청자 시간대 막대 — Y축 라벨·틱 숨김, X축 틱 숨김 */
export function buildAnalyticsHourlyBarAxes(theme: AnalyticsChartTheme): CartesianAxes {
  return [
    {
      orient: "bottom",
      type: "band",
      domainLine: { visible: true, style: { stroke: theme.divider, lineWidth: 1 } },
      label: {
        style: {
          fontSize: 9,
          fill: theme.axisLabel,
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
          stroke: theme.divider,
          lineWidth: 1,
        },
      },
    },
  ];
}
