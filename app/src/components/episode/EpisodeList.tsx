"use client";

import React from "react";
import { EpisodeListItem } from "@/components/episode/EpisodeListItem";
import type { Episode } from "@/types/episode";

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
  /** 정책 13: 페이지네이션을 테이블 하단에 렌더링할 때 전달 */
  footer?: React.ReactNode;
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
  footer,
  className,
}: EpisodeListProps) {
  return (
    <div
      className={
        "w-full bg-white rounded-[4px] border border-border-10 flex flex-col shrink-0 overflow-hidden " +
        (className ?? "")
      }
    >
      {/* Table Header — 모바일은 카드형 행만 표시 */}
      <div className="hidden h-[42px] shrink-0 items-center rounded-t-[4px] border-b border-divider-10 bg-white px-my-20 lg:flex">
        <div className="w-20 text-caption1_400 text-on-surface-30">회차</div>
        <div className="flex-1 px-0 text-caption1_400 text-on-surface-30">제목</div>
        <div className="w-40 px-0 text-caption1_400 text-on-surface-30">개시일</div>
        <div className="w-24 px-0 text-caption1_400 text-on-surface-30">조회수</div>
        <div className="w-24 px-0 text-caption1_400 text-on-surface-30">공개여부</div>
        <div className="w-48 px-0 text-right text-caption1_400 text-on-surface-30">작업</div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col min-h-0">
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

      {footer != null ? footer : null}
    </div>
  );
}
