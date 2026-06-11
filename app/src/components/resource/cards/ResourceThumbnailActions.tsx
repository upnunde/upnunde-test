"use client";

import React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { thumbnailHoverRevealClass } from "@/lib/thumbnail-styles";
import { cn } from "@/lib/utils";

export interface ResourceThumbnailActionsProps {
  /** 스토리·데모용 — PC에서 hover 없이 항상 표시 */
  forceVisible?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  editAriaLabel?: string;
  deleteAriaLabel?: string;
  /** CharacterCard 등 — 데스크톱 버튼 elevation */
  elevated?: boolean;
}

const DESKTOP_ACTION_BUTTON_CLASS =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-10 text-on-surface-10 hover:bg-surface-20";

/** PC: hover 시 편집·삭제 / 모바일: ⋮ 오버플로 (Pinterest형 그리드) */
export function ResourceThumbnailActions({
  forceVisible = false,
  onEdit,
  onDelete,
  editAriaLabel = "상세 페이지에서 편집",
  deleteAriaLabel = "삭제",
  elevated = false,
}: ResourceThumbnailActionsProps) {
  const desktopButtonClass = cn(DESKTOP_ACTION_BUTTON_CLASS, elevated && "shadow-elevation-20");
  const revealClass = thumbnailHoverRevealClass(forceVisible);

  const stopBubble = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 hidden bg-black/10 lg:block",
          revealClass,
        )}
        aria-hidden
      />
      <div
        className={cn(
          "absolute right-1 top-1 z-[2] hidden flex-col items-start justify-center gap-my-4 lg:flex",
          revealClass,
        )}
      >
        <button
          type="button"
          className={desktopButtonClass}
          aria-label={editAriaLabel}
          onClick={(e) => {
            stopBubble(e);
            onEdit();
          }}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={desktopButtonClass}
          aria-label={deleteAriaLabel}
          onClick={(e) => {
            stopBubble(e);
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute right-1 top-1 z-[2] lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-[2px] transition-colors active:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              aria-label="작업 더보기"
              onClick={stopBubble}
              onPointerDown={stopBubble}
            >
              <MoreVertical className="h-4 w-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-lg border border-border-10 bg-white p-my-4"
            onClick={stopBubble}
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-20 outline-none focus:bg-surface-20"
              onSelect={() => onEdit()}
            >
              <Pencil className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
              편집
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-destructive outline-none focus:bg-surface-20"
              onSelect={() => onDelete()}
            >
              <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
