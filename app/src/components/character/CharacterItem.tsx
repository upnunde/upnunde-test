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
  const { title, tagline, thumbnailUrl, status, createdAt, viewCount, stat1, stat2 } = character;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDraft = status === "DRAFT";
  const isBanned = status === "BANNED";
  const isPrivate = status === "PRIVATE";

  const dateStr = formatSeriesDateOrRelative(createdAt);
  const viewStr = formatSeriesViewCount(viewCount);
  const stat1Str = formatSeriesViewCount(stat1);
  const stat2Str = formatSeriesViewCount(stat2);

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-col gap-5 py-5 pl-5 pr-5 min-[480px]:flex-row rounded-[4px] border border-border-10 bg-white">
      <div className="relative aspect-[9/16] w-28 max-[479px]:self-center shrink-0 overflow-hidden rounded bg-slate-200">
        {isDraft || !thumbnailUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-200" aria-hidden>
            <span className="text-on-surface-30 text-xs">썸네일 없음</span>
          </div>
        ) : (
          <>
            <Image src={thumbnailUrl} alt="" fill sizes="112px" className="object-cover" />
            {(isPrivate || isBanned) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-[15px] font-bold text-white">{isBanned ? "이용금지" : "비공개"}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
        <div className="flex w-full items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <h3 className="min-w-0 truncate text-lg font-bold text-on-surface-10">{title}</h3>
            {isPrivate && (
              <span className="inline-flex h-fit shrink-0 rounded px-2 py-1 text-sm font-medium bg-primary/10 text-primary">
                비공개
              </span>
            )}
            {isDraft && (
              <span className="inline-flex h-fit shrink-0 rounded px-2 py-1 text-sm font-medium bg-primary/10 text-primary">
                작성중
              </span>
            )}
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
            <DropdownMenuContent align="end" className="w-48 rounded-lg border border-border-10 bg-white p-1">
              {status === "PUBLIC" && (
                <>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm text-on-surface-20 outline-none hover:bg-surface-20"
                    onSelect={() => onSetPrivate?.(character)}
                  >
                    <EyeOff className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                    비공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm"
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
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm text-on-surface-20 outline-none hover:bg-surface-20"
                    onSelect={() => onSetPublic?.(character)}
                  >
                    <Eye className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                    공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm"
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
                    className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-2.5 text-sm text-on-surface-30"
                  >
                    <Eye className="h-4 w-4 shrink-0" aria-hidden />
                    공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm"
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

        {isBanned && (
          <div className="mt-1 inline-flex h-7 items-center gap-1 rounded border border-destructive px-2 py-1">
            <ViolationIcon className="h-5 w-5 text-destructive" aria-hidden />
            <span className="text-sm font-medium text-destructive">가이드 정책을 위반, 이용 금지</span>
          </div>
        )}

        <p className="mt-1 line-clamp-2 w-full text-sm text-on-surface-30">{tagline}</p>

        <div className="w-full flex-1" aria-hidden />

        <div className="mb-5 flex flex-wrap gap-6 text-[13px] leading-5 text-on-surface-20 [&_svg]:shrink-0 [&_svg]:text-on-surface-20">
          <div className="flex flex-col items-start justify-center gap-2 text-on-surface-20">
            <div className="flex items-center gap-2 text-on-surface-20">
              <Calendar className="h-[18px] w-[18px]" aria-hidden />
              <span className="text-on-surface-20" title="등록일">
                {dateStr}
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-20">
              <Eye className="h-[18px] w-[18px]" aria-hidden />
              <span className="text-on-surface-20" title="누적 조회수">
                {viewStr}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-2 text-on-surface-20">
            <div className="flex items-center gap-2 text-on-surface-20">
              <Heart className="h-[18px] w-[18px]" aria-hidden />
              <span className="text-on-surface-20" title="좋아요 수">
                {stat1Str}
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-20">
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
              <span className="text-on-surface-20" title="댓글 수">
                {stat2Str}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-start justify-start gap-2 pt-0">
          <button
            type="button"
            onClick={() => onCharacterSettings?.(character)}
            className="flex h-10 min-w-0 flex-1 cursor-pointer items-center rounded-md border border-border-10 bg-white px-3 text-sm font-medium text-on-surface-20 transition-colors hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">캐릭터 설정</span>
          </button>
        </div>
      </div>
    </div>
  );
}
