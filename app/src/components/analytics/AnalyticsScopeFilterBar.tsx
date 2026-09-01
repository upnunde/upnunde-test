"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsPeriodPicker } from "@/components/analytics/AnalyticsPeriodPicker";
import { AnalyticsScopeDropdown } from "@/components/analytics/AnalyticsScopeDropdown";
import { AnalyticsEpisodeScopePicker } from "@/components/analytics/AnalyticsEpisodeScopePicker";
import type { AnalyticsAreaTabId } from "@/components/analytics/AnalyticsDashboard";
import { type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import {
  analyticsScopeFilterDividerClassName,
  analyticsScopeFilterShellClassName,
} from "@/components/analytics/analytics-filter-chips";
import { ContentScopeChipGroup } from "@/components/shared/ContentScopeChipGroup";
import { useFilterTabStripSize } from "@/hooks/useFilterTabStripSize";
import {
  CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS,
  FILTER_TAB_STRIP_SHELL_CLASS,
} from "@/lib/chip-styles";
import {
  ANALYTICS_SCOPE_CHIPS,
  isAnalyticsEntityScope,
  type AnalyticsScopeCategoryId,
} from "@/components/analytics/analytics-scope-category";
import {
  ANALYTICS_CHARACTER_OPTIONS,
  type AnalyticsCharacterId,
} from "@/components/analytics/analytics-character-options";
import {
  ANALYTICS_SCENARIO_OPTIONS,
  type AnalyticsScenarioId,
} from "@/components/analytics/analytics-scenario-options";
import {
  ANALYTICS_SERIES_OPTIONS,
  isAllAnalyticsSeriesId,
  type AnalyticsSeriesId,
} from "@/components/analytics/analytics-series-options";
import { cn } from "design-system/utils";

const AREA_TABS = [
  { id: "content", label: "콘텐츠" },
  { id: "user", label: "이용자" },
  { id: "revenue", label: "수익" },
] as const;

export interface AnalyticsScopeFilterBarProps {
  analyticsArea: AnalyticsAreaTabId;
  onAnalyticsAreaChange: (area: AnalyticsAreaTabId) => void;
  periodRange: AnalyticsPeriodRange;
  onPeriodRangeChange: (v: AnalyticsPeriodRange) => void;
  scopeCategory: AnalyticsScopeCategoryId;
  onScopeCategoryChange: (id: AnalyticsScopeCategoryId) => void;
  seriesId: AnalyticsSeriesId;
  onSeriesIdChange: (id: AnalyticsSeriesId) => void;
  characterId: AnalyticsCharacterId;
  onCharacterIdChange: (id: AnalyticsCharacterId) => void;
  scenarioId: AnalyticsScenarioId;
  onScenarioIdChange: (id: AnalyticsScenarioId) => void;
  statsEpisodeNo: "all" | number;
  onStatsEpisodeNoChange: (v: "all" | number) => void;
  className?: string;
}

/** 분석 상단 — 영역 탭·기간·범위 칩·엔티티 드롭다운 */
export function AnalyticsScopeFilterBar({
  analyticsArea,
  onAnalyticsAreaChange,
  periodRange,
  onPeriodRangeChange,
  scopeCategory,
  onScopeCategoryChange,
  seriesId,
  onSeriesIdChange,
  characterId,
  onCharacterIdChange,
  scenarioId,
  onScenarioIdChange,
  statsEpisodeNo,
  onStatsEpisodeNoChange,
  className,
}: AnalyticsScopeFilterBarProps) {
  const isSeriesScope = scopeCategory === "series";
  const isCharacterScope = scopeCategory === "character";
  const isScenarioScope = scopeCategory === "scenario";
  const showEntityFilters = isAnalyticsEntityScope(scopeCategory);
  const areaTabSize = useFilterTabStripSize();

  return (
    <div className={cn(analyticsScopeFilterShellClassName, className)}>
      {/*
        브레이크포인트
        - 모바일(<768): 탭 → 기간(메타) → 범위 칩
        - 태블릿·데스크톱(≥768): 탭|기간 한 행 → 범위 칩
        `max-md:contents`로 모바일에서 기간을 탭 아래·칩 위에 둔다.
      */}
      <div className="max-md:contents flex w-full min-w-0 md:flex-row md:items-center md:justify-between md:gap-2">
        <div className="max-md:order-1 min-w-0 w-full flex-1 max-md:pr-5">
          <Tabs
            value={analyticsArea}
            onValueChange={(v) => onAnalyticsAreaChange(v as AnalyticsAreaTabId)}
            className={FILTER_TAB_STRIP_SHELL_CLASS}
          >
            <TabsList
              variant="text"
              size={areaTabSize}
              aria-label="분석 영역"
              className="max-w-full min-w-0 overflow-x-auto"
            >
              {AREA_TABS.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="max-md:order-2 max-md:-mt-2 shrink-0 max-md:self-start max-md:pr-5">
          <AnalyticsPeriodPicker value={periodRange} onChange={onPeriodRangeChange} variant="inline" />
        </div>
      </div>

      {/*
        좁은 셸(max-lg): 부모 우측 패딩을 제거해 스크롤 뷰포트가 화면 끝까지 간다.
        끝 항목용 pr-5는 스크롤 콘텐츠에만 둔다.
      */}
      <div
        className={cn(
          "max-md:order-3 max-md:mt-1 flex w-full min-w-0 items-center overflow-x-auto overscroll-x-contain",
          "max-lg:pr-5",
          CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS,
        )}
      >
        <ContentScopeChipGroup
          items={ANALYTICS_SCOPE_CHIPS}
          activeId={scopeCategory}
          onSelect={onScopeCategoryChange}
          ariaLabel="콘텐츠 범위"
          variant="default"
          size="default"
        />

        {showEntityFilters ? (
          <>
            <div className={analyticsScopeFilterDividerClassName} aria-hidden />
            <div className={cn("flex shrink-0 items-center", CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS)}>
              {isSeriesScope ? (
                <>
                  <AnalyticsScopeDropdown
                    value={seriesId}
                    onChange={(id) => onSeriesIdChange(id as AnalyticsSeriesId)}
                    options={ANALYTICS_SERIES_OPTIONS}
                    ariaLabelPrefix="시리즈 작품"
                    placeholder="시리즈 전체"
                  />
                  {!isAllAnalyticsSeriesId(seriesId) ? (
                    <AnalyticsEpisodeScopePicker
                      seriesId={seriesId}
                      value={statsEpisodeNo}
                      onChange={onStatsEpisodeNoChange}
                    />
                  ) : null}
                </>
              ) : null}
              {isCharacterScope ? (
                <AnalyticsScopeDropdown
                  value={characterId}
                  onChange={(id) => onCharacterIdChange(id as AnalyticsCharacterId)}
                  options={ANALYTICS_CHARACTER_OPTIONS}
                  ariaLabelPrefix="캐릭터"
                  placeholder="캐릭터 선택"
                />
              ) : null}
              {isScenarioScope ? (
                <AnalyticsScopeDropdown
                  value={scenarioId}
                  onChange={(id) => onScenarioIdChange(id as AnalyticsScenarioId)}
                  options={ANALYTICS_SCENARIO_OPTIONS}
                  ariaLabelPrefix="상황공략"
                  placeholder="상황공략 선택"
                />
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
