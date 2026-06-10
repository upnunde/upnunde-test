"use client";

import React from "react";
import { Plus } from "lucide-react";
import type { MediaSlotType } from "@/types/resource";
import { THUMBNAIL_SLOT_ARIA } from "@/lib/thumbnail-styles";
import { cn } from "@/lib/utils";

/** [정책 5] 리소스 그리드 마지막 요소(신규 등록) 또는 썸네일·이미지 추가 슬롯 */
export interface AddResourceSlotProps {
  onClick?: () => void;
  /** 지정 시 label+htmlFor로 숨김 file input과 직접 연결 (모달 등에서 OS 이미지 선택창 안정 동작) */
  fileInputId?: string;
  /** 등장인물: 9:16(90×160) / img1:1: 120×120 정사각형 / img16:9: 가로 / img9:16: 세로 / mov: 세로+재생시간 */
  variant?: "character" | MediaSlotType;
  /** 오류 상태(및 실패 플레이스홀더) 시 빨간 배경/테두리 */
  error?: boolean;
  /** 하단에 "name" 라벨 표시 여부 */
  showName?: boolean;
  /**
   * - `new-resource`: 그리드 신규 등록(기본 aria "새로 추가")
   * - `thumbnail`: 이미지·썸네일 추가 슬롯(기본 aria "이미지 추가")
   */
  slotKind?: "new-resource" | "thumbnail";
  /** 버튼 aria-label (`slotKind` 기본값보다 우선) */
  ariaLabel?: string;
}

const SLOT_SIZE_CLASS: Record<"character" | MediaSlotType, string> = {
  character: "w-[90px] h-[160px]",
  "img1:1": "w-[120px] h-[120px]",
  "img16:9": "w-24 aspect-[16/9] min-h-0",
  "img9:16": "w-[90px] h-[160px]",
  mov: "w-[90px] h-[160px]",
};

export function AddResourceSlot({
  onClick,
  fileInputId,
  variant = "mov",
  error = false,
  showName = false,
  slotKind = "new-resource",
  ariaLabel,
}: AddResourceSlotProps) {
  const resolvedAriaLabel =
    ariaLabel ??
    (slotKind === "thumbnail" ? THUMBNAIL_SLOT_ARIA.addImage : "새로 추가");
  const sizeClass = SLOT_SIZE_CLASS[variant === "character" ? "character" : variant];
  const slotClassName = cn(
    "rounded-lg flex flex-col justify-center items-center gap-my-8 overflow-hidden transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    sizeClass,
    error
      ? "bg-error-error-container text-error-on-error-container hover:bg-error-error-container/90"
      : "border border-dashed border-border-20 bg-white text-muted-foreground hover:border-border-10 hover:bg-surface-20",
  );
  const plusIcon = (
    <span className="w-5 h-5 flex items-center justify-center">
      <Plus className="w-5 h-5 shrink-0" aria-hidden />
    </span>
  );

  return (
    <div className="inline-flex flex-col justify-start items-start gap-my-4">
      {fileInputId ? (
        <label htmlFor={fileInputId} className={slotClassName} aria-label={resolvedAriaLabel}>
          {plusIcon}
        </label>
      ) : (
        <button type="button" onClick={onClick} className={slotClassName} aria-label={resolvedAriaLabel}>
          {plusIcon}
        </button>
      )}
      {showName && (
        <div className="self-stretch inline-flex justify-start items-center gap-my-8 overflow-hidden">
          <span
            className={cn(
              "flex-1 text-body1_400 font-['Pretendard_JP'] truncate",
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
