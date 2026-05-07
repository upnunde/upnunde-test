"use client";

import React from "react";
import { SeriesItem } from "@/components/series/SeriesItem";
import { WorksEmptyCreateButton } from "@/components/works/WorksEmptyCreateButton";
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
  return (
    <div
      className={`grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-4 ${className ?? ""}`}
    >
      {seriesList.map((series) => (
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
        <WorksEmptyCreateButton
          hint="새로운 작품을 등록하세요"
          actionLabel="새 시리즈 생성"
          onClick={onCreateSeries}
        />
      </div>
    </div>
  );
}
