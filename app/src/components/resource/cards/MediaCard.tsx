"use client";

import React from "react";
import Image from "next/image";
import type { MediaResource } from "@/types/resource";
import { ResourceThumbnailActions } from "@/components/resource/cards/ResourceThumbnailActions";
import {
  RESOURCE_THUMBNAIL_FIXED_9_16_CLASS,
  RESOURCE_THUMBNAIL_FIXED_IMAGE_SIZES,
  RESOURCE_THUMBNAIL_FLUID_IMAGE_SIZES,
  RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS,
  THUMBNAIL_DIM_OVERLAY_CLASS,
  THUMBNAIL_META_BAR_DIM_CLASS,
  DIM_OVERLAY_TEXT_CLASS,
} from "@/lib/thumbnail-styles";
import { isDummyResourceUrl } from "@/lib/dummy-asset-path";
import { cn } from "design-system/utils";

/** [정책 7] 미디어 카드. 썸네일 + 재생시간 표시. 클릭 시 상세 페이지, 삭제 시 확인 팝업. */
export interface MediaCardProps {
  item: MediaResource;
  /** 호버 시 오버레이+버튼 강제 표시(데모·스토리용) */
  hovered?: boolean;
  /** 오류 상태 시 빨간 배경/테두리 */
  error?: boolean;
  /** 하단 이름 라벨 표시 여부 */
  showName?: boolean;
  onDetailClick: (item: MediaResource) => void;
  onDeleteClick: (item: MediaResource) => void;
  /** 썸네일 클릭 시 크게 보기(라이트박스). 있으면 카드 클릭 시 이걸 호출 */
  onPreviewClick?: (item: MediaResource) => void;
  /** 리소스 관리 그리드에서만 true — 셀 너비에 맞춰 9:16 확장 */
  fluid?: boolean;
}

export function MediaCard({
  item,
  hovered: hoveredProp,
  error = false,
  showName = true,
  onDetailClick,
  onDeleteClick,
  onPreviewClick,
  fluid = false,
}: MediaCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    if (onPreviewClick) onPreviewClick(item);
    else onDetailClick(item);
  };

  const showControls = hoveredProp === true;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && (onPreviewClick ? onPreviewClick(item) : onDetailClick(item))}
      className={cn(
        "group flex cursor-pointer flex-col items-start justify-start gap-1",
        fluid ? "w-full min-w-0" : "w-[90px]",
      )}
      aria-label={`${item.name} 상세 보기`}
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-lg outline outline-1 outline-offset-[-1px]",
          fluid ? RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS : RESOURCE_THUMBNAIL_FIXED_9_16_CLASS,
          error
            ? "bg-destructive-container outline-on-destructive-container"
            : "bg-disabled/0 outline-border",
        )}
      >
        <Image
          src={item.thumbnailUrl}
          alt=""
          fill
          unoptimized={isDummyResourceUrl(item.thumbnailUrl)}
          sizes={fluid ? RESOURCE_THUMBNAIL_FLUID_IMAGE_SIZES : RESOURCE_THUMBNAIL_FIXED_IMAGE_SIZES}
          className="object-cover"
        />
        <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
        <div className={THUMBNAIL_META_BAR_DIM_CLASS}>
          <span className={cn("text-center text-caption1_700 font-['Pretendard_JP']", DIM_OVERLAY_TEXT_CLASS)}>
            {item.duration}
          </span>
        </div>
        <ResourceThumbnailActions
          forceVisible={showControls}
          onEdit={() => onDetailClick(item)}
          onDelete={() => onDeleteClick(item)}
        />
      </div>
      {showName && (
        <div className="self-stretch inline-flex justify-start items-center gap-2 overflow-hidden">
          <span
            className={cn(
              "flex-1 text-body4_400 font-['Pretendard_JP'] truncate",
              error ? "text-destructive-container-foreground" : "text-foreground"
            )}
          >
            {item.name}
          </span>
        </div>
      )}
    </div>
  );
}
