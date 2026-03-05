"use client";

import React from "react";
import { useToastStore } from "@/store/useToastStore";
import { Toast, ToastTitle, ToastClose, ToastAction } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/**
 * Toaster 컨테이너 — 기획서 정책 적용
 * - 최하단 여백(Bottom offset): 화면 바닥에서 40px
 * - 토스트 스택 수직 간격(Gap): 16px
 * - 최대 3개 노출 (store에서 FIFO 처리)
 */
export function Toaster({ className }: { className?: string }) {
  const { toasts, remove } = useToastStore();

  return (
    <div
      className={cn(
        "fixed left-1/2 z-50 flex w-full max-w-[420px] -translate-x-1/2 flex-col gap-[16px] px-4",
        "bottom-[40px]",
        className
      )}
      aria-label="알림 목록"
    >
      {toasts.map((item) => (
        <Toast
          key={item.id}
          data-state="open"
          messageOnly={item.variant === "default"}
        >
          <ToastTitle>{item.message}</ToastTitle>
          {item.variant === "withClose" && (
            <ToastClose
              onClick={() => remove(item.id)}
              aria-label="닫기"
            />
          )}
          {item.variant === "withAction" && item.actionLabel && (
            <ToastAction
              onClick={() => {
                item.onAction?.();
                remove(item.id);
              }}
            >
              {item.actionLabel}
            </ToastAction>
          )}
        </Toast>
      ))}
    </div>
  );
}
