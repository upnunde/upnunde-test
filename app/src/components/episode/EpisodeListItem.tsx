"use client";

import React from "react";
import { Pencil, Trash2, MoreVertical, FileText, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Episode, EpisodeStatus } from "@/types/episode";
import { formatViews, formatDate } from "@/lib/formatEpisode";

const STATUS_LABEL: Record<EpisodeStatus, string> = {
  DRAFT: "임시저장",
  PRIVATE: "비공개",
  PUBLISHED: "공개 중",
};

export interface EpisodeListItemProps {
  episode: Episode;
  /** 정책 7: 리스트 항목(썸네일/제목 영역) 클릭 시 원고 에디터 진입 */
  onRowClick?: (episode: Episode) => void;
  onPublish?: (episode: Episode) => void;
  onEdit?: (episode: Episode) => void;
  onDelete?: (episode: Episode) => void;
  /** 정책 10: 링크 에디터(읽기 전용) 화면 진입 */
  onLinkEditor?: (episode: Episode) => void;
  /** 정책 11: 통계 화면(조회수 등) 진입 */
  onStats?: (episode: Episode) => void;
}

export function EpisodeListItem({
  episode,
  onRowClick,
  onPublish,
  onEdit,
  onDelete,
  onLinkEditor,
  onStats,
}: EpisodeListItemProps) {
  const { status, date, views } = episode;
  const isDraft = status === "DRAFT";
  const dateDisplay = isDraft ? "-" : formatDate(date);
  const viewsDisplay = isDraft ? "-" : formatViews(views);

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, [role='menuitem']")) return;
    onRowClick?.(episode);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRowClick?.(episode);
        }
      }}
      className="flex items-center border-b border-slate-100 px-5 py-3 transition-colors hover:bg-slate-100 last:border-b-0 cursor-pointer"
      aria-labelledby={`episode-title-${episode.id}`}
    >
      {/* 회차 */}
      <div className="w-20 shrink-0 text-sm text-[rgb(69,85,108)]" aria-hidden>
        {episode.episodeNumber}화
      </div>

      {/* 썸네일 & 제목 */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="h-[107px] w-[60px] shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-200">
          <img
            src={episode.thumbnail}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <span
          id={`episode-title-${episode.id}`}
          className="truncate text-base font-medium text-slate-900"
        >
          {episode.title}
        </span>
      </div>

      {/* 개시일 (정책 12: YYYY.MM.DD) */}
      <div className="w-32 shrink-0 px-0 text-sm text-[rgb(69,85,108)]">{dateDisplay}</div>

      {/* 조회수 (정책 5: 실시간 표기) */}
      <div className="w-24 shrink-0 px-0 text-sm text-slate-600">{viewsDisplay}</div>

      {/* 공개여부 */}
      <div className="w-24 shrink-0 px-0 text-sm text-slate-600">
        {STATUS_LABEL[status]}
      </div>

      {/* 작업 버튼 영역 - 클릭 시 행 클릭 전파 방지 */}
      <div
        className="flex w-48 shrink-0 items-center justify-end gap-2 px-0"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "DRAFT" && (
          <>
            <button
              type="button"
              onClick={() => onEdit?.(episode)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="수정"
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(episode)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="삭제"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}

        {status === "PRIVATE" && (
          <>
            <button
              type="button"
              onClick={() => onPublish?.(episode)}
              className="h-9 shrink-0 rounded-md border border-primary px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              공개로 전환
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(episode)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="수정"
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(episode)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="삭제"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}

        {status === "PUBLISHED" && (
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="더보기"
            >
              <MoreVertical className="h-4 w-4" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-lg border border-slate-100 bg-white p-1 shadow-lg"
            >
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm text-slate-700 outline-none hover:bg-slate-50"
                onSelect={() => onLinkEditor?.(episode)}
              >
                <FileText className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                에피소드 상세
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm text-slate-700 outline-none hover:bg-slate-50"
                onSelect={() => onStats?.(episode)}
              >
                <Mail className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                문의하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </article>
  );
}
