"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function ImageLightbox({
  open,
  onClose,
  items,
  initialIndex = 0,
  className,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const item = items[index];
  const hasMultiple = items.length > 1;
  const canPrev = hasMultiple && index > 0;
  const canNext = hasMultiple && index < items.length - 1;

  useEffect(() => {
    setIndex(Math.min(Math.max(0, initialIndex), items.length - 1));
  }, [open, initialIndex, items.length]);

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
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 크게 보기"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[512px] h-[716px] relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이미지 프레임 */}
        <div className="w-96 h-[640px] relative bg-border-10/5 rounded-2xl outline outline-4 outline-offset-[-4px] outline-white overflow-hidden shadow-xl">
          {item && (
            <img
              src={item.imageUrl}
              alt={item.name ?? "미리보기"}
              className="w-full h-full object-cover object-center"
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
              "absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full",
              "inline-flex justify-center items-center overflow-hidden cursor-pointer",
              "bg-surface-10 shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)]",
              "hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
            aria-label="이전 이미지"
          >
            <ChevronLeft className="w-6 h-6 text-on-surface-10" strokeWidth={2} />
          </button>
        )}

        {/* 오른쪽 다음 버튼 */}
        {hasMultiple && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full",
              "inline-flex justify-center items-center overflow-hidden cursor-pointer",
              "bg-surface-10 shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)]",
              "hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
            aria-label="다음 이미지"
          >
            <ChevronRight className="w-6 h-6 text-on-surface-10" strokeWidth={2} />
          </button>
        )}

        {/* 닫기 버튼 (하단 중앙) */}
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute left-1/2 -translate-x-1/2 top-[660px] mt-6 w-14 h-14 rounded-full",
            "bg-black/30 inline-flex justify-center items-center overflow-hidden cursor-pointer",
            "hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          )}
          aria-label="닫기"
        >
          <X className="w-7 h-7 text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
