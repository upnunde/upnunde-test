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
  onDetailClick: (item: ImageResource) => void;
  onDeleteClick: (item: ImageResource) => void;
}

const IMAGE_CARD_SIZE: Record<"img1:1" | "img16:9" | "img9:16", string> = {
  "img1:1": "w-24 h-24",
  "img16:9": "w-24 aspect-[16/9] min-h-0",
  "img9:16": "w-[90px] h-[160px]",
};

export function ImageCard({
  item,
  slotType = "img16:9",
  registered = true,
  hovered: hoveredProp,
  error = false,
  showName = true,
  onDetailClick,
  onDeleteClick,
}: ImageCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    onDetailClick(item);
  };

  const sizeClass = IMAGE_CARD_SIZE[slotType];
  const imgClass = "w-full h-full object-cover";
  const showControls = hoveredProp === true;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && onDetailClick(item)}
      className={cn(
        "group inline-flex flex-col justify-start items-start gap-1 cursor-pointer",
        hoveredProp !== undefined && "pointer-events-auto"
      )}
      aria-label={`${item.name} 상세 보기`}
    >
      <div
        className={cn(
          sizeClass,
          "rounded-lg outline outline-1 outline-offset-[-1px] flex flex-col justify-center items-center gap-2 overflow-hidden relative",
          error
            ? "bg-error-error-container outline-error-on-error-container"
            : "bg-surface-disabled/0 outline-border-20 outline outline-1 outline-offset-[-1px]"
        )}
      >
        {registered && <img src={item.imageUrl} alt="" className={cn(sizeClass, imgClass)} />}
        {/* 호버 시 어두운 오버레이 */}
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
            className="w-8 h-8 rounded-full bg-surface-10 shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)] inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
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
            className="w-8 h-8 rounded-full bg-surface-10 shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)] inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
            aria-label="삭제"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(item);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showName && (
        <div className="self-stretch inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <span
            className={cn(
              "flex-1 text-[14px] font-normal font-['Pretendard_JP'] leading-5 truncate text-left justify-start",
              error ? "text-error-on-error-container" : "text-[rgba(22,22,22,1)]"
            )}
          >
            {item.name}
          </span>
        </div>
      )}
    </div>
  );
}
