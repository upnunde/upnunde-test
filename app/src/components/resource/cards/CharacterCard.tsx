"use client";

import React from "react";
import Image from "next/image";
import type { CharacterResource } from "@/types/resource";
import { ResourceThumbnailActions } from "@/components/resource/cards/ResourceThumbnailActions";
import { RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS, THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";
import { cn } from "@/lib/utils";

/** [정책 2] 등장인물 전용 카드. 3인 버튼 형태(호버 시 편집/삭제 버튼). [정책 3] 클릭 시 상세 페이지 이동. */
export interface CharacterCardProps {
  character: CharacterResource;
  /** 호버 시 오버레이+버튼 강제 표시(데모·스토리용) */
  hovered?: boolean;
  /** 오류 상태 시 빨간 배경/테두리 */
  error?: boolean;
  /** 하단 이름 라벨 표시 여부 */
  showName?: boolean;
  onDetailClick: (character: CharacterResource) => void;
  onDeleteClick: (character: CharacterResource) => void;
  /** 썸네일 클릭 시 크게 보기(라이트박스). 있으면 카드 클릭 시 이걸 호출 */
  onPreviewClick?: (character: CharacterResource) => void;
}

export function CharacterCard({
  character,
  hovered: hoveredProp,
  error = false,
  showName = true,
  onDetailClick,
  onDeleteClick,
  onPreviewClick,
}: CharacterCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    if (onPreviewClick) onPreviewClick(character);
    else onDetailClick(character);
  };

  const showControls = hoveredProp === true;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && (onPreviewClick ? onPreviewClick(character) : handleCardClick(e as unknown as React.MouseEvent))}
      className="group flex w-full min-w-0 cursor-pointer flex-col items-start justify-start gap-my-4"
      aria-label={`${character.name} 상세 보기`}
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-my-8 overflow-hidden rounded-lg outline outline-1 outline-offset-[-1px]",
          RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS,
          error
            ? "bg-error-error-container outline-error-on-error-container"
            : "bg-surface-disabled/0 outline-border-20",
        )}
      >
        <Image
          src={character.imageUrl}
          alt=""
          fill
          sizes="(max-width: 1023px) 25vw, 90px"
          className="object-cover object-top"
        />
        <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
        <ResourceThumbnailActions
          forceVisible={showControls}
          elevated
          onEdit={() => onDetailClick(character)}
          onDelete={() => onDeleteClick(character)}
        />
      </div>
      {showName && (
        <div className="self-stretch inline-flex justify-start items-center gap-my-8 overflow-hidden">
          <span
            className={cn(
              "flex-1 text-body4_400 font-['Pretendard_JP'] truncate",
              error ? "text-error-on-error-container" : "text-on-surface-10"
            )}
          >
            {character.name}
          </span>
        </div>
      )}
    </div>
  );
}
