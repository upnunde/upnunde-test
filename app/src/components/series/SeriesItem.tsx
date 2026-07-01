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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import type { SeriesData } from "@/types/series";
import { formatSeriesDateOrRelative, formatSeriesViewCount } from "@/lib/formatSeries";
import { THUMBNAIL_DIM_OVERLAY_CLASS, DIM_OVERLAY_TEXT_CLASS } from "@/lib/thumbnail-styles";
import { isDummyResourceUrl } from "@/lib/dummy-asset-path";
import {
  WORKS_ITEM_CARD_CLASS,
  WORKS_ITEM_CARD_INNER_CLASS,
  WORKS_ITEM_META_ROW_CLASS,
  WORKS_ITEM_THUMBNAIL_CLASS,
  WORKS_ITEM_TITLE_GROUP_CLASS,
} from "@/lib/worksArea";
import { cn } from "design-system/utils";

export interface SeriesItemProps {
  series: SeriesData;
  /** 리소스 관리 클릭 */
  onResourceManage?: (series: SeriesData) => void;
  /** 에피소드 관리 클릭 */
  onEpisodeManage?: (series: SeriesData) => void;
  /** 시리즈 관리 클릭 */
  onSeriesManage?: (series: SeriesData) => void;
  /** 비공개로 전환 (PUBLIC → PRIVATE) */
  onSetPrivate?: (series: SeriesData) => void;
  /** 공개로 전환 (PRIVATE → PUBLIC) */
  onSetPublic?: (series: SeriesData) => void;
  /** 삭제 */
  onDelete?: (series: SeriesData) => void;
}

export function SeriesItem({
  series,
  onResourceManage,
  onEpisodeManage,
  onSeriesManage,
  onSetPrivate,
  onSetPublic,
  onDelete,
}: SeriesItemProps) {
  const { title, thumbnailUrl, status, createdAt, episodeCount, viewCount, commentCount } = series;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDraft = status === "DRAFT";
  const isBanned = status === "BANNED";
  const isPrivate = status === "PRIVATE";
  const hasNoEpisodes = episodeCount === 0;

  const dateStr = formatSeriesDateOrRelative(createdAt);
  const viewStr = hasNoEpisodes && viewCount === 0 ? "-" : formatSeriesViewCount(viewCount);
  const episodeStr = hasNoEpisodes ? "에피소드 없음" : `${episodeCount}회`;
  const commentStr = hasNoEpisodes && commentCount === 0 ? "-" : formatSeriesViewCount(commentCount);
  const emptyMetaClass = hasNoEpisodes ? "text-foreground-placeholder" : "text-foreground-muted";

  const handleResource = () => {
    if (isDraft) return;
    onResourceManage?.(series);
  };

  const handleEpisode = () => {
    if (isDraft) return;
    onEpisodeManage?.(series);
  };

  const manageButtons = (
    <>
      <Button
        type="button"
        variant="outline"
        shape="square"
        size="default"
        disabled={isDraft}
        title={isDraft ? "시리즈 작성 완료 후 이용 가능합니다" : undefined}
        onClick={handleResource}
        className="min-w-0 flex-1"
      >
        <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
          리소스
        </span>
      </Button>
      <Button
        type="button"
        variant="outline"
        shape="square"
        size="default"
        disabled={isDraft}
        title={isDraft ? "시리즈 작성 완료 후 이용 가능합니다" : undefined}
        onClick={handleEpisode}
        className="min-w-0 flex-1"
      >
        <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
          에피소드
        </span>
      </Button>
    </>
  );

  return (
    <div className={WORKS_ITEM_CARD_CLASS}>
      {/* max-lg: 썸네일+정보 가로 / lg+: contents로 썸네일·우측열을 flex-row 자식으로 */}
      <div className={WORKS_ITEM_CARD_INNER_CLASS}>
        {/* 썸네일 영역 (정책 6, 8, 9, 10) */}
        <div className={WORKS_ITEM_THUMBNAIL_CLASS}>
        {isDraft || !thumbnailUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-muted" aria-hidden>
            <span className="text-foreground-placeholder text-caption1_400">썸네일 없음</span>
          </div>
        ) : (
          <>
            <Image
              src={thumbnailUrl}
              alt=""
              fill
              sizes="112px"
              className="object-cover"
              unoptimized={
                isDummyResourceUrl(thumbnailUrl) ||
                thumbnailUrl.startsWith("data:") ||
                thumbnailUrl.startsWith("blob:")
              }
            />
            <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
            {(isPrivate || isBanned) && (
              <div className="absolute inset-0 flex items-center justify-center bg-dim-20">
                <span className={cn("text-body2_700", DIM_OVERLAY_TEXT_CLASS)}>
                  {isBanned ? "이용금지" : "비공개"}
                </span>
              </div>
            )}
          </>
        )}
        </div>

        {/* 우측: 제목, 뱃지, 메타 (+ 데스크톱 버튼) */}
        <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
        {/* 제목 + 더보기 (정책 5, 6) — 상태 뱃지는 제목 앞 */}
        <div className="flex w-full items-start justify-between gap-2">
          <div className={WORKS_ITEM_TITLE_GROUP_CLASS}>
            {isPrivate && (
              <Badge variant="default" size="md" shape="square">
                비공개
              </Badge>
            )}
            {isDraft && (
              <Badge variant="default" size="md" shape="square">
                작성중
              </Badge>
            )}
            {isBanned && (
              <Badge variant="destructive" size="md" shape="square" className="max-w-full lg:max-w-[45%]">
                <ICONS.alertCircle className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">가이드 정책을 위반, 이용 금지</span>
              </Badge>
            )}
            <h3 className="min-w-0 flex-1 truncate text-heading5_700 text-foreground">{title}</h3>
          </div>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <IconButton
                type="button"
                variant="ghost"
                shape="circle"
                size="icon-sm"
                icon={ICONS.moreVertical}
                aria-label="더보기"
                className="-mt-1 -mr-2 shrink-0"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => onSeriesManage?.(series)}>
                  <Icon icon={ICONS.settings2} size="md" />
                  시리즈 수정
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {status === "PUBLIC" && (
                  <>
                    <DropdownMenuItem onSelect={() => onSetPrivate?.(series)}>
                      <Icon icon={ICONS.eyeOff} size="md" />
                      비공개
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(series)}>
                      <Icon icon={ICONS.trash2} size="md" />
                      삭제
                    </DropdownMenuItem>
                  </>
                )}
                {status === "PRIVATE" && (
                  <>
                    <DropdownMenuItem onSelect={() => onSetPublic?.(series)}>
                      <Icon icon={ICONS.eye} size="md" />
                      공개
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(series)}>
                      <Icon icon={ICONS.trash2} size="md" />
                      삭제
                    </DropdownMenuItem>
                  </>
                )}
                {(status === "DRAFT" || status === "BANNED") && (
                  <>
                    <DropdownMenuItem disabled>
                      <Icon icon={ICONS.eye} size="md" />
                      공개
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(series)}>
                      <Icon icon={ICONS.trash2} size="md" />
                      삭제
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 데스크톱: 버튼을 열 하단으로 정렬 */}
        <div className="hidden w-full flex-1 lg:block" aria-hidden />

        {/* 메타: 날짜, 회차 수, 조회수 (정책 2, 3, 4, 11 - 툴팁) */}
        <div className={WORKS_ITEM_META_ROW_CLASS}>
          <div className={`flex min-w-0 flex-1 flex-col items-start justify-center gap-2 ${emptyMetaClass}`}>
            <div className={`flex items-center gap-2 ${emptyMetaClass}`}>
              <ICONS.calendar className="h-[18px] w-[18px]" aria-hidden />
              <span title="생성한 날짜">
                {dateStr}
              </span>
            </div>
            <div className={`flex items-center gap-2 ${emptyMetaClass}`}>
              <ICONS.eye className="h-[18px] w-[18px]" aria-hidden />
              <span title="작품 누적 조회수">
                {viewStr}
              </span>
            </div>
          </div>
          <div className={`flex min-w-0 flex-1 flex-col items-start justify-start gap-2 ${emptyMetaClass}`}>
            <div className={`flex items-center gap-2 ${emptyMetaClass}`}>
              <ICONS.layers className="h-[18px] w-[18px]" aria-hidden />
              <span title="에피소드 등록 수">
                {episodeStr}
              </span>
            </div>
            <div className={`flex items-center gap-2 ${emptyMetaClass}`}>
              <ICONS.messageCircle className="h-[18px] w-[18px]" aria-hidden />
              <span title="댓글 수">
                {commentStr}
              </span>
            </div>
          </div>
        </div>

        {/* 데스크톱: 우측열 하단 버튼 */}
        <div className="hidden w-full items-start justify-start gap-2 lg:flex">
          {manageButtons}
        </div>
        </div>
      </div>

      {/* 모바일: 카드 하단 버튼 */}
      <div className="flex w-full items-start justify-start gap-2 lg:hidden">
        {manageButtons}
      </div>
    </div>
  );
}
