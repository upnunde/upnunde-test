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
import { Badge } from "design-system/ui/badge";
import { Button } from "design-system/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import type { CharacterData } from "@/types/character";
import { formatSeriesDateOrRelative, formatSeriesViewCount } from "@/lib/formatSeries";
import { THUMBNAIL_DIM_OVERLAY_CLASS, DIM_OVERLAY_TEXT_CLASS } from "@/lib/thumbnail-styles";
import {
  WORKS_ITEM_CARD_CLASS,
  WORKS_ITEM_CARD_INNER_CLASS,
  WORKS_ITEM_META_ROW_CLASS,
  WORKS_ITEM_THUMBNAIL_CLASS,
  WORKS_ITEM_TITLE_GROUP_CLASS,
} from "@/lib/worksArea";
import { cn } from "design-system/utils";

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
    <Button
      type="button"
      variant="outline"
      shape="square"
      size="default"
      onClick={() => onCharacterSettings?.(character)}
      className="min-w-0 flex-1"
    >
      <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
        캐릭터 설정
      </span>
    </Button>
  );

  return (
    <div className={WORKS_ITEM_CARD_CLASS}>
      <div className={WORKS_ITEM_CARD_INNER_CLASS}>
        <div className={WORKS_ITEM_THUMBNAIL_CLASS}>
          {isDraft || !thumbnailUrl ? (
            <div className="flex h-full w-full items-center justify-center bg-secondary" aria-hidden>
              <span className="text-foreground-placeholder text-caption1_400">썸네일 없음</span>
            </div>
          ) : (
            <>
              <Image src={thumbnailUrl} alt="" fill sizes="112px" className="object-cover" />
              <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
              {(isPrivate || isBanned) && (
                <div className="absolute inset-0 flex items-center justify-center bg-dim-20">
                  <span className={cn("text-body2_700", DIM_OVERLAY_TEXT_CLASS)}>{isBanned ? "이용금지" : "비공개"}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
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
                <Badge variant="default" status="destructive" size="md" shape="square" className="max-w-full lg:max-w-[45%]">
                  <ICONS.alertCircle className="size-4 shrink-0" aria-hidden />
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
                  className="-mr-2 -mt-1 shrink-0"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {status === "PUBLIC" && (
                    <>
                      <DropdownMenuItem onSelect={() => onSetPrivate?.(character)}>
                        <Icon icon={ICONS.eyeOff} size="md" />
                        비공개
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(character)}>
                        <Icon icon={ICONS.trash2} size="md" />
                        삭제
                      </DropdownMenuItem>
                    </>
                  )}
                  {status === "PRIVATE" && (
                    <>
                      <DropdownMenuItem onSelect={() => onSetPublic?.(character)}>
                        <Icon icon={ICONS.eye} size="md" />
                        공개
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(character)}>
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
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(character)}>
                        <Icon icon={ICONS.trash2} size="md" />
                        삭제
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-1 flex min-w-0 w-full items-center gap-2 overflow-hidden text-body3_400">
            {sourceSeries ? (
              <>
                <span className="max-w-[45%] shrink-0 truncate text-foreground-placeholder">{sourceSeries.title}</span>
                <span
                  className="shrink-0 select-none text-caption1_400 text-border"
                  role="separator"
                  aria-hidden
                >
                  ㅣ
                </span>
              </>
            ) : null}
            <span className="min-w-0 flex-1 truncate text-foreground-placeholder">{tagline}</span>
          </div>

          <div className="hidden w-full flex-1 lg:block" aria-hidden />

          <div className={WORKS_ITEM_META_ROW_CLASS}>
            <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 text-foreground-muted">
              <div className="flex items-center gap-2 text-foreground-muted">
                <ICONS.calendar className="h-[18px] w-[18px]" aria-hidden />
                <span className="text-foreground-muted" title="등록일">
                  {dateStr}
                </span>
              </div>
              <div className="flex items-center gap-2 text-foreground-muted">
                <ICONS.eye className="h-[18px] w-[18px]" aria-hidden />
                <span className="text-foreground-muted" title="누적 조회수">
                  {viewStr}
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-2 text-foreground-muted">
              <div className="flex items-center gap-2 text-foreground-muted">
                <ICONS.heart className="h-[18px] w-[18px]" aria-hidden />
                <span className="text-foreground-muted" title="좋아요 수">
                  {stat1Str}
                </span>
              </div>
              <div className="flex items-center gap-2 text-foreground-muted">
                <ICONS.messageCircle className="h-[18px] w-[18px]" aria-hidden />
                <span className="text-foreground-muted" title="댓글 수">
                  {stat2Str}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden w-full items-start justify-start gap-2 lg:flex">
            {settingsButton}
          </div>
        </div>
      </div>

      <div className="flex w-full items-start justify-start gap-2 lg:hidden">
        {settingsButton}
      </div>
    </div>
  );
}
