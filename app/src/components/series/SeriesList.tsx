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
  onCreateSeries,
  className,
}: SeriesListProps) {
  // 모든 상태(PUBLIC / PRIVATE / DRAFT / BANNED)를 화면에서 보여주되
  // 상태별로 정렬해 시각적인 우선순위만 조정한다.
  const orderedSeries = [...seriesList].sort((a, b) => {
    const order: Record<SeriesData["status"], number> = {
      PUBLIC: 0,
      PRIVATE: 1,
      DRAFT: 2,
      BANNED: 3,
    };
    return order[a.status] - order[b.status];
  });

  return (
    <div
      className={`grid w-full max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-4 ${className ?? ""}`}
    >
      {orderedSeries.map((series) => (
        <SeriesItem
          key={series.id}
          series={series}
          onResourceManage={onResourceManage}
          onEpisodeManage={onEpisodeManage}
          onSeriesManage={onSeriesManage}
          onSetPrivate={onSetPrivate}
          onSetPublic={onSetPublic}
          onDelete={onDelete}
        />
      ))}
      <div className="min-w-0">
        <button
          type="button"
          onClick={onCreateSeries}
          className="flex flex-col cursor-pointer items-center justify-center gap-3 w-full min-h-[241px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="text-sm text-on-surface-30">새로운 작품을 등록하세요</span>
          <span className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            <Plus className="h-4 w-4" aria-hidden />
            새 시리즈 생성
          </span>
        </button>
      </div>
    </div>
  );
}
