"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/icons";
import { IconButton } from "@/components/ui/icon-button";
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

const IMAGE_LIGHTBOX_CONTROL_BUTTON_CLASS = "shadow-elevation-20 sm:size-14";

/** DS Button active:translate-y-px 가 -translate-y-1/2 와 충돌해 튀는 현상 방지 */
const IMAGE_LIGHTBOX_NAV_BUTTON_CLASS =
  "absolute top-1/2 z-dropdown -translate-y-1/2 active:!-translate-y-1/2";

export function ImageLightbox({
  open,
  onClose,
  items,
  initialIndex = 0,
  className,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(Math.min(Math.max(0, initialIndex), Math.max(0, items.length - 1)));
  }, [open, initialIndex, items.length]);

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
            <IconButton
              type="button"
              variant="secondary"
              shape="circle"
              size="icon-xl"
              icon={ICONS.chevronLeft}
              aria-label="이전 이미지"
              onClick={goPrev}
              disabled={!canPrev}
              className={cn(
                "left-0",
                IMAGE_LIGHTBOX_NAV_BUTTON_CLASS,
                IMAGE_LIGHTBOX_CONTROL_BUTTON_CLASS,
              )}
            />
          )}

          {hasMultiple && (
            <IconButton
              type="button"
              variant="secondary"
              shape="circle"
              size="icon-xl"
              icon={ICONS.chevronRight}
              aria-label="다음 이미지"
              onClick={goNext}
              disabled={!canNext}
              className={cn(
                "right-0",
                IMAGE_LIGHTBOX_NAV_BUTTON_CLASS,
                IMAGE_LIGHTBOX_CONTROL_BUTTON_CLASS,
              )}
            />
          )}
        </div>

        {/* 닫기 버튼 (하단 중앙) */}
        <IconButton
          type="button"
          variant="secondary"
          shape="circle"
          size="icon-xl"
          icon={ICONS.close}
          aria-label="닫기"
          onClick={onClose}
          className={cn("shrink-0 active:!translate-y-0", IMAGE_LIGHTBOX_CONTROL_BUTTON_CLASS)}
        />
      </div>
    </div>
  );
}
