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
      {/* Table Header */}
      <div className="h-12 border-b border-slate-100 flex items-center px-5 bg-white rounded-t-[4px] shrink-0">
        <div className="w-20 text-xs text-on-surface-30">회차</div>
        <div className="flex-1 px-0 text-xs text-on-surface-30">제목</div>
        <div className="w-32 px-0 text-xs text-on-surface-30">개시일</div>
        <div className="w-24 px-0 text-xs text-on-surface-30">조회수</div>
        <div className="w-24 px-0 text-xs text-on-surface-30">공개여부</div>
        <div className="w-48 px-0 text-xs text-on-surface-30 text-right">작업</div>
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
          />
        ))}
      </div>

      {footer != null ? footer : null}
    </div>
  );
}
