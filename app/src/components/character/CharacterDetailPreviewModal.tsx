"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "design-system/ui/button";
import { ICONS, Icon } from "@/lib/icons";
import { formatSeriesViewCount } from "@/lib/formatSeries";
import { characterDataToCharacterResource } from "@/lib/myWorksCharacterDetail";
import {
  DESKTOP_MODAL_RADIUS_CLASS,
  MOBILE_MODAL_TOP_RADIUS_CLASS,
} from "@/components/ui/modal/modal-styles";
import type { CharacterData } from "@/types/character";
import { cn } from "design-system/utils";

/** 상세 시트 데모용 크리에이터 핸들 — 실제 계정 연동 전 고정 */
const DEMO_CREATOR_HANDLE = "@악어이빨닦기";

export interface CharacterDetailPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: CharacterData | null;
  onStartChat?: (character: CharacterData) => void;
}

function parseTags(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,，#]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 4);
}

/**
 * 내 작품 캐릭터 — 독자 노출형 상세 시트.
 * 「대화하기」로 캐릭터 대화 풀페이지(`/series/character/[id]/chat`)로 이동한다.
 */
export function CharacterDetailPreviewModal({
  open,
  onOpenChange,
  character,
  onStartChat,
}: CharacterDetailPreviewModalProps) {
  const detail = useMemo(
    () => (character ? characterDataToCharacterResource(character) : null),
    [character],
  );

  if (!character || !detail) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sr-only">
          <DialogTitle>캐릭터 정보</DialogTitle>
        </DialogContent>
      </Dialog>
    );
  }

  const imageUrl = detail.imageUrl || character.thumbnailUrl || "";
  const imageCount = Math.max(detail.expressions?.length ?? 0, imageUrl ? 1 : 0);
  const tags = parseTags(detail.tags);
  const displayTags = tags.length > 0 ? tags : ["남성향", "무협"];
  const summary = detail.summary?.trim() || character.tagline;
  const likeCount = formatSeriesViewCount(character.stat1);
  const commentCount = formatSeriesViewCount(character.stat2);
  const viewCount = formatSeriesViewCount(character.viewCount);

  const handleChat = () => {
    onOpenChange(false);
    onStartChat?.(character);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex w-full max-h-[min(92dvh,860px)] min-h-0 flex-col gap-0 overflow-hidden border border-border bg-background p-0",
          "max-lg:max-w-none max-lg:rounded-b-none",
          MOBILE_MODAL_TOP_RADIUS_CLASS,
          DESKTOP_MODAL_RADIUS_CLASS,
          "lg:w-[min(92vw,420px)] lg:max-w-[420px]",
        )}
      >
        <div className="flex shrink-0 items-center gap-3 px-5 py-3">
          <DialogTitle className="w-auto min-w-0 flex-1 truncate text-left text-heading5_700 text-foreground">
            캐릭터 정보
          </DialogTitle>
          <IconButton
            type="button"
            variant="ghost"
            shape="circle"
            size="icon-sm"
            icon={ICONS.close}
            aria-label="닫기"
            className="-mr-2 shrink-0"
            onClick={() => onOpenChange(false)}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-background-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt=""
                fill
                sizes="420px"
                className="object-cover object-top"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-body3_400 text-foreground-placeholder">
                이미지 없음
              </div>
            )}
            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-dim-40 px-2.5 py-1 text-caption1_500 text-inverse-foreground backdrop-blur-sm">
              <Icon icon={ICONS.heart} size="md" className="size-3.5" />
              <span>{likeCount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 py-4">
            <div className="min-w-0">
              <h3 className="truncate text-heading4_700 text-foreground">{detail.name}</h3>
              <p className="mt-1 text-body3_400 text-foreground-placeholder">{DEMO_CREATOR_HANDLE}</p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-background-muted px-2 py-1 text-caption1_500 text-foreground-muted">
                <Icon icon={ICONS.image} size="md" className="size-3.5" />
                이미지 {imageCount}장
              </span>
              {displayTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-sm border border-border bg-background-muted px-2 py-1 text-caption1_500 text-foreground-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-body3_400 text-foreground-muted">{summary}</p>

            <div className="flex items-center gap-4 text-foreground-muted">
              <span className="inline-flex items-center gap-1.5 text-caption1_400" title="댓글">
                <Icon icon={ICONS.messageCircle} size="md" />
                {commentCount}
              </span>
              <span className="inline-flex items-center gap-1.5 text-caption1_400" title="좋아요">
                <Icon icon={ICONS.heart} size="md" />
                {likeCount}
              </span>
              <span className="inline-flex items-center gap-1.5 text-caption1_400" title="조회">
                <Icon icon={ICONS.eye} size="md" />
                {viewCount}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-divider px-5 py-4">
          <Button
            type="button"
            variant="default"
            tone="neutral"
            shape="square"
            size="xl"
            className="h-11 w-full"
            onClick={handleChat}
          >
            대화하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
