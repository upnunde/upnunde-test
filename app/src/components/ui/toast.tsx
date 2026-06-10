"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** 단일 토스트 루트 — 스낵바 스타일 (반전 컬러: on-surface-10 배경, shadow, rounded-lg) */
const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** 메시지만 있을 때 true → px-4 py-3, 버튼 있으면 pl-4 pr-2 py-3 */
    messageOnly?: boolean;
  }
>(({ className, messageOnly, ...props }, ref) => (
  <div
    ref={ref}
    role="status"
    aria-live="polite"
    className={cn(
      "w-full max-w-[24rem] inline-flex justify-start items-center gap-my-16 rounded-lg bg-on-surface-10 shadow-elevation-20 py-my-12",
      messageOnly ? "px-my-16" : "pl-my-16 pr-my-8",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
Toast.displayName = "Toast";

/** 토스트 메시지 — 반전 컬러(surface-10), Pretendard_JP */
const ToastTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "flex-1 min-w-0 justify-start text-surface-10 text-body3_500 font-['Pretendard_JP',sans-serif]",
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

/** Type B: 닫기(X) 아이콘 버튼 — 40x40 원형, 클릭 시 토스트 즉시 닫힘 */
const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="닫기"
    className={cn(
      "w-9 h-9 shrink-0 rounded-[999px] cursor-pointer flex justify-center items-center overflow-hidden text-surface-10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    <X className="w-5 h-5" aria-hidden />
  </button>
));
ToastClose.displayName = "ToastClose";

/** Type C: 액션 텍스트 버튼 (Primary) — 클릭 시 onAction 호출 후 토스트 즉시 닫힘 */
const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "h-8 min-w-16 shrink-0 px-my-12 rounded-md cursor-pointer flex justify-center items-center gap-my-4 overflow-hidden text-primary text-body3_500 font-['Pretendard_JP',sans-serif] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

export { Toast, ToastTitle, ToastClose, ToastAction };
