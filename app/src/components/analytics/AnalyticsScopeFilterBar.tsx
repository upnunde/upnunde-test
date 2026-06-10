"use client";

import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { AnalyticsPeriodPicker } from "@/components/analytics/AnalyticsPeriodPicker";
import { AnalyticsScopeDropdown } from "@/components/analytics/AnalyticsScopeDropdown";
import { AnalyticsEpisodeScopePicker } from "@/components/analytics/AnalyticsEpisodeScopePicker";
import type { AnalyticsAreaTabId } from "@/components/analytics/AnalyticsDashboard";
import { type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import {
  analyticsFilterChipResponsiveClassName,
  analyticsScopeFilterDividerClassName,
  analyticsScopeFilterShellClassName,
} from "@/components/analytics/analytics-filter-chips";
import { FilterChip } from "@/components/ui/chip";
import { CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS } from "@/lib/chip-styles";
import {
  ANALYTICS_SCOPE_CHIPS,
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
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn(analyticsScopeFilterShellClassName, className)}>
      <div className="flex w-full min-w-0 items-center justify-between gap-my-4 sm:flex-wrap sm:gap-x-my-16 sm:gap-y-my-8 lg:gap-my-8">
        <div className="min-w-0 flex-1">
          <SegmentedTextTabs
            aria-label="분석 영역"
            items={[...AREA_TABS]}
            activeId={analyticsArea}
            onSelect={(id) => onAnalyticsAreaChange(id as AnalyticsAreaTabId)}
            size="xl"
            underline={false}
          />
        </div>
        <div className="shrink-0">
          <AnalyticsPeriodPicker value={periodRange} onChange={onPeriodRangeChange} variant="inline" />
        </div>
      </div>

      <div
        className={cn(
          "flex w-full items-center overflow-x-auto",
          CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS,
        )}
      >
        <div
          className={cn("flex shrink-0 items-center", CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS)}
          role="group"
          aria-label="콘텐츠 범위"
        >
          {ANALYTICS_SCOPE_CHIPS.map(({ id, label }) => {
            const selected = scopeCategory === id;
            return (
              <FilterChip
                key={id}
                selected={selected}
                chipSize="l"
                aria-pressed={selected}
                className={cn("min-w-20", analyticsFilterChipResponsiveClassName)}
                onClick={() => onScopeCategoryChange(id)}
              >
                {label}
              </FilterChip>
            );
          })}
        </div>

        {isSeriesScope || isCharacterScope || isScenarioScope ? (
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
