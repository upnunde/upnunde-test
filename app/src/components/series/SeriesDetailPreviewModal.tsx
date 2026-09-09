"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "design-system/ui/button";
import { WorksStatusBadge } from "@/components/works/WorksStatusBadge";
import { ICONS, Icon } from "@/lib/icons";
import { formatSeriesDateOrRelative, formatSeriesViewCount } from "@/lib/formatSeries";
import { isDummyResourceUrl } from "@/lib/dummy-asset-path";
import {
  DESKTOP_MODAL_RADIUS_CLASS,
  MOBILE_MODAL_TOP_RADIUS_CLASS,
} from "@/components/ui/modal/modal-styles";
import { useSeriesCatalogStore } from "@/store/useSeriesCatalogStore";
import type { SeriesData, SeriesFormRecord } from "@/types/series";
import { cn } from "design-system/utils";

/** 상세 시트 데모용 크리에이터 핸들 — 실제 계정 연동 전 고정 */
const DEMO_CREATOR_HANDLE = "@악어이빨닦기";

export interface SeriesDetailPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  series: SeriesData | null;
  onOpenEpisodes?: (series: SeriesData) => void;
  onOpenResources?: (series: SeriesData) => void;
  onContinueEdit?: (series: SeriesData) => void;
}

function toPreviewRecord(series: SeriesData, detail?: SeriesFormRecord): {
  title: string;
  summary: string;
  keywords: string[];
  coverImageUrl: string;
  episodeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  status: SeriesData["status"];
} {
  return {
    title: detail?.title || series.title,
    summary: detail?.summary?.trim() || "등록된 소개가 없어요.",
    keywords: detail?.keywords?.length ? detail.keywords : [],
    coverImageUrl: detail?.coverImageUrl || series.thumbnailUrl || "",
    episodeCount: detail?.episodeCount ?? series.episodeCount,
    viewCount: detail?.viewCount ?? series.viewCount,
    commentCount: detail?.commentCount ?? series.commentCount,
    createdAt: detail?.createdAt || series.createdAt,
    status: detail?.status || series.status,
  };
}

/**
 * 내 작품 시리즈 — 독자 노출형 상세 시트.
 * DRAFT: 이어서 생성하기 / 그 외: 에피소드 관리(+ 리소스 관리).
 */
export function SeriesDetailPreviewModal({
  open,
  onOpenChange,
  series,
  onOpenEpisodes,
  onOpenResources,
  onContinueEdit,
}: SeriesDetailPreviewModalProps) {
  const getSeries = useSeriesCatalogStore((s) => s.getSeries);
  const detail = series ? getSeries(series.id) : undefined;
  const preview = series ? toPreviewRecord(series, detail) : null;

  if (!series || !preview) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sr-only">
          <DialogTitle>시리즈 정보</DialogTitle>
        </DialogContent>
      </Dialog>
    );
  }

  const imageUrl = preview.coverImageUrl;
  const viewCount = formatSeriesViewCount(preview.viewCount);
  const commentCount = formatSeriesViewCount(preview.commentCount);
  const episodeLabel =
    preview.episodeCount === 0 ? "에피소드 없음" : `${preview.episodeCount}회`;
  const dateStr = formatSeriesDateOrRelative(preview.createdAt);
  const keywords = preview.keywords.slice(0, 4);
  const isDraft = preview.status === "DRAFT";

  const closeThen = (fn?: (s: SeriesData) => void) => {
    onOpenChange(false);
    fn?.(series);
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
            시리즈 정보
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
                unoptimized={
                  isDummyResourceUrl(imageUrl) ||
                  imageUrl.startsWith("data:") ||
                  imageUrl.startsWith("blob:")
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-body3_400 text-foreground-placeholder">
                이미지 없음
              </div>
            )}
            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-dim-40 px-2.5 py-1 text-caption1_500 text-inverse-foreground backdrop-blur-sm">
              <Icon icon={ICONS.eye} size="md" className="size-3.5" />
              <span>{viewCount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 py-4">
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <WorksStatusBadge status={preview.status} />
              </div>
              <h3 className="truncate text-heading4_700 text-foreground">{preview.title}</h3>
              <p className="mt-1 text-body3_400 text-foreground-placeholder">{DEMO_CREATOR_HANDLE}</p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-background-muted px-2 py-1 text-caption1_500 text-foreground-muted">
                <Icon icon={ICONS.layers} size="md" className="size-3.5" />
                {episodeLabel}
              </span>
              {keywords.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-sm border border-border bg-background-muted px-2 py-1 text-caption1_500 text-foreground-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-body3_400 text-foreground-muted">{preview.summary}</p>

            <div className="flex flex-wrap items-center gap-4 text-foreground-muted">
              <span className="inline-flex items-center gap-1.5 text-caption1_400" title="등록일">
                <Icon icon={ICONS.calendar} size="md" />
                {dateStr}
              </span>
              <span className="inline-flex items-center gap-1.5 text-caption1_400" title="댓글">
                <Icon icon={ICONS.messageCircle} size="md" />
                {commentCount}
              </span>
              <span className="inline-flex items-center gap-1.5 text-caption1_400" title="조회">
                <Icon icon={ICONS.eye} size="md" />
                {viewCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-divider px-5 py-4">
          {isDraft ? (
            <Button
              type="button"
              variant="default"
              tone="neutral"
              shape="square"
              size="xl"
              className="h-11 w-full"
              onClick={() => closeThen(onContinueEdit)}
            >
              이어서 생성하기
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="default"
                tone="neutral"
                shape="square"
                size="xl"
                className="h-11 w-full"
                onClick={() => closeThen(onOpenEpisodes)}
              >
                에피소드 관리
              </Button>
              <Button
                type="button"
                variant="outline"
                shape="square"
                size="xl"
                className="h-11 w-full"
                onClick={() => closeThen(onOpenResources)}
              >
                리소스 관리
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
