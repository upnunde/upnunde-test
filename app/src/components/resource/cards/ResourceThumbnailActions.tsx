"use client";

import React from "react";
import { ICONS, Icon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  thumbnailHoverDimOverlayClass,
  thumbnailHoverRevealClass,
} from "@/lib/thumbnail-styles";
import { cn } from "design-system/utils";

export interface ResourceThumbnailActionsProps {
  /** 스토리·데모용 — PC에서 hover 없이 항상 표시 */
  forceVisible?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  editAriaLabel?: string;
  deleteAriaLabel?: string;
}

/** PC: hover 시 편집·삭제 / 모바일: ⋮ 오버플로 (Pinterest형 그리드) */
export function ResourceThumbnailActions({
  forceVisible = false,
  onEdit,
  onDelete,
  editAriaLabel = "상세 페이지에서 편집",
  deleteAriaLabel = "삭제",
}: ResourceThumbnailActionsProps) {
  const stopBubble = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className={cn("hidden lg:block", thumbnailHoverDimOverlayClass(forceVisible))}
        aria-hidden
      />
      <div
        className={cn(
          "absolute right-1 top-1 z-dropdown hidden flex-col items-start justify-center gap-1 lg:flex",
          thumbnailHoverRevealClass(forceVisible),
        )}
      >
        <Button
          type="button"
          variant="secondary"
          shape="circle"
          size="icon"
          aria-label={editAriaLabel}
          onClick={(e) => {
            stopBubble(e);
            onEdit();
          }}
        >
          <Icon icon={ICONS.pencil} size="md" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          shape="circle"
          size="icon"
          aria-label={deleteAriaLabel}
          onClick={(e) => {
            stopBubble(e);
            onDelete();
          }}
        >
          <Icon icon={ICONS.trash2} size="md" />
        </Button>
      </div>

      <div className="absolute right-1 top-1 z-dropdown lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              shape="circle"
              size="icon-sm"
              aria-label="작업 더보기"
              onClick={stopBubble}
              onPointerDown={stopBubble}
            >
              <Icon icon={ICONS.moreVertical} size="sm" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={stopBubble}>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => onEdit()}>
                <Icon icon={ICONS.pencil} size="md" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => onDelete()}>
                <Icon icon={ICONS.trash2} size="md" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
