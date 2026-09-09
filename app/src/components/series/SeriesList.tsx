"use client";

import React from "react";
import { SeriesItem } from "@/components/series/SeriesItem";
import { WorksEmptyCreateButton } from "@/components/works/WorksEmptyCreateButton";
import type { SeriesData } from "@/types/series";
import { WORKS_LIST_CREATE_SLOT_CLASS, WORKS_LIST_GRID_CLASS } from "@/lib/worksArea";

export interface SeriesListProps {
  seriesList: SeriesData[];
  onViewDetail?: (series: SeriesData) => void;
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
  onViewDetail,
  onResourceManage,
  onEpisodeManage,
  onSeriesManage,
  onSetPrivate,
  onSetPublic,
  onDelete,
  onCreateSeries,
  className,
}: SeriesListProps) {
  const isEmpty = seriesList.length === 0;

  return (
    <div className={`${WORKS_LIST_GRID_CLASS} ${className ?? ""}`}>
      {seriesList.map((series) => (
        <SeriesItem
          key={series.id}
          series={series}
          onViewDetail={onViewDetail}
          onResourceManage={onResourceManage}
          onEpisodeManage={onEpisodeManage}
          onSeriesManage={onSeriesManage}
          onSetPrivate={onSetPrivate}
          onSetPublic={onSetPublic}
          onDelete={onDelete}
        />
      ))}
      <div className={WORKS_LIST_CREATE_SLOT_CLASS}>
        <WorksEmptyCreateButton
          hint={isEmpty ? "새로운 작품을 등록하세요" : "시리즈를 더 추가하세요"}
          actionLabel={isEmpty ? "새 시리즈 생성" : "시리즈 추가"}
          onClick={onCreateSeries}
        />
      </div>
    </div>
  );
}
