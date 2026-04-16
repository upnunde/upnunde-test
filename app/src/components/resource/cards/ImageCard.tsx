"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { ImageResource, MediaSlotType } from "@/types/resource";
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
}

const IMAGE_CARD_SIZE: Record<"img1:1" | "img16:9" | "img9:16", string> = {
  "img1:1": "w-24 h-24",
  "img16:9": "w-24 aspect-[16/9] min-h-0",
  "img9:16": "w-[90px] h-[160px]",
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
}: ImageCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    if (onPreviewClick) onPreviewClick(item);
    else onDetailClick(item);
  };

  const sizeClass = IMAGE_CARD_SIZE[slotType];
  const widthClass = IMAGE_CARD_WIDTH[slotType];
  const imgClass = "w-full h-full object-cover";
  const showControls = showActions && hoveredProp === true;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && (onPreviewClick ? onPreviewClick(item) : onDetailClick(item))}
      className={cn(
        "group inline-flex flex-col justify-start items-start gap-1 cursor-pointer",
        widthClass,
        hoveredProp !== undefined && "pointer-events-auto",
        containerClassName
      )}
      aria-label={`${item.name} 상세 보기`}
    >
      <div
        className={cn(
          sizeClass,
          "rounded-lg outline outline-1 outline-offset-[-1px] flex flex-col justify-center items-center gap-2 overflow-hidden relative",
          error
            ? "bg-error-error-container outline-error-on-error-container"
            : "bg-surface-disabled/0 outline-border-20 outline outline-1 outline-offset-[-1px]",
          selected && !error && "outline-2 outline-offset-[-2px] outline-primary",
          frameClassName
        )}
      >
        {registered && (
          <img
            src={item.imageUrl}
            alt=""
            className={cn(sizeClass, imgClass, imageClassName)}
            loading="lazy"
            decoding="async"
          />
        )}
        {/* 호버 시 어두운 오버레이 */}
        {showActions && (
          <>
            <div
              className={cn(
                "absolute inset-0 w-full h-full bg-black/10 transition-opacity pointer-events-none",
                showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              aria-hidden
            />
            {/* 편집/삭제 버튼 */}
            <div
              className={cn(
                "absolute right-1 top-1 flex flex-col justify-center items-start gap-1 transition-opacity",
                showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              <button
                type="button"
                className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
                aria-label="상세 페이지에서 편집"
                onClick={(e) => {
                  e.stopPropagation();
                  onDetailClick(item);
                }}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
                aria-label="삭제"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(item);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
      {showName && (
        <div className="self-stretch inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <span
            className={cn(
              "flex-1 text-[13px] font-normal font-['Pretendard_JP'] leading-5 truncate text-left justify-start",
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
