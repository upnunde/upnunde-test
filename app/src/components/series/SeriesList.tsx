"use client";

import React from "react";
import { Plus } from "lucide-react";
import { SeriesItem } from "@/components/series/SeriesItem";
import type { SeriesData } from "@/types/series";

export interface SeriesListProps {
  seriesList: SeriesData[];
  onResourceManage?: (series: SeriesData) => void;
  onEpisodeManage?: (series: SeriesData) => void;
  onSeriesManage?: (series: SeriesData) => void;
  onSetPrivate?: (series: SeriesData) => void;
  onSetPublic?: (series: SeriesData) => void;
  onDelete?: (series: SeriesData) => void;
  onViolationDetail?: (series: SeriesData) => void;
  /** 새 시리즈 생성 클릭 */
  onCreateSeries?: () => void;
  className?: string;
}

export function SeriesList({
  seriesList,
  onResourceManage,
  onEpisodeManage,
  onSeriesManage,
  onSetPrivate,
  onSetPublic,
  onDelete,
  onViolationDetail,
  onCreateSeries,
  className,
}: SeriesListProps) {
  const visibleSeries = seriesList.filter((series) => series.status === "PUBLIC");

  return (
    <div className={`w-full max-w-[1200px] grid grid-cols-2 gap-4 ${className ?? ""}`}>
      {visibleSeries.map((series) => (
        <SeriesItem
          key={series.id}
          series={series}
          onResourceManage={onResourceManage}
          onEpisodeManage={onEpisodeManage}
          onSeriesManage={onSeriesManage}
          onSetPrivate={onSetPrivate}
          onSetPublic={onSetPublic}
          onDelete={onDelete}
          onViolationDetail={onViolationDetail}
        />
      ))}
      <div>
        <button
          type="button"
          onClick={onCreateSeries}
          className="flex flex-col items-center justify-center gap-3 w-full min-h-[241px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="text-sm text-slate-500">새로운 작품을 등록하세요</span>
          <span className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            <Plus className="h-4 w-4" aria-hidden />
            새 시리즈 생성
          </span>
        </button>
      </div>
    </div>
  );
}
