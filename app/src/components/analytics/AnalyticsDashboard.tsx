"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
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
  type AnalyticsSeriesId,
} from "@/components/analytics/analytics-series-options";

export type { AnalyticsPeriodRange } from "@/components/analytics/analytics-date";

type AnalyticsAreaTabId = "content" | "user" | "revenue";

export type { AnalyticsAreaTabId };

export interface AnalyticsDashboardProps {
  /** 진입 시 기본 탭 (`/analytics?area=revenue` 등) */
  defaultArea?: AnalyticsAreaTabId;
  /** 영역 탭 전환 시 상위(페이지 헤더·URL) 동기화 */
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
  /**
   * 범위 칩과 시리즈 가로 탭은 콘텐츠/이용자 탭이 공유한다 (탭 전환 시 선택 유지).
   * 시리즈 칩일 때만 seriesId가 유효하지만, 다른 칩에서 돌아왔을 때도 마지막 선택을 복원하기 위해
   * 항상 default 시리즈로 초기화하지 않고 lift up 한 상태로 보관한다.
   */
  const [scopeCategory, setScopeCategory] = useState<AnalyticsScopeCategoryId>(
    ANALYTICS_DEFAULT_SCOPE_CATEGORY,
  );
  const [seriesId, setSeriesId] = useState<AnalyticsSeriesId>(DEFAULT_ANALYTICS_SERIES_ID);
  const [characterId, setCharacterId] = useState<AnalyticsCharacterId>(DEFAULT_ANALYTICS_CHARACTER_ID);

  const setPeriodRangeDeferred = useCallback((v: AnalyticsPeriodRange) => {
    queueMicrotask(() => setPeriodRange(v));
  }, []);

  return (
    <div className="flex w-full flex-col items-stretch">
      <div className="inline-flex flex-col items-start justify-start gap-2.5 self-stretch border-b border-border-10 px-0 pb-2.5 pt-5">
        <SegmentedTextTabs
          aria-label="분석 영역"
          items={[
            { id: "content", label: "콘텐츠" },
            { id: "user", label: "이용자" },
            { id: "revenue", label: "수익" },
          ]}
          activeId={analyticsArea}
          onSelect={(id) => setAnalyticsArea(id as AnalyticsAreaTabId)}
          size="xl"
          tabListClassName="self-stretch"
        />
      </div>

      {analyticsArea === "content" ? (
        <AnalyticsContentTab
          periodRange={periodRange}
          onPeriodRangeChange={setPeriodRangeDeferred}
          scopeCategory={scopeCategory}
          onScopeCategoryChange={setScopeCategory}
          seriesId={seriesId}
          onSeriesIdChange={setSeriesId}
          characterId={characterId}
          onCharacterIdChange={setCharacterId}
        />
      ) : analyticsArea === "user" ? (
        <AnalyticsUserTab
          periodRange={periodRange}
          onPeriodRangeChange={setPeriodRangeDeferred}
          scopeCategory={scopeCategory}
          onScopeCategoryChange={setScopeCategory}
          seriesId={seriesId}
          onSeriesIdChange={setSeriesId}
          characterId={characterId}
          onCharacterIdChange={setCharacterId}
        />
      ) : (
        <MonetizationDashboard
          periodRange={periodRange}
          onPeriodRangeChange={setPeriodRangeDeferred}
          scopeCategory={scopeCategory}
          onScopeCategoryChange={setScopeCategory}
          seriesId={seriesId}
          onSeriesIdChange={setSeriesId}
          characterId={characterId}
          onCharacterIdChange={setCharacterId}
        />
      )}
    </div>
  );
}
