"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnalyticsScopeFilterBar } from "@/components/analytics/AnalyticsScopeFilterBar";
import { useScrollHeaderCollapse } from "@/hooks/useScrollHeaderCollapse";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { ANALYTICS_SCROLL_ROOT_ATTR } from "@/lib/analytics-scroll";
import {
  PAGE_FILTER_HEADER_CLASS,
  PAGE_FILTER_HEADER_INNER_CLASS,
  PAGE_SCROLL_ROOT_CLASS,
  PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
  PAGE_STACK_CLASS,
} from "@/lib/page-layout";
import { cn } from "@/lib/utils";
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
  const isDesktop = useIsLgUp();
  const filterHeaderRef = useRef<HTMLDivElement>(null);
  const headerCollapsed = useScrollHeaderCollapse(ANALYTICS_SCROLL_ROOT_ATTR, !isDesktop, {
    compensateLayout: true,
    headerRef: filterHeaderRef,
  });
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

  const setPeriodRangeDeferred = useCallback((v: AnalyticsPeriodRange) => {
    queueMicrotask(() => setPeriodRange(v));
  }, []);

  const effectiveStatsEpisodeNo: "all" | number = isAllAnalyticsSeriesId(seriesId)
    ? "all"
    : statsEpisodeNo;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div
        ref={filterHeaderRef}
        className={cn(
          PAGE_FILTER_HEADER_CLASS,
          headerCollapsed && "max-lg:border-b-0 max-lg:py-0",
        )}
      >
        <div
          className={cn(
            cn(PAGE_FILTER_HEADER_INNER_CLASS, "overflow-hidden max-lg:transition-[max-height] max-lg:duration-200 max-lg:ease-out"),
            headerCollapsed ? "max-lg:max-h-0" : "max-lg:max-h-[320px]",
          )}
        >
          <div
            className={cn(
              "max-lg:transition-transform max-lg:duration-200 max-lg:ease-out",
              headerCollapsed && "max-lg:-translate-y-full",
            )}
          >
            <AnalyticsScopeFilterBar
              analyticsArea={analyticsArea}
              onAnalyticsAreaChange={setAnalyticsArea}
              periodRange={periodRange}
              onPeriodRangeChange={setPeriodRangeDeferred}
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
      </div>

      <div
        className={cn(
          PAGE_SCROLL_ROOT_CLASS,
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
    </div>
  );
}
