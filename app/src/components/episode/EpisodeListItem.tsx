"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, MoreVertical, FileText, Mail, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EditorBottomSheetMenu } from "@/components/editor/EditorBottomSheetMenu";
import { EditorMenuOption } from "@/components/editor/EditorMenuOption";
import type { Episode, EpisodeStatus } from "@/types/episode";
import { formatViews, formatDateOrRelative } from "@/lib/formatEpisode";
import { THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";
import { cn } from "@/lib/utils";

const ACTION_ICON_BUTTON_BASE =
  "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-20 text-on-surface-30 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20";
const ACTION_ICON_BUTTON_EDIT_HOVER =
  "hover:border-primary/30 hover:bg-primary/10 hover:text-primary active:scale-95";
const ACTION_ICON_BUTTON_DELETE_HOVER =
  "hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-95";
const ACTION_ICON_BUTTON_MORE_HOVER =
  "hover:border-border-20 hover:bg-surface-30 hover:text-on-surface-10 active:scale-95";

const STATUS_LABEL: Record<EpisodeStatus, string> = {
  DRAFT: "임시저장",
  PRIVATE: "비공개",
  PUBLISHED: "공개 중",
};

const STATUS_TEXT_CLASS: Record<EpisodeStatus, string> = {
  DRAFT: "text-error-error",
  PRIVATE: "text-error-error",
  PUBLISHED: "text-blue-600",
};

export interface EpisodeListItemProps {
  episode: Episode;
  /** 정책 7: 리스트 항목(썸네일/제목 영역) 클릭 시 에피소드 상세(수정 불가) 진입 */
  onRowClick?: (episode: Episode) => void;
  onPublish?: (episode: Episode) => void;
  onEdit?: (episode: Episode) => void;
  onDelete?: (episode: Episode) => void;
  /** 정책 10: 링크 에디터(읽기 전용) 화면 진입 */
  onLinkEditor?: (episode: Episode) => void;
  /** 정책 11: 통계 화면(조회수 등) 진입 */
  /** 통계 화면 라우팅 핸들러 (현재 미연동) */
  onStats?: (episode: Episode) => void;
  /** 문의하기 클릭 시 (문의 페이지/모달 등) */
  onInquiry?: (episode: Episode) => void;
}

function EpisodeListItemActions({
  episode,
  status,
  onPublish,
  onEdit,
  onDelete,
  onLinkEditor,
  onInquiry,
  mobile = false,
  className,
}: {
  episode: Episode;
  status: EpisodeStatus;
  onPublish?: (episode: Episode) => void;
  onEdit?: (episode: Episode) => void;
  onDelete?: (episode: Episode) => void;
  onLinkEditor?: (episode: Episode) => void;
  onInquiry?: (episode: Episode) => void;
  mobile?: boolean;
  className?: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const closeSheet = () => setSheetOpen(false);

  if (mobile) {
    return (
      <EditorBottomSheetMenu
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="에피소드 작업"
        trigger={
          <button
            type="button"
            className={cn(
              "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-30 transition-colors active:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              className,
            )}
            aria-label="에피소드 작업"
          >
            <MoreVertical className="h-5 w-5" aria-hidden />
          </button>
        }
      >
        {(presentation) => (
          <div className="flex flex-col pb-my-8">
            {status === "DRAFT" && (
              <>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onEdit?.(episode);
                    closeSheet();
                  }}
                >
                  <Pencil className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                  수정
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onDelete?.(episode);
                    closeSheet();
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                  삭제
                </EditorMenuOption>
              </>
            )}
            {status === "PRIVATE" && (
              <>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onPublish?.(episode);
                    closeSheet();
                  }}
                  className="text-primary"
                >
                  <Eye className="h-4 w-4 shrink-0" aria-hidden />
                  공개로 전환
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onEdit?.(episode);
                    closeSheet();
                  }}
                >
                  <Pencil className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                  수정
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onDelete?.(episode);
                    closeSheet();
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                  삭제
                </EditorMenuOption>
              </>
            )}
            {status === "PUBLISHED" && (
              <>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onLinkEditor?.(episode);
                    closeSheet();
                  }}
                >
                  <FileText className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                  에피소드 상세
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onInquiry?.(episode);
                    closeSheet();
                  }}
                >
                  <Mail className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                  문의하기
                </EditorMenuOption>
              </>
            )}
          </div>
        )}
      </EditorBottomSheetMenu>
    );
  }

  return (
    <div className={cn("flex shrink-0 items-center justify-end gap-my-8", className)}>
      {status === "DRAFT" && (
        <>
          <button
            type="button"
            onClick={() => onEdit?.(episode)}
            className={`${ACTION_ICON_BUTTON_BASE} ${ACTION_ICON_BUTTON_EDIT_HOVER}`}
            aria-label="수정"
          >
            <Pencil className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(episode)}
            className={`${ACTION_ICON_BUTTON_BASE} ${ACTION_ICON_BUTTON_DELETE_HOVER}`}
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
            className="h-8 shrink-0 cursor-pointer rounded-md border border-primary px-my-8 text-body3_500 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-my-12"
          >
            공개로 전환
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(episode)}
            className={`${ACTION_ICON_BUTTON_BASE} ${ACTION_ICON_BUTTON_EDIT_HOVER}`}
            aria-label="수정"
          >
            <Pencil className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(episode)}
            className={`${ACTION_ICON_BUTTON_BASE} ${ACTION_ICON_BUTTON_DELETE_HOVER}`}
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
            className={`${ACTION_ICON_BUTTON_BASE} ${ACTION_ICON_BUTTON_MORE_HOVER}`}
            aria-label="더보기"
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-lg border border-border-10 bg-white p-my-4"
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-20 outline-none hover:bg-surface-20"
              onSelect={() => onLinkEditor?.(episode)}
            >
              <FileText className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
              에피소드 상세
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-20 outline-none hover:bg-surface-20"
              onSelect={() => onInquiry?.(episode)}
            >
              <Mail className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
              문의하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export function EpisodeListItem({
  episode,
  onRowClick,
  onPublish,
  onEdit,
  onDelete,
  onLinkEditor,
  onStats: _onStats,
  onInquiry,
}: EpisodeListItemProps) {
  const { status, date, views } = episode;
  const isDraft = status === "DRAFT";
  const dateDisplay = isDraft ? "-" : formatDateOrRelative(date);
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
      className="cursor-pointer border-b border-divider-10 px-my-12 py-my-16 transition-colors last:border-b-0 hover:bg-surface-20 lg:px-my-20 lg:py-my-12"
      aria-label={`${episode.episodeNumber}화 ${episode.title}`}
    >
      {/* 모바일: 썸네일 + 제목·상태·메타 / 우상단 ⋮ 메뉴 */}
      <div className="flex items-start gap-my-12 lg:hidden">
        <div className="relative aspect-[9/16] h-[120px] shrink-0 overflow-hidden rounded border border-border-10 bg-slate-200">
          <Image
            src={episode.thumbnail}
            alt=""
            fill
            sizes="(max-width: 1024px) 68px, 60px"
            className="object-cover"
          />
          <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-my-4">
          <div className="flex items-center justify-between gap-my-4">
            <p className="min-w-0 text-caption1_400 text-on-surface-30">
              {episode.episodeNumber}화
            </p>
            <div className="-mr-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <EpisodeListItemActions
                episode={episode}
                status={status}
                onPublish={onPublish}
                onEdit={onEdit}
                onDelete={onDelete}
                onLinkEditor={onLinkEditor}
                onInquiry={onInquiry}
                mobile
              />
            </div>
          </div>
          <span className="line-clamp-2 text-body1_700 text-on-surface-10">{episode.title}</span>
          <span className={cn("text-caption1_400", STATUS_TEXT_CLASS[status])}>
            {STATUS_LABEL[status]}
          </span>
          <div className="flex items-center gap-x-my-12 text-caption1_400 text-on-surface-30">
            <span>{dateDisplay}</span>
            {!isDraft ? <span>{viewsDisplay}</span> : null}
          </div>
        </div>
      </div>

      {/* lg 이상: 기존 테이블 행 (헤더 컬럼 폭과 동일) */}
      <div className="hidden w-full items-center lg:flex">
        <div className="w-20 shrink-0 text-body3_400 text-on-surface-20" aria-hidden>
          {episode.episodeNumber}화
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-my-16">
          <div className="relative h-[107px] w-[60px] shrink-0 overflow-hidden rounded border border-border-10 bg-slate-200">
            <Image
              src={episode.thumbnail}
              alt=""
              fill
              sizes="60px"
              className="object-cover"
            />
            <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
          </div>
          <span className="min-w-0 flex-1 truncate text-body1_500 text-on-surface-10">
            {episode.title}
          </span>
        </div>

        <div className="w-32 shrink-0 px-0 text-body3_400 text-on-surface-20">{dateDisplay}</div>
        <div className="w-24 shrink-0 px-0 text-body3_400 text-on-surface-30">{viewsDisplay}</div>
        <div className={cn("w-24 shrink-0 px-0 text-body3_400", STATUS_TEXT_CLASS[status])}>
          {STATUS_LABEL[status]}
        </div>

        <div className="w-48 shrink-0" onClick={(e) => e.stopPropagation()}>
          <EpisodeListItemActions
            episode={episode}
            status={status}
            onPublish={onPublish}
            onEdit={onEdit}
            onDelete={onDelete}
            onLinkEditor={onLinkEditor}
            onInquiry={onInquiry}
          />
        </div>
      </div>
    </article>
  );
}
