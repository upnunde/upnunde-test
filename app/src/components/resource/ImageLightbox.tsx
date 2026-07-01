"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/icons";
import { isDummyResourceUrl } from "@/lib/dummy-asset-path";
import {
  IMAGE_LIGHTBOX_CHECKERBOARD_STYLE,
  IMAGE_LIGHTBOX_FRAME_CLASS,
  IMAGE_LIGHTBOX_IMAGE_SIZES,
} from "@/lib/thumbnail-styles";
import { cn } from "design-system/utils";

export interface ImageLightboxItem {
  id: string;
  imageUrl: string;
  name?: string;
}

export interface ImageLightboxProps {
  open: boolean;
  onClose: () => void;
  items: ImageLightboxItem[];
  initialIndex?: number;
  className?: string;
}

const IMAGE_LIGHTBOX_CONTROL_BUTTON_CLASS =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full sm:h-14 sm:w-14 bg-background shadow-elevation-20 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function ImageLightbox({
  open,
  onClose,
  items,
  initialIndex = 0,
  className,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  /** open / initialIndex / items 길이 변경 시 인덱스를 다시 정렬 — effect 대신 render-during-set 패턴 */
  const [snapshot, setSnapshot] = useState({ open, initialIndex, length: items.length });
  if (
    snapshot.open !== open ||
    snapshot.initialIndex !== initialIndex ||
    snapshot.length !== items.length
  ) {
    setSnapshot({ open, initialIndex, length: items.length });
    setIndex(Math.min(Math.max(0, initialIndex), Math.max(0, items.length - 1)));
  }

  const item = items[index];
  const hasMultiple = items.length > 1;
  const canPrev = hasMultiple && index > 0;
  const canNext = hasMultiple && index < items.length - 1;

  const goPrev = useCallback(() => {
    if (canPrev) setIndex((i) => i - 1);
  }, [canPrev]);

  const goNext = useCallback(() => {
    if (canNext) setIndex((i) => i + 1);
  }, [canNext]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, goPrev, goNext]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-sticky flex items-center justify-center overflow-y-auto p-4",
        "bg-dim-20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 크게 보기"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex w-full max-w-[512px] max-h-[min(92dvh,716px)] flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex w-full items-center justify-center px-3 sm:px-14">
          <div className={IMAGE_LIGHTBOX_FRAME_CLASS} style={IMAGE_LIGHTBOX_CHECKERBOARD_STYLE}>
            {item && (
              <Image
                src={item.imageUrl}
                alt={item.name ?? "미리보기"}
                fill
                unoptimized={isDummyResourceUrl(item.imageUrl)}
                sizes={IMAGE_LIGHTBOX_IMAGE_SIZES}
                className="object-cover object-center"
              />
            )}
          </div>

          {/* 왼쪽 이전 버튼 */}
          {hasMultiple && (
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className={cn(
                "absolute left-0 top-1/2 z-dropdown -translate-y-1/2",
                IMAGE_LIGHTBOX_CONTROL_BUTTON_CLASS,
                "disabled:pointer-events-none disabled:opacity-40",
              )}
              aria-label="이전 이미지"
            >
              <ICONS.chevronLeft className="h-5 w-5 text-foreground sm:h-6 sm:w-6" strokeWidth={2} />
            </button>
          )}

          {/* 오른쪽 다음 버튼 */}
          {hasMultiple && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={cn(
                "absolute right-0 top-1/2 z-dropdown -translate-y-1/2",
                IMAGE_LIGHTBOX_CONTROL_BUTTON_CLASS,
                "disabled:pointer-events-none disabled:opacity-40",
              )}
              aria-label="다음 이미지"
            >
              <ICONS.chevronRight className="h-5 w-5 text-foreground sm:h-6 sm:w-6" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* 닫기 버튼 (하단 중앙) */}
        <button
          type="button"
          onClick={onClose}
          className={cn("shrink-0", IMAGE_LIGHTBOX_CONTROL_BUTTON_CLASS)}
          aria-label="닫기"
        >
          <ICONS.close className="h-5 w-5 text-foreground sm:h-6 sm:w-6" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
