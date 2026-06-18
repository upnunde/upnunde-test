"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical, Eye, EyeOff, Trash2, Calendar, Heart, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { CharacterData } from "@/types/character";
import { formatSeriesDateOrRelative, formatSeriesViewCount } from "@/lib/formatSeries";
import { THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";
import {
  WORKS_ITEM_CARD_CLASS,
  WORKS_ITEM_CARD_INNER_CLASS,
  WORKS_ITEM_META_ROW_CLASS,
  WORKS_ITEM_THUMBNAIL_CLASS,
  WORKS_ITEM_TITLE_GROUP_CLASS,
} from "@/lib/worksArea";

function ViolationIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 6v6h-2V8h2Zm0 8v2h-2v-2h2Z" />
    </svg>
  );
}

export interface CharacterItemProps {
  character: CharacterData;
  onCharacterSettings?: (character: CharacterData) => void;
  onSetPrivate?: (character: CharacterData) => void;
  onSetPublic?: (character: CharacterData) => void;
  onDelete?: (character: CharacterData) => void;
}

export function CharacterItem({
  character,
  onCharacterSettings,
  onSetPrivate,
  onSetPublic,
  onDelete,
}: CharacterItemProps) {
  const { title, tagline, thumbnailUrl, status, createdAt, viewCount, stat1, stat2, sourceSeries } = character;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDraft = status === "DRAFT";
  const isBanned = status === "BANNED";
  const isPrivate = status === "PRIVATE";

  const dateStr = formatSeriesDateOrRelative(createdAt);
  const viewStr = formatSeriesViewCount(viewCount);
  const stat1Str = formatSeriesViewCount(stat1);
  const stat2Str = formatSeriesViewCount(stat2);

  const settingsButton = (
    <button
      type="button"
      onClick={() => onCharacterSettings?.(character)}
      className="flex h-9 min-w-0 flex-1 cursor-pointer items-center rounded-md border border-border-20 bg-white px-my-12 text-body3_500 text-on-surface-20 transition-colors hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20"
    >
      <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
        캐릭터 설정
      </span>
    </button>
  );

  return (
    <div className={WORKS_ITEM_CARD_CLASS}>
      <div className={WORKS_ITEM_CARD_INNER_CLASS}>
        <div className={WORKS_ITEM_THUMBNAIL_CLASS}>
          {isDraft || !thumbnailUrl ? (
            <div className="flex h-full w-full items-center justify-center bg-slate-200" aria-hidden>
              <span className="text-on-surface-30 text-caption1_400">썸네일 없음</span>
            </div>
          ) : (
            <>
              <Image src={thumbnailUrl} alt="" fill sizes="112px" className="object-cover" />
              <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
              {(isPrivate || isBanned) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-body2_700 text-white">{isBanned ? "이용금지" : "비공개"}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
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
                  className="-mr-2 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-on-surface-30 hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-10"
                  aria-label="더보기"
                >
                  <MoreVertical className="h-5 w-5" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-lg border border-border-10 bg-white p-my-4">
                {status === "PUBLIC" && (
                  <>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-20 outline-none hover:bg-surface-20"
                      onSelect={() => onSetPrivate?.(character)}
                    >
                      <EyeOff className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                      비공개
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400"
                      onSelect={() => onDelete?.(character)}
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
                      onSelect={() => onSetPublic?.(character)}
                    >
                      <Eye className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                      공개
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400"
                      onSelect={() => onDelete?.(character)}
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
                      onSelect={() => onDelete?.(character)}
                    >
                      <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                      삭제
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-1 flex min-w-0 w-full items-center gap-my-8 overflow-hidden text-body3_400">
            {sourceSeries ? (
              <>
                <span className="max-w-[45%] shrink-0 truncate text-on-surface-30">{sourceSeries.title}</span>
                <span
                  className="shrink-0 select-none text-caption1_400 text-border-20"
                  role="separator"
                  aria-hidden
                >
                  ㅣ
                </span>
              </>
            ) : null}
            <span className="min-w-0 flex-1 truncate text-on-surface-30">{tagline}</span>
          </div>

          <div className="hidden w-full flex-1 lg:block" aria-hidden />

          <div className={WORKS_ITEM_META_ROW_CLASS}>
            <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-my-8 text-on-surface-20">
              <div className="flex items-center gap-my-8 text-on-surface-20">
                <Calendar className="h-[18px] w-[18px]" aria-hidden />
                <span className="text-on-surface-20" title="등록일">
                  {dateStr}
                </span>
              </div>
              <div className="flex items-center gap-my-8 text-on-surface-20">
                <Eye className="h-[18px] w-[18px]" aria-hidden />
                <span className="text-on-surface-20" title="누적 조회수">
                  {viewStr}
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-my-8 text-on-surface-20">
              <div className="flex items-center gap-my-8 text-on-surface-20">
                <Heart className="h-[18px] w-[18px]" aria-hidden />
                <span className="text-on-surface-20" title="좋아요 수">
                  {stat1Str}
                </span>
              </div>
              <div className="flex items-center gap-my-8 text-on-surface-20">
                <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
                <span className="text-on-surface-20" title="댓글 수">
                  {stat2Str}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden w-full items-start justify-start gap-my-8 lg:flex">
            {settingsButton}
          </div>
        </div>
      </div>

      <div className="flex w-full items-start justify-start gap-my-8 lg:hidden">
        {settingsButton}
      </div>
    </div>
  );
}
