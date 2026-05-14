"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnalyticsScopeFilterBar } from "@/components/analytics/AnalyticsScopeFilterBar";
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
      <div className="flex w-full shrink-0 flex-col items-center border-b border-border-10 bg-surface-10 px-5 pb-5 pt-2">
        <div className="w-full min-w-0 max-w-[1200px]">
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
            statsEpisodeNo={statsEpisodeNo}
            onStatsEpisodeNoChange={setStatsEpisodeNo}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-0">
        <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col">
          {analyticsArea === "content" ? (
            <AnalyticsContentTab
              periodRange={periodRange}
              scopeCategory={scopeCategory}
              seriesId={seriesId}
              characterId={characterId}
              statsEpisodeNo={effectiveStatsEpisodeNo}
            />
          ) : analyticsArea === "user" ? (
            <AnalyticsUserTab
              periodRange={periodRange}
              scopeCategory={scopeCategory}
              seriesId={seriesId}
              characterId={characterId}
            />
          ) : (
            <MonetizationDashboard
              periodRange={periodRange}
              scopeCategory={scopeCategory}
              seriesId={seriesId}
              characterId={characterId}
              statsEpisodeNo={effectiveStatsEpisodeNo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
