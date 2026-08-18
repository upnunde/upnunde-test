"use client";

import type { ReactNode } from "react";
import { MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS } from "@/lib/mobile-viewport";
import { PAGE_CONTENT_FOOTER_CLASS } from "@/lib/page-layout";
import { useSeriesFormMobileSubmitBarPresent } from "@/components/series/SeriesFormMobileChromeContext";
import { cn } from "design-system/utils";

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
        "flex items-center justify-end gap-2",
        inlineInForm
          ? cn(PAGE_CONTENT_FOOTER_CLASS, "max-lg:-mx-5")
          : [
              "max-lg:w-full max-lg:[&_button]:h-9 max-lg:[&_button]:min-h-9 max-lg:[&_button]:min-w-0 max-lg:[&_button]:flex-1",
              MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS,
              "max-lg:border-t max-lg:border-border max-lg:bg-background",
              "max-lg:px-5",
              "max-lg:py-3",
              "max-lg:pb-[calc(var(--space-3)+env(safe-area-inset-bottom,0px))]",
            ],
        "lg:pt-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
