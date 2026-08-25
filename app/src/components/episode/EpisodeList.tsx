"use client";

import React from "react";
import { EpisodeListItem } from "@/components/episode/EpisodeListItem";
import type { Episode } from "@/types/episode";
import {
  PAGE_MOBILE_LIST_STACK_GAP_CLASS,
} from "@/lib/page-layout";
import { cn } from "design-system/utils";

export interface EpisodeListProps {
  episodes: Episode[];
  onRowClick: (episode: Episode) => void;
  onPublish: (episode: Episode) => void;
  onEdit: (episode: Episode) => void;
  onDelete: (episode: Episode) => void;
  onLinkEditor: (episode: Episode) => void;
  onStats: (episode: Episode) => void;
  onInquiry?: (episode: Episode) => void;
  onCancelSchedule?: (episode: Episode) => void;
  className?: string;
}

/**
 * 에피소드 리스트 테이블 렌더링 영역 (헤더 + 행)
 */
export function EpisodeList({
  episodes,
  onRowClick,
  onPublish,
  onEdit,
  onDelete,
  onLinkEditor,
  onStats,
  onInquiry,
  onCancelSchedule,
  className,
}: EpisodeListProps) {
  return (
    <div className={cn("flex w-full shrink-0 flex-col", className)}>
      {/* Table Header — 모바일은 카드형 행만 표시 */}
      <div className="hidden h-[42px] shrink-0 items-center rounded-t-sm border-b border-divider bg-background px-5 lg:flex">
        <div className="w-20 text-caption1_400 text-foreground-placeholder">회차</div>
        <div className="flex-1 px-0 text-caption1_400 text-foreground-placeholder">제목</div>
        <div className="w-40 px-0 text-caption1_400 text-foreground-placeholder">개시일</div>
        <div className="w-24 px-0 text-caption1_400 text-foreground-placeholder">조회수</div>
        <div className="w-24 px-0 text-caption1_400 text-foreground-placeholder">공개여부</div>
        <div className="w-56 px-0 text-right text-caption1_400 text-foreground-placeholder">작업</div>
      </div>

      {/* Table Body */}
      <div className={cn("flex min-h-0 flex-col", PAGE_MOBILE_LIST_STACK_GAP_CLASS)}>
        {episodes.map((episode) => (
          <EpisodeListItem
            key={episode.id}
            episode={episode}
            onRowClick={onRowClick}
            onPublish={onPublish}
            onEdit={onEdit}
            onDelete={onDelete}
            onLinkEditor={onLinkEditor}
            onStats={onStats}
            onInquiry={onInquiry}
            onCancelSchedule={onCancelSchedule}
          />
        ))}
      </div>
    </div>
  );
}
