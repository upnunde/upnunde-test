"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical, Eye, EyeOff, Trash2, Calendar, Layers, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { SeriesData } from "@/types/series";
import { formatSeriesDateOrRelative, formatSeriesViewCount } from "@/lib/formatSeries";
import { THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";
import {
  WORKS_ITEM_CARD_CLASS,
  WORKS_ITEM_CARD_INNER_CLASS,
  WORKS_ITEM_META_ROW_CLASS,
  WORKS_ITEM_THUMBNAIL_CLASS,
  WORKS_ITEM_TITLE_GROUP_CLASS,
} from "@/lib/worksArea";

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

function ViolationIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 6v6h-2V8h2Zm0 8v2h-2v-2h2Z" />
    </svg>
  );
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
  const emptyMetaClass = hasNoEpisodes ? "text-on-surface-30" : "text-on-surface-20";

  const handleResource = () => {
    if (isDraft) return;
    onResourceManage?.(series);
  };

  const handleEpisode = () => {
    if (isDraft) return;
    onEpisodeManage?.(series);
  };

  const handleSeriesManage = () => {
    onSeriesManage?.(series);
  };

  const manageButtons = (
    <>
      <button
        type="button"
        onClick={handleSeriesManage}
        className="flex h-9 min-w-0 flex-1 cursor-pointer items-center rounded-md border border-border-20 bg-white px-my-12 text-body3_500 text-on-surface-20 transition-colors hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20"
      >
        <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
          시리즈
        </span>
      </button>
      <button
        type="button"
        disabled={isDraft}
        title={isDraft ? "시리즈 작성 완료 후 이용 가능합니다" : undefined}
        onClick={handleResource}
        className={`flex h-9 min-w-0 flex-1 items-center rounded-md border px-my-12 text-body3_500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isDraft
            ? "cursor-not-allowed border-border-20 text-on-surface-30"
            : "cursor-pointer border-border-20 bg-white text-on-surface-20 hover:bg-surface-20"
        }`}
      >
        <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
          리소스
        </span>
      </button>
      <button
        type="button"
        disabled={isDraft}
        title={isDraft ? "시리즈 작성 완료 후 이용 가능합니다" : undefined}
        onClick={handleEpisode}
        className={`flex h-9 min-w-0 flex-1 items-center rounded-md border px-my-12 text-body3_500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isDraft
            ? "cursor-not-allowed border-border-20 text-on-surface-30"
            : "cursor-pointer border-border-20 bg-white text-on-surface-20 hover:bg-surface-20"
        }`}
      >
        <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
          에피소드
        </span>
      </button>
    </>
  );

  return (
    <div className={WORKS_ITEM_CARD_CLASS}>
      {/* max-lg: 썸네일+정보 가로 / lg+: contents로 썸네일·우측열을 flex-row 자식으로 */}
      <div className={WORKS_ITEM_CARD_INNER_CLASS}>
        {/* 썸네일 영역 (정책 6, 8, 9, 10) */}
        <div className={WORKS_ITEM_THUMBNAIL_CLASS}>
        {isDraft || !thumbnailUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-200" aria-hidden>
            <span className="text-on-surface-30 text-caption1_400">썸네일 없음</span>
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
                thumbnailUrl.startsWith("data:") || thumbnailUrl.startsWith("blob:")
              }
            />
            <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
            {(isPrivate || isBanned) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-white text-body2_700">
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
        <div className="flex w-full items-start justify-between gap-my-8">
          <div className={WORKS_ITEM_TITLE_GROUP_CLASS}>
            {isPrivate && (
              <span className="inline-flex h-fit shrink-0 rounded px-my-8 py-my-4 text-body3_500 bg-primary/10 text-primary">
                비공개
              </span>
            )}
            {isDraft && (
              <span className="inline-flex h-fit shrink-0 rounded px-my-8 py-my-4 text-body3_500 bg-primary/10 text-primary">
                작성중
              </span>
            )}
            {isBanned && (
              <div className="inline-flex h-7 max-w-full shrink-0 items-center gap-my-4 overflow-hidden rounded border border-destructive px-my-8 py-my-4 lg:max-w-[45%]">
                <ViolationIcon className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
                <span className="truncate text-body3_500 text-destructive">가이드 정책을 위반, 이용 금지</span>
              </div>
            )}
            <h3 className="min-w-0 flex-1 truncate text-heading5_700 text-on-surface-10">{title}</h3>
          </div>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="shrink-0 w-8 h-8 -mt-1 -mr-2 rounded-full flex items-center justify-center text-on-surface-30 hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-10"
                aria-label="더보기"
              >
                <MoreVertical className="w-5 h-5" aria-hidden />
              </button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-lg border border-border-10 bg-white p-my-4">
              {status === "PUBLIC" && (
                <>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-20 outline-none hover:bg-surface-20"
                    onSelect={() => onSetPrivate?.(series)}
                  >
                    <EyeOff className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                    비공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400"
                    onSelect={() => onDelete?.(series)}
                  >
                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                    삭제
                  </DropdownMenuItem>
                </>
              )}
              {status === "PRIVATE" && (
                <>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-20 outline-none hover:bg-surface-20"
                    onSelect={() => onSetPublic?.(series)}
                  >
                    <Eye className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                    공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400"
                    onSelect={() => onDelete?.(series)}
                  >
                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                    삭제
                  </DropdownMenuItem>
                </>
              )}
              {(status === "DRAFT" || status === "BANNED") && (
                <>
                  <DropdownMenuItem
                    disabled
                    className="flex cursor-not-allowed items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-30"
                  >
                    <Eye className="h-4 w-4 shrink-0" aria-hidden />
                    공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400"
                    onSelect={() => onDelete?.(series)}
                  >
                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                    삭제
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 데스크톱: 버튼을 열 하단으로 정렬 */}
        <div className="hidden w-full flex-1 lg:block" aria-hidden />

        {/* 메타: 날짜, 회차 수, 조회수 (정책 2, 3, 4, 11 - 툴팁) */}
        <div className={WORKS_ITEM_META_ROW_CLASS}>
          <div className={`flex min-w-0 flex-1 flex-col items-start justify-center gap-my-8 ${emptyMetaClass}`}>
            <div className={`flex items-center gap-my-8 ${emptyMetaClass}`}>
              <Calendar className="h-[18px] w-[18px]" aria-hidden />
              <span title="생성한 날짜">
                {dateStr}
              </span>
            </div>
            <div className={`flex items-center gap-my-8 ${emptyMetaClass}`}>
              <Eye className="h-[18px] w-[18px]" aria-hidden />
              <span title="작품 누적 조회수">
                {viewStr}
              </span>
            </div>
          </div>
          <div className={`flex min-w-0 flex-1 flex-col items-start justify-start gap-my-8 ${emptyMetaClass}`}>
            <div className={`flex items-center gap-my-8 ${emptyMetaClass}`}>
              <Layers className="h-[18px] w-[18px]" aria-hidden />
              <span title="에피소드 등록 수">
                {episodeStr}
              </span>
            </div>
            <div className={`flex items-center gap-my-8 ${emptyMetaClass}`}>
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
              <span title="댓글 수">
                {commentStr}
              </span>
            </div>
          </div>
        </div>

        {/* 데스크톱: 우측열 하단 버튼 */}
        <div className="hidden w-full items-start justify-start gap-my-8 lg:flex">
          {manageButtons}
        </div>
        </div>
      </div>

      {/* 모바일: 카드 하단 버튼 */}
      <div className="flex w-full items-start justify-start gap-my-8 lg:hidden">
        {manageButtons}
      </div>
    </div>
  );
}
