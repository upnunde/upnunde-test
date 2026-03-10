"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { MediaResource } from "@/types/resource";
import { cn } from "@/lib/utils";

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
}

export function MediaCard({
  item,
  hovered: hoveredProp,
  error = false,
  showName = true,
  onDetailClick,
  onDeleteClick,
  onPreviewClick,
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
      className="group inline-flex flex-col justify-start items-start gap-1 cursor-pointer"
      aria-label={`${item.name} 상세 보기`}
    >
      <div
        className={cn(
          "w-[90px] h-[160px] relative rounded-lg outline outline-1 outline-offset-[-1px] flex flex-col justify-center items-center gap-2 overflow-hidden",
          error
            ? "bg-error-error-container outline-error-on-error-container"
            : "bg-surface-disabled/0 outline-border-20"
        )}
      >
        <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        <div className="w-full h-6 left-0 bottom-0 absolute inline-flex justify-center items-center pointer-events-none bg-black/40">
          <span className="text-center text-white text-xs font-bold font-['Pretendard_JP'] leading-4">
            {item.duration}
          </span>
        </div>
        <div
          className={cn(
            "absolute inset-0 w-full h-full bg-black/10 transition-opacity pointer-events-none",
            showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          aria-hidden
        />
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
      </div>
      {showName && (
        <div className="self-stretch inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <span
            className={cn(
              "flex-1 text-[14px] font-normal font-['Pretendard_JP'] leading-5 truncate",
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
