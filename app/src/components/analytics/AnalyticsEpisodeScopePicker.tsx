"use client";

import { useMemo } from "react";
import { AnalyticsScopeDropdown } from "@/components/analytics/AnalyticsScopeDropdown";
import { getSeriesEpisodeOptions } from "@/components/analytics/analytics-dummy-by-scope";
import type { AnalyticsSeriesWorkId } from "@/components/analytics/analytics-series-options";

export function AnalyticsEpisodeScopePicker({
  seriesId,
  value,
  onChange,
}: {
  seriesId: AnalyticsSeriesWorkId;
  value: "all" | number;
  onChange: (v: "all" | number) => void;
}) {
  const episodeOptions = useMemo(() => getSeriesEpisodeOptions(seriesId), [seriesId]);

  const options = useMemo(
    () => [
      { id: "all", label: "에피소드 전체" },
      ...episodeOptions.map((opt) => ({
        id: String(opt.episodeNo),
        label: `${opt.episodeNo}화 ${opt.title}`,
      })),
    ],
    [episodeOptions],
  );

  return (
    <AnalyticsScopeDropdown
      value={String(value)}
      onChange={(v) => onChange(v === "all" ? "all" : Number(v))}
      options={options}
      ariaLabelPrefix="집계 회차"
      placeholder="에피소드 전체"
      align="end"
      className="shrink-0"
    />
  );
}
