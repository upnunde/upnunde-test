"use client";

import React from "react";
import Image from "next/image";
import type { ImageResource, MediaSlotType } from "@/types/resource";
import { ResourceThumbnailActions } from "@/components/resource/cards/ResourceThumbnailActions";
import {
  RESOURCE_THUMBNAIL_FIXED_9_16_CLASS,
  RESOURCE_THUMBNAIL_FIXED_IMAGE_SIZES,
  RESOURCE_THUMBNAIL_FLUID_IMAGE_SIZES,
  RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS,
  THUMBNAIL_DIM_OVERLAY_CLASS,
} from "@/lib/thumbnail-styles";
import { cn } from "@/lib/utils";

/** [정책 6, 7] 배경/연출장면/갤러리용 이미지 카드. 클릭 시 상세 페이지, 삭제 시 확인 팝업. */
export interface ImageCardProps {
  item: ImageResource;
  /** img1:1 정사각형, img16:9 가로 비율, img9:16 세로 비율 */
  slotType?: Extract<MediaSlotType, "img1:1" | "img16:9" | "img9:16">;
  /** 등록된 콘텐츠 있음(이미지 표시). false면 빈 슬롯처럼 보이지 않음, item 기준으로 동작 */
  registered?: boolean;
  /** 호버 시 오버레이+편집/삭제 버튼 강제 표시(데모·스토리용) */
  hovered?: boolean;
  /** 오류 상태 시 빨간 배경/테두리 */
  error?: boolean;
  /** 하단 이름 라벨 표시 여부 */
  showName?: boolean;
  /** hover 액션(오버레이 + 편집/삭제 버튼) 표시 여부 */
  showActions?: boolean;
  /** 선택 상태일 때 primary 아웃라인 강조 */
  selected?: boolean;
  /** 외곽 래퍼 커스텀 클래스 (폭/레이아웃 오버라이드) */
  containerClassName?: string;
  /** 썸네일 프레임 커스텀 클래스 */
  frameClassName?: string;
  /** 실제 이미지 커스텀 클래스 */
  imageClassName?: string;
  onDetailClick: (item: ImageResource) => void;
  onDeleteClick: (item: ImageResource) => void;
  /** 썸네일 클릭 시 크게 보기(라이트박스). 있으면 카드 클릭 시 이걸 호출하고, 없으면 onDetailClick 호출 */
  onPreviewClick?: (item: ImageResource) => void;
  /** 리소스 관리 그리드에서만 true — 셀 너비에 맞춰 9:16 확장 */
  fluid?: boolean;
}

const IMAGE_CARD_SIZE: Record<"img1:1" | "img16:9" | "img9:16", string> = {
  "img1:1": "w-24 h-24",
  "img16:9": "w-24 aspect-[16/9] min-h-0",
  "img9:16": RESOURCE_THUMBNAIL_FIXED_9_16_CLASS,
};

const IMAGE_CARD_WIDTH: Record<"img1:1" | "img16:9" | "img9:16", string> = {
  "img1:1": "w-24",
  "img16:9": "w-24",
  "img9:16": "w-[90px]",
};

export function ImageCard({
  item,
  slotType = "img16:9",
  registered = true,
  hovered: hoveredProp,
  error = false,
  showName = true,
  showActions = true,
  selected = false,
  containerClassName,
  frameClassName,
  imageClassName,
  onDetailClick,
  onDeleteClick,
  onPreviewClick,
  fluid = false,
}: ImageCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    if (onPreviewClick) onPreviewClick(item);
    else onDetailClick(item);
  };

  const sizeClass =
    fluid && slotType === "img9:16"
      ? RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS
      : IMAGE_CARD_SIZE[slotType];
  const widthClass =
    fluid && slotType === "img9:16" ? "w-full min-w-0" : IMAGE_CARD_WIDTH[slotType];
  const imageSizes =
    slotType === "img9:16"
      ? fluid
        ? RESOURCE_THUMBNAIL_FLUID_IMAGE_SIZES
        : RESOURCE_THUMBNAIL_FIXED_IMAGE_SIZES
      : "96px";
  const imgClass = "w-full h-full object-cover";
  const showControls = showActions && hoveredProp === true;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && (onPreviewClick ? onPreviewClick(item) : onDetailClick(item))}
      className={cn(
        "group flex cursor-pointer flex-col items-start justify-start gap-my-4",
        widthClass,
        hoveredProp !== undefined && "pointer-events-auto",
        containerClassName
      )}
      aria-label={`${item.name} 상세 보기`}
    >
      <div
        className={cn(
          sizeClass,
          "rounded-lg outline outline-1 outline-offset-[-1px] flex flex-col justify-center items-center gap-my-8 overflow-hidden relative",
          error
            ? "bg-error-error-container outline-error-on-error-container"
            : "bg-surface-disabled/0 outline-border-20 outline outline-1 outline-offset-[-1px]",
          selected && !error && "outline-2 outline-offset-[-2px] outline-primary",
          frameClassName
        )}
      >
        {registered && (
          <>
            <Image
              src={item.imageUrl}
              alt=""
              fill
              sizes={imageSizes}
              className={cn(imgClass, imageClassName)}
            />
            <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
          </>
        )}
        {/* 호버 시 어두운 오버레이 */}
        {showActions && (
          <ResourceThumbnailActions
            forceVisible={showControls}
            onEdit={() => onDetailClick(item)}
            onDelete={() => onDeleteClick(item)}
          />
        )}
      </div>
      {showName && (
        <div className="self-stretch inline-flex justify-start items-center gap-my-8 overflow-hidden">
          <span
            className={cn(
              "flex-1 text-body4_400 font-['Pretendard_JP'] truncate text-left justify-start",
              error ? "text-error-on-error-container" : "text-on-surface-10"
            )}
          >
            {item.name}
          </span>
        </div>
      )}
    </div>
  );
}
