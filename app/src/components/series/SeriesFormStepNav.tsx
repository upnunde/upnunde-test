"use client";

import type { ReactNode } from "react";
import { MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS } from "@/lib/mobile-viewport";
import { cn } from "@/lib/utils";

/** 시리즈 폼 탭 단계 이동 — 모바일 하단 고정 · 데스크톱 인라인 */
export function SeriesFormStepNav({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex justify-end gap-my-8",
        "max-lg:w-full max-lg:[&_button]:h-my-36 max-lg:[&_button]:min-h-my-36 max-lg:[&_button]:min-w-0 max-lg:[&_button]:flex-1",
        MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS,
        "max-lg:border-t max-lg:border-border-10 max-lg:bg-white",
        "max-lg:px-my-20 max-lg:py-my-12",
        "max-lg:pb-[calc(var(--spacing-my-12)+env(safe-area-inset-bottom,0px))]",
        "lg:pt-my-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
