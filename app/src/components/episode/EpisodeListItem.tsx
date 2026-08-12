"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ICONS, Icon } from "@/lib/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EditorBottomSheetMenu } from "@/components/editor/EditorBottomSheetMenu";
import { EditorMenuOption } from "@/components/editor/EditorMenuOption";
import { Button } from "design-system/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import type { Episode, EpisodeStatus } from "@/types/episode";
import { formatViews, formatDateOrRelative, formatScheduledPublishAtParts } from "@/lib/formatEpisode";
import { THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";
import { isDummyResourceUrl } from "@/lib/dummy-asset-path";
import { PAGE_MOBILE_LIST_ITEM_CARD_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

const STATUS_LABEL: Record<EpisodeStatus, string> = {
  DRAFT: "임시저장",
  PRIVATE: "비공개",
  SCHEDULED: "예약 공개",
  PUBLISHED: "공개 중",
};

const STATUS_TEXT_CLASS: Record<EpisodeStatus, string> = {
  DRAFT: "text-foreground-placeholder",
  PRIVATE: "text-foreground-placeholder",
  SCHEDULED: "text-primary",
  PUBLISHED: "text-info",
};

function EpisodeDateDisplay({
  isDraft,
  isScheduled,
  scheduledPublishAt,
  date,
  className,
}: {
  isDraft: boolean;
  isScheduled: boolean;
  scheduledPublishAt?: string | null;
  date: string;
  className?: string;
}) {
  if (isDraft) {
    return <span className={className}>-</span>;
  }

  if (isScheduled && scheduledPublishAt) {
    const { date: datePart, time } = formatScheduledPublishAtParts(scheduledPublishAt);
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span>{datePart}</span>
        <span>{time}</span>
      </div>
    );
  }

  return <span className={className}>{formatDateOrRelative(date)}</span>;
}

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
  /** 예약 공개 취소 */
  onCancelSchedule?: (episode: Episode) => void;
}

function EpisodeListItemActions({
  episode,
  status,
  onPublish,
  onEdit,
  onDelete,
  onLinkEditor,
  onInquiry,
  onCancelSchedule,
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
  onCancelSchedule?: (episode: Episode) => void;
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
          <IconButton
            type="button"
            variant="ghost"
            shape="circle"
            size="icon-sm"
            icon={ICONS.moreVertical}
            aria-label="에피소드 작업"
            className={className}
          />
        }
      >
        {(presentation) => (
          <div className="flex flex-col pb-2">
            {status === "DRAFT" && (
              <>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onEdit?.(episode);
                    closeSheet();
                  }}
                >
                  <Icon icon={ICONS.pencil} size="md" />
                  수정
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  destructive
                  onSelect={() => {
                    onDelete?.(episode);
                    closeSheet();
                  }}
                >
                  <Icon icon={ICONS.trash2} size="md" />
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
                  <Icon icon={ICONS.eye} size="md" />
                  공개로 전환
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onEdit?.(episode);
                    closeSheet();
                  }}
                >
                  <Icon icon={ICONS.pencil} size="md" />
                  수정
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  destructive
                  onSelect={() => {
                    onDelete?.(episode);
                    closeSheet();
                  }}
                >
                  <Icon icon={ICONS.trash2} size="md" />
                  삭제
                </EditorMenuOption>
              </>
            )}
            {status === "SCHEDULED" && (
              <>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onPublish?.(episode);
                    closeSheet();
                  }}
                  className="text-primary"
                >
                  <Icon icon={ICONS.eye} size="md" />
                  예약 변경
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onLinkEditor?.(episode);
                    closeSheet();
                  }}
                >
                  <Icon icon={ICONS.fileText} size="md" />
                  에피소드 상세
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onCancelSchedule?.(episode);
                    closeSheet();
                  }}
                >
                  <Icon icon={ICONS.close} size="md" />
                  예약취소
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
                  <Icon icon={ICONS.fileText} size="md" />
                  에피소드 상세
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    onInquiry?.(episode);
                    closeSheet();
                  }}
                >
                  <Icon icon={ICONS.mail} size="md" />
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
    <div className={cn("flex shrink-0 items-center justify-end gap-2", className)}>
      {status === "DRAFT" && (
        <>
          <IconButton
            type="button"
            variant="outline"
            shape="circle"
            size="icon-sm"
            icon={ICONS.pencil}
            aria-label="수정"
            onClick={() => onEdit?.(episode)}
          />
          <IconButton
            type="button"
            variant="outline"
            shape="circle"
            size="icon-sm"
            icon={ICONS.trash2}
            aria-label="삭제"
            onClick={() => onDelete?.(episode)}
          />
        </>
      )}

      {status === "PRIVATE" && (
        <>
          <Button
            type="button"
            variant="outline"
            shape="square"
            size="sm"
            className="shrink-0"
            onClick={() => onPublish?.(episode)}
          >
            공개로 전환
          </Button>
          <IconButton
            type="button"
            variant="outline"
            shape="circle"
            size="icon-sm"
            icon={ICONS.pencil}
            aria-label="수정"
            onClick={() => onEdit?.(episode)}
          />
          <IconButton
            type="button"
            variant="outline"
            shape="circle"
            size="icon-sm"
            icon={ICONS.trash2}
            aria-label="삭제"
            onClick={() => onDelete?.(episode)}
          />
        </>
      )}

      {status === "SCHEDULED" && (
        <>
          <Button
            type="button"
            variant="outline"
            shape="square"
            size="sm"
            className="shrink-0"
            onClick={() => onPublish?.(episode)}
          >
            예약 변경
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                type="button"
                variant="outline"
                shape="circle"
                size="icon-sm"
                icon={ICONS.moreVertical}
                aria-label="더보기"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => onLinkEditor?.(episode)}>
                  <Icon icon={ICONS.fileText} size="md" />
                  에피소드 상세
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onCancelSchedule?.(episode)}>
                  <Icon icon={ICONS.close} size="md" />
                  예약취소
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {status === "PUBLISHED" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              type="button"
              variant="outline"
              shape="circle"
              size="icon-sm"
              icon={ICONS.moreVertical}
              aria-label="더보기"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => onLinkEditor?.(episode)}>
                <Icon icon={ICONS.fileText} size="md" />
                에피소드 상세
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onInquiry?.(episode)}>
                <Icon icon={ICONS.mail} size="md" />
                문의하기
              </DropdownMenuItem>
            </DropdownMenuGroup>
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
  onCancelSchedule,
}: EpisodeListItemProps) {
  const { status, date, views, scheduledPublishAt } = episode;
  const isDraft = status === "DRAFT";
  const isScheduled = status === "SCHEDULED";
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
      className={cn(
        "cursor-pointer transition-colors",
        PAGE_MOBILE_LIST_ITEM_CARD_CLASS,
        "max-lg:hover:bg-muted/50",
        "lg:border-b lg:border-divider lg:px-5 lg:py-3 lg:last:border-b-0 lg:hover:bg-muted",
      )}
      aria-label={`${episode.episodeNumber}화 ${episode.title}`}
    >
      {/* 모바일: 썸네일 + 제목·상태·메타 / 우상단 ⋮ 메뉴 */}
      <div className="flex items-start gap-3 lg:hidden">
        <div className="relative aspect-[9/16] h-[120px] shrink-0 overflow-hidden rounded border border-border bg-secondary">
          <Image
            src={episode.thumbnail}
            alt=""
            fill
            sizes="(max-width: 1024px) 68px, 60px"
            className="object-cover"
            unoptimized={isDummyResourceUrl(episode.thumbnail)}
          />
          <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0">
          <div className="flex items-center justify-between gap-1">
            <p className="min-w-0 text-caption1_400 text-foreground-placeholder">
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
                onCancelSchedule={onCancelSchedule}
                mobile
              />
            </div>
          </div>
          <span className="line-clamp-2 text-body1_700 text-foreground">{episode.title}</span>
          <span className={cn("text-caption1_400", STATUS_TEXT_CLASS[status])}>
            {STATUS_LABEL[status]}
          </span>
          <div className="mt-4 flex items-center gap-x-3 text-caption1_400 text-foreground-placeholder">
            <div className="flex items-center gap-2">
              <ICONS.calendar className="h-4 w-4 shrink-0" aria-hidden />
              <EpisodeDateDisplay
                isDraft={isDraft}
                isScheduled={isScheduled}
                scheduledPublishAt={scheduledPublishAt}
                date={date}
              />
            </div>
            {!isDraft ? (
              <div className="flex items-center gap-2">
                <ICONS.eye className="h-4 w-4 shrink-0" aria-hidden />
                <span>{viewsDisplay}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* lg 이상: 기존 테이블 행 (헤더 컬럼 폭과 동일) */}
      <div className="hidden w-full items-center lg:flex">
        <div className="w-20 shrink-0 text-body3_400 text-foreground-muted" aria-hidden>
          {episode.episodeNumber}화
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="relative h-[107px] w-[60px] shrink-0 overflow-hidden rounded border border-border bg-secondary">
            <Image
              src={episode.thumbnail}
              alt=""
              fill
              sizes="60px"
              className="object-cover"
              unoptimized={isDummyResourceUrl(episode.thumbnail)}
            />
            <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
          </div>
          <span className="min-w-0 flex-1 truncate text-body1_500 text-foreground">
            {episode.title}
          </span>
        </div>

        <EpisodeDateDisplay
          isDraft={isDraft}
          isScheduled={isScheduled}
          scheduledPublishAt={scheduledPublishAt}
          date={date}
          className="w-40 shrink-0 px-0 text-body3_400 text-foreground-muted"
        />
        <div className="w-24 shrink-0 px-0 text-body3_400 text-foreground-placeholder">{viewsDisplay}</div>
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
            onCancelSchedule={onCancelSchedule}
          />
        </div>
      </div>
    </article>
  );
}
