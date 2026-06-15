"use client";

import React from "react";
import { useToastStore } from "@/store/useToastStore";
import { Toast, ToastTitle, ToastClose, ToastAction } from "@/components/ui/toast";
import { TOAST_STACK_Z_CLASS } from "@/components/ui/modal/modal-styles";
import { cn } from "@/lib/utils";

/**
 * Toaster 컨테이너 — 기획서 정책 적용
 * - 뷰포트 상단 노출 (safe-area·visualViewport 보정)
 * - 토스트 스택 수직 간격(Gap): 16px
 * - 최대 3개 노출 (store에서 FIFO 처리)
 */
export function Toaster({ className }: { className?: string }) {
  const { toasts, remove } = useToastStore();

  return (
    <div
      className={cn(
        "fixed left-1/2 flex w-full max-w-[420px] -translate-x-1/2 flex-col gap-my-16 px-my-16",
        TOAST_STACK_Z_CLASS,
        "top-[calc(env(safe-area-inset-top,0px)+var(--app-vv-top,0px)+var(--spacing-my-16))]",
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
