"use client";

import type { ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMobilePreviewScrollLock } from "@/hooks/useMobilePreviewScrollLock";
import { cn } from "design-system/utils";

/** 데스크톱: 중앙 투명 모달 / 모바일: 뷰포트 풀페이지(모달 느낌 제거) */
export const PREVIEW_PHONE_DIALOG_CONTENT_CLASS = cn(
  "fixed z-modal flex flex-col items-center gap-0 overflow-hidden p-0 text-foreground shadow-none ring-0 outline-none",
  "focus:outline-none focus-visible:outline-none focus-visible:ring-0",
  "data-open:animate-in data-open:fade-in-0 data-open:duration-medium data-open:ease-emphasized-decelerate",
  "data-closed:animate-out data-closed:fade-out-0 data-closed:duration-short data-closed:ease-emphasized-accelerate",
  // 모바일 — 전체화면 페이지
  "max-lg:inset-0 max-lg:top-0 max-lg:left-0 max-lg:h-dvh max-lg:w-full max-lg:max-w-none",
  "max-lg:translate-x-0 max-lg:translate-y-0 max-lg:rounded-none max-lg:border-0 max-lg:bg-background",
  "max-lg:data-open:zoom-in-100 max-lg:data-closed:zoom-out-100",
  // 데스크톱 — 기존 폰 목업 모달
  "lg:top-1/2 lg:left-1/2 lg:h-auto lg:w-auto lg:max-w-[min(100vw-2rem,480px)]",
  "lg:-translate-x-1/2 lg:-translate-y-1/2 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent",
  "lg:data-open:zoom-in-95 lg:data-closed:zoom-out-95",
);

/** 모바일에서 프레임 비젤 제거 · 풀블리드 */
export const PREVIEW_PHONE_FRAME_MOBILE_FILL_CLASS = cn(
  "max-lg:h-full max-lg:w-full max-lg:max-w-none max-lg:rounded-none max-lg:outline-none",
);

export const PREVIEW_PHONE_FRAME_INNER_MOBILE_FILL_CLASS = "max-lg:rounded-none";

/** 닫기 버튼 — 데스크톱은 프레임 우측, 모바일은 화면 안 우상단 */
export const PREVIEW_PHONE_CLOSE_BUTTON_CLASS = cn(
  "z-dropdown bg-background shadow-elevation-20",
  "max-lg:absolute max-lg:right-3 max-lg:top-[max(0.75rem,env(safe-area-inset-top))] max-lg:left-auto max-lg:ml-0",
  "lg:absolute lg:left-full lg:top-0 lg:ml-3",
);

interface PreviewPhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

/**
 * 미리보기 공용 셸 — lg+ 모달(폰 프레임), max-lg 풀페이지.
 * 모바일에서는 딤/블러 오버레이를 배경색으로 덮어 페이지 전환처럼 보이게 한다.
 */
export function PreviewPhoneDialog({
  open,
  onOpenChange,
  title,
  children,
}: PreviewPhoneDialogProps) {
  useMobilePreviewScrollLock(open);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} data-slot="dialog">
      <DialogPortal>
        <DialogOverlay
          className={cn(
            "max-lg:bg-background max-lg:supports-backdrop-filter:backdrop-blur-none",
          )}
        />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={PREVIEW_PHONE_DIALOG_CONTENT_CLASS}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogPrimitive.Popup>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
