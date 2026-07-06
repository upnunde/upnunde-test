"use client";

import { useEffect, useState } from "react";

/** VChart용 — DS 시맨틱·브랜드 CSS 변수에서 읽은 색상 */
export type AnalyticsChartTheme = {
  divider: string;
  axisLabel: string;
  primary: string;
  primaryContainer: string;
  brand400: string;
  brand200: string;
  /** 라인 포인트 외곽 — 표면 `--background` */
  surface: string;
};

function pickCssColor(style: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = style.getPropertyValue(name).trim();
  return value || fallback;
}

/** `document.documentElement`의 DS 토큰을 canvas stroke/fill용 색으로 읽는다. */
export function readAnalyticsChartTheme(
  root: HTMLElement = document.documentElement,
): AnalyticsChartTheme {
  const style = getComputedStyle(root);
  return {
    divider: pickCssColor(style, "--divider", "#f1f1f5"),
    axisLabel: pickCssColor(style, "--foreground-muted", "#959598"),
    primary: pickCssColor(style, "--primary", "#f642d4"),
    primaryContainer: pickCssColor(style, "--primary-container", "#fce8f8"),
    brand400: pickCssColor(style, "--brand-400", "#f06ad9"),
    brand200: pickCssColor(style, "--brand-200", "#f9cff0"),
    surface: pickCssColor(style, "--background", "#ffffff"),
  };
}

/** 비중 순 스택 막대 — primary 계열 4단 (진→연) */
export function buildPrimaryDescendingChartColors(theme: AnalyticsChartTheme): string[] {
  return [theme.primary, theme.brand400, theme.brand200, theme.primaryContainer];
}

/** 다크·라이트 전환 시 차트 spec 재생성용 */
export function useAnalyticsChartTheme(): AnalyticsChartTheme {
  const [theme, setTheme] = useState<AnalyticsChartTheme>(() =>
    typeof document === "undefined"
      ? {
          divider: "#f1f1f5",
          axisLabel: "#959598",
          primary: "#f642d4",
          primaryContainer: "#fce8f8",
          brand400: "#f06ad9",
          brand200: "#f9cff0",
          surface: "#ffffff",
        }
      : readAnalyticsChartTheme(),
  );

  useEffect(() => {
    const sync = () => setTheme(readAnalyticsChartTheme());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}
