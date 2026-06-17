"use client";

import type { ReactNode } from "react";
import { MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS } from "@/lib/mobile-viewport";
import {
  PAGE_CONTENT_FOOTER_CLASS,
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
} from "@/lib/page-layout";
import { useSeriesFormMobileSubmitBarPresent } from "@/components/series/SeriesFormMobileChromeContext";
import { cn } from "@/lib/utils";

/** 시리즈 폼 탭 단계 이동 — 시리즈 폼 모바일: 카드 푸터형 인라인 · 그 외: 하단 고정 */
export function SeriesFormStepNav({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const inlineInForm = useSeriesFormMobileSubmitBarPresent();

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-my-8",
        inlineInForm
          ? cn(PAGE_CONTENT_FOOTER_CLASS, "max-lg:-mx-my-20")
          : [
              "max-lg:w-full max-lg:[&_button]:h-my-36 max-lg:[&_button]:min-h-my-36 max-lg:[&_button]:min-w-0 max-lg:[&_button]:flex-1",
              MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS,
              "max-lg:border-t max-lg:border-border-10 max-lg:bg-white",
              PAGE_FLUSH_CONTENT_PAD_X_CLASS,
              "max-lg:py-my-12",
              "max-lg:pb-[calc(var(--spacing-my-12)+env(safe-area-inset-bottom,0px))]",
            ],
        "lg:pt-my-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
