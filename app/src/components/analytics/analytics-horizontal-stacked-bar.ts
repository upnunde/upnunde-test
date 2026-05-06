import type { IBarChartSpec } from "@visactor/vchart";

/**
 * 가로 100% 스택 막대(재방문·분포) 공통 — 밴드 축 여백 제거로 트랙 높이에 막대가 꽉 차게.
 */
export const ANALYTICS_HORIZONTAL_STACK_BAR_AXES: NonNullable<IBarChartSpec["axes"]> = [
  {
    orient: "left",
    type: "band",
    visible: false,
    domainLine: { visible: false },
    trimPadding: true,
    bandPadding: 0,
    paddingInner: 0,
    paddingOuter: 0,
  },
  {
    orient: "bottom",
    type: "linear",
    visible: false,
    min: 0,
    max: 100,
    nice: false,
  },
];

/** 캔버스를 트랙 높이에 맞춤 — 좌우 20px 마진(w-full과 동시에 붙이면 레이아웃 깨지므로 calc 사용) */
export const analyticsHorizontalStackBarTrackClassName =
  "mx-[20px] min-h-0 w-[calc(100%-40px)] shrink-0 overflow-hidden rounded-full bg-surface-disabled-10 p-0 leading-none [&_canvas]:block";
