"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnalyticsScopeFilterBar } from "@/components/analytics/AnalyticsScopeFilterBar";
import { ANALYTICS_SCROLL_ROOT_ATTR } from "@/lib/analytics-scroll";
import {
  PAGE_FILTER_HEADER_INNER_CLASS,
  PAGE_FILTER_HEADER_SHELL_CLASS,
  PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
  PAGE_SCROLL_ROOT_TRANSPARENT_CLASS,
  PAGE_STACK_CLASS,
} from "@/lib/page-layout";
import { cn } from "design-system/utils";
import { AnalyticsContentTab } from "@/components/analytics/AnalyticsContentTab";
import { AnalyticsUserTab } from "@/components/analytics/AnalyticsUserTab";
import { MonetizationDashboard } from "@/components/monetization/MonetizationDashboard";
import { type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import {
  ANALYTICS_DEFAULT_SCOPE_CATEGORY,
  type AnalyticsScopeCategoryId,
} from "@/components/analytics/analytics-scope-category";
import {
  DEFAULT_ANALYTICS_CHARACTER_ID,
  type AnalyticsCharacterId,
} from "@/components/analytics/analytics-character-options";
import {
  DEFAULT_ANALYTICS_SCENARIO_ID,
  type AnalyticsScenarioId,
} from "@/components/analytics/analytics-scenario-options";
import {
  DEFAULT_ANALYTICS_SERIES_ID,
  isAllAnalyticsSeriesId,
  type AnalyticsSeriesId,
} from "@/components/analytics/analytics-series-options";

export type { AnalyticsPeriodRange } from "@/components/analytics/analytics-date";

type AnalyticsAreaTabId = "content" | "user" | "revenue";

export type { AnalyticsAreaTabId };

export interface AnalyticsDashboardProps {
  defaultArea?: AnalyticsAreaTabId;
  onAreaChange?: (area: AnalyticsAreaTabId) => void;
}

export function AnalyticsDashboard({ defaultArea = "content", onAreaChange }: AnalyticsDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [periodRange, setPeriodRange] = useState<AnalyticsPeriodRange>("7d");
  const [analyticsArea, setAnalyticsAreaState] = useState<AnalyticsAreaTabId>(defaultArea);

  const setAnalyticsArea = useCallback(
    (area: AnalyticsAreaTabId) => {
      setAnalyticsAreaState(area);
      onAreaChange?.(area);
      const params = new URLSearchParams();
      if (area !== "content") params.set("area", area);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [onAreaChange, pathname, router],
  );

  useEffect(() => {
    setAnalyticsAreaState(defaultArea);
    onAreaChange?.(defaultArea);
  }, [defaultArea, onAreaChange]);

  const [scopeCategory, setScopeCategory] = useState<AnalyticsScopeCategoryId>(
    ANALYTICS_DEFAULT_SCOPE_CATEGORY,
  );
  const [seriesId, setSeriesId] = useState<AnalyticsSeriesId>(DEFAULT_ANALYTICS_SERIES_ID);
  const [characterId, setCharacterId] = useState<AnalyticsCharacterId>(DEFAULT_ANALYTICS_CHARACTER_ID);
  const [scenarioId, setScenarioId] = useState<AnalyticsScenarioId>(DEFAULT_ANALYTICS_SCENARIO_ID);
  const [statsEpisodeNo, setStatsEpisodeNo] = useState<"all" | number>("all");

  useEffect(() => {
    setStatsEpisodeNo("all");
  }, [seriesId, scopeCategory]);

  const effectiveStatsEpisodeNo: "all" | number = isAllAnalyticsSeriesId(seriesId)
    ? "all"
    : statsEpisodeNo;

  return (
    <>
      <div className={PAGE_FILTER_HEADER_SHELL_CLASS}>
        <div className={PAGE_FILTER_HEADER_INNER_CLASS}>
          <AnalyticsScopeFilterBar
            analyticsArea={analyticsArea}
            onAnalyticsAreaChange={setAnalyticsArea}
            periodRange={periodRange}
            onPeriodRangeChange={setPeriodRange}
            scopeCategory={scopeCategory}
            onScopeCategoryChange={setScopeCategory}
            seriesId={seriesId}
            onSeriesIdChange={setSeriesId}
            characterId={characterId}
            onCharacterIdChange={setCharacterId}
            scenarioId={scenarioId}
            onScenarioIdChange={setScenarioId}
            statsEpisodeNo={statsEpisodeNo}
            onStatsEpisodeNoChange={setStatsEpisodeNo}
          />
        </div>
      </div>

      <div
        className={cn(
          PAGE_SCROLL_ROOT_TRANSPARENT_CLASS,
          PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
          "items-stretch justify-start gap-0",
        )}
        {...{ [ANALYTICS_SCROLL_ROOT_ATTR]: "" }}
      >
        <div className={PAGE_STACK_CLASS}>
          {analyticsArea === "content" ? (
            <AnalyticsContentTab
              periodRange={periodRange}
              scopeCategory={scopeCategory}
              seriesId={seriesId}
              characterId={characterId}
              scenarioId={scenarioId}
              statsEpisodeNo={effectiveStatsEpisodeNo}
            />
          ) : analyticsArea === "user" ? (
            <AnalyticsUserTab
              periodRange={periodRange}
              scopeCategory={scopeCategory}
              seriesId={seriesId}
              characterId={characterId}
              scenarioId={scenarioId}
            />
          ) : (
            <MonetizationDashboard
              periodRange={periodRange}
              scopeCategory={scopeCategory}
              seriesId={seriesId}
              characterId={characterId}
              scenarioId={scenarioId}
              statsEpisodeNo={effectiveStatsEpisodeNo}
            />
          )}
        </div>
      </div>
    </>
  );
}
