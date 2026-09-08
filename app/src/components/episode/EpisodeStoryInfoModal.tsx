"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "design-system/ui/button";
import { ICONS, Icon } from "@/lib/icons";
import { formatViews } from "@/lib/formatEpisode";
import { isDummyResourceUrl } from "@/lib/dummy-asset-path";
import {
  DESKTOP_MODAL_RADIUS_CLASS,
  MOBILE_MODAL_TOP_RADIUS_CLASS,
} from "@/components/ui/modal/modal-styles";
import type { Episode } from "@/types/episode";
import { cn } from "design-system/utils";

/** 스토리 정보 시트 데모용 — 실제 시리즈/계정 연동 전 고정 */
const DEMO_CREATOR_NAME = "악어이빨닦기";
const DEMO_STORY_TAGS = ["기본", "남성향", "시뮬레이션", "무협"] as const;
const DEMO_IMAGE_COUNT = 16;
const DEMO_SUMMARY = "무림고수가 상대를 찾지 못해 방구석에서 게임만하는데..";
const DEMO_DESCRIPTION = [
  "어느 날, 아이오니아의 산속에서 수행 중인 승려 리신을 만난다. 그는 한때 오만함으로 인해 큰 실수를 저질렀고, 그 죄책감을 갚기 위해 속죄의 길을 걷고 있다.",
  "플레이어는 그의 도장에 찾아와 수련을 청하며, 리신과 함께 내면의 갈등과 외부의 위협에 맞서게 된다.",
  "호쾌한 액션과 성장, 그리고 사제 간의 유대가 교차하는 무협 시뮬레이션이다.",
] as const;

export interface EpisodeStoryInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  episode: Episode | null;
  /** 시리즈 제목 — 없으면 에피소드 제목만 표시 */
  seriesTitle?: string;
  onPreview?: (episode: Episode) => void;
}

/**
 * 에피소드 목록 행 클릭 — 독자 노출형 스토리 정보 시트.
 * 「미리보기」로 기존 폰 목업(EpisodePreviewModal)과 동일 화면으로 이어진다.
 */
export function EpisodeStoryInfoModal({
  open,
  onOpenChange,
  episode,
  seriesTitle,
  onPreview,
}: EpisodeStoryInfoModalProps) {
  if (!episode) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sr-only">
          <DialogTitle>스토리 정보</DialogTitle>
        </DialogContent>
      </Dialog>
    );
  }

  const displayTitle = seriesTitle?.trim() || episode.title;
  const viewsLabel = episode.status === "DRAFT" ? "0" : formatViews(episode.views);

  const handlePreview = () => {
    onOpenChange(false);
    onPreview?.(episode);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex w-full max-h-[min(92dvh,860px)] min-h-0 flex-col gap-0 overflow-hidden border border-border bg-background p-0",
          "max-lg:max-w-none max-lg:rounded-b-none",
          MOBILE_MODAL_TOP_RADIUS_CLASS,
          DESKTOP_MODAL_RADIUS_CLASS,
          "lg:w-[min(92vw,560px)] lg:max-w-[560px]",
        )}
      >
        <div className="flex shrink-0 items-center gap-3 px-5 py-3">
          <DialogTitle className="w-auto min-w-0 flex-1 truncate text-left text-heading5_700 text-foreground">
            스토리 정보
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
          <div className="flex gap-4 px-5 pb-4">
            <div className="relative aspect-[3/4] w-[120px] shrink-0 overflow-hidden rounded-md border border-border bg-background-muted sm:w-[140px]">
              <Image
                src={episode.thumbnail}
                alt=""
                fill
                sizes="140px"
                className="object-cover object-top"
                unoptimized={isDummyResourceUrl(episode.thumbnail)}
                priority
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-heading4_700 text-foreground">{displayTitle}</h3>
                <p className="mt-1 text-body3_400 text-foreground-placeholder">{DEMO_CREATOR_NAME}</p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-background-muted px-2 py-1 text-caption1_500 text-foreground-muted">
                  <Icon icon={ICONS.image} size="md" className="size-3.5" />
                  이미지 {DEMO_IMAGE_COUNT}장
                </span>
                {DEMO_STORY_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-sm border border-border bg-background-muted px-2 py-1 text-caption1_500 text-foreground-muted"
                  >
                    {tag === "기본" ? (
                      <Icon icon={ICONS.sparkles} size="md" className="size-3.5" />
                    ) : null}
                    {tag}
                  </span>
                ))}
              </div>

              <p className="line-clamp-2 text-body3_400 text-foreground-muted">{DEMO_SUMMARY}</p>

              <div className="mt-auto flex items-center gap-4 text-foreground-muted">
                <span className="inline-flex items-center gap-1.5 text-caption1_400" title="조회">
                  <Icon icon={ICONS.eye} size="md" />
                  {viewsLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 text-caption1_400" title="좋아요">
                  <Icon icon={ICONS.heart} size="md" />
                  0
                </span>
                <span className="inline-flex items-center gap-1.5 text-caption1_400" title="댓글">
                  <Icon icon={ICONS.messageCircle} size="md" />
                  0
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-divider px-5 py-4">
            <h4 className="text-body2_700 text-foreground">상세 설명</h4>
            <div className="mt-3 space-y-3 text-body3_400 text-foreground-muted">
              {DEMO_DESCRIPTION.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-4 text-caption1_400 text-foreground-placeholder">
              {episode.episodeNumber}화 · {episode.title}
            </p>
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
            onClick={handlePreview}
          >
            미리보기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
