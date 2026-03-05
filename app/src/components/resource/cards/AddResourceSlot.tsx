"use client";

import React from "react";
import { Plus } from "lucide-react";
import type { MediaSlotType } from "@/types/resource";
import { cn } from "@/lib/utils";

/** [정책 5] 각 카테고리 그리드 마지막 요소. + 클릭 시 신규 등록 페이지로 라우팅. */
export interface AddResourceSlotProps {
  onClick: () => void;
  /** 등장인물: w-28 h-28 / img1:1: 120×120 정사각형 / img16:9: 가로 / img9:16: 세로 / mov: 세로+재생시간 */
  variant?: "character" | MediaSlotType;
  /** 오류 상태(및 실패 플레이스홀더) 시 빨간 배경/테두리 */
  error?: boolean;
  /** 하단에 "name" 라벨 표시 여부 */
  showName?: boolean;
  /** 버튼 aria-label (기본: "새로 추가") */
  ariaLabel?: string;
}

const SLOT_SIZE_CLASS: Record<"character" | MediaSlotType, string> = {
  character: "w-28 h-28",
  "img1:1": "w-[120px] h-[120px]",
  "img16:9": "w-24 aspect-[16/9] min-h-0",
  "img9:16": "w-[90px] h-[160px]",
  mov: "w-[90px] h-[160px]",
};

export function AddResourceSlot({
  onClick,
  variant = "mov",
  error = false,
  showName = false,
  ariaLabel = "새로 추가",
}: AddResourceSlotProps) {
  const sizeClass = SLOT_SIZE_CLASS[variant === "character" ? "character" : variant];

  return (
    <div className="inline-flex flex-col justify-start items-start gap-1">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "rounded-lg flex flex-col justify-center items-center gap-2 overflow-hidden transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          sizeClass,
          error
            ? "bg-error-error-container text-error-on-error-container hover:bg-error-error-container/90"
            : "border border-dashed border-border-20 bg-white text-muted-foreground hover:border-border-10 hover:bg-white"
        )}
        aria-label={ariaLabel}
      >
        <span className="w-5 h-5 flex items-center justify-center">
          <Plus className="w-5 h-5 shrink-0" aria-hidden />
        </span>
      </button>
      {showName && (
        <div className="self-stretch inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <span
            className={cn(
              "flex-1 text-base font-normal font-['Pretendard_JP'] leading-5 truncate",
              error ? "text-error-on-error-container" : "text-muted-foreground"
            )}
          >
            name
          </span>
        </div>
      )}
    </div>
  );
}
