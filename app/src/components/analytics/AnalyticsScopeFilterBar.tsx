"use client";

import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { AnalyticsPeriodPicker } from "@/components/analytics/AnalyticsPeriodPicker";
import { type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import {
  analyticsFilledSecondaryChipClassName,
  analyticsScopeChipInactiveClassName,
} from "@/components/analytics/analytics-filter-chips";
import {
  ANALYTICS_SCOPE_CHIPS,
  type AnalyticsScopeCategoryId,
} from "@/components/analytics/analytics-scope-category";
import {
  ANALYTICS_CHARACTER_OPTIONS,
  type AnalyticsCharacterId,
} from "@/components/analytics/analytics-character-options";
import {
  ANALYTICS_SERIES_OPTIONS,
  type AnalyticsSeriesId,
} from "@/components/analytics/analytics-series-options";

export interface AnalyticsScopeFilterBarProps {
  periodRange: AnalyticsPeriodRange;
  onPeriodRangeChange: (v: AnalyticsPeriodRange) => void;
  scopeCategory: AnalyticsScopeCategoryId;
  onScopeCategoryChange: (id: AnalyticsScopeCategoryId) => void;
  seriesId: AnalyticsSeriesId;
  onSeriesIdChange: (id: AnalyticsSeriesId) => void;
  characterId: AnalyticsCharacterId;
  onCharacterIdChange: (id: AnalyticsCharacterId) => void;
}

export function AnalyticsScopeFilterBar({
  periodRange,
  onPeriodRangeChange,
  scopeCategory,
  onScopeCategoryChange,
  seriesId,
  onSeriesIdChange,
  characterId,
  onCharacterIdChange,
}: AnalyticsScopeFilterBarProps) {
  const isSeriesScope = scopeCategory === "series";
  const isCharacterScope = scopeCategory === "character";
  const showSubScopeTabs = isSeriesScope || isCharacterScope;

  return (
    <div className="flex flex-col items-start justify-start gap-3 self-stretch">
      <div className="inline-flex items-center justify-between self-stretch">
        <div className="flex flex-wrap items-center justify-start gap-2" role="group" aria-label="콘텐츠 범위">
          {ANALYTICS_SCOPE_CHIPS.map(({ id, label }) => {
            const selected = scopeCategory === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => onScopeCategoryChange(id)}
                className={selected ? analyticsFilledSecondaryChipClassName : analyticsScopeChipInactiveClassName}
              >
                <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-base font-medium leading-5">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        <AnalyticsPeriodPicker value={periodRange} onChange={onPeriodRangeChange} />
      </div>

      {showSubScopeTabs ? (
        <div className="flex w-full items-end gap-3 border-b border-border-10/5 pb-0.5">
          {isSeriesScope ? (
            <SegmentedTextTabs
              aria-label="시리즈 작품"
              items={ANALYTICS_SERIES_OPTIONS.map((s) => ({ id: s.id, label: s.label }))}
              activeId={seriesId}
              onSelect={(id) => onSeriesIdChange(id as AnalyticsSeriesId)}
              size="l"
              underline
              className="min-w-0 flex-1"
              tabListClassName="self-stretch"
            />
          ) : null}
          {isCharacterScope ? (
            <SegmentedTextTabs
              aria-label="캐릭터"
              items={ANALYTICS_CHARACTER_OPTIONS.map((c) => ({ id: c.id, label: c.label }))}
              activeId={characterId}
              onSelect={(id) => onCharacterIdChange(id as AnalyticsCharacterId)}
              size="l"
              underline
              className="min-w-0 flex-1"
              tabListClassName="self-stretch"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
