"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** 단일 토스트 루트 — 스낵바 스타일 (surface-10, shadow, rounded-lg) */
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
      "w-full max-w-[24rem] inline-flex justify-start items-center gap-4 rounded-lg bg-surface-10 py-3",
      messageOnly ? "px-4" : "pl-4 pr-2",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
Toast.displayName = "Toast";

/** 토스트 메시지 — on-surface-10, Pretendard_JP */
const ToastTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "flex-1 min-w-0 justify-start text-on-surface-10 text-sm font-medium leading-5 font-['Pretendard_JP',sans-serif]",
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
      "w-10 h-10 shrink-0 rounded-[999px] flex justify-center items-center overflow-hidden text-on-surface-10 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
      "h-8 min-w-16 shrink-0 px-2 rounded-md flex justify-center items-center gap-1 overflow-hidden text-primary text-sm font-medium leading-5 font-['Pretendard_JP',sans-serif] hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

export { Toast, ToastTitle, ToastClose, ToastAction };
