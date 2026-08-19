"use client";

import { Button } from "design-system/ui/button";
import { MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS } from "@/lib/mobile-viewport";
import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

interface SeriesFormMobileSubmitBarProps {
  showDraftButton?: boolean;
  onDraftClick?: () => void;
  draftDisabled?: boolean;
  onSubmit: () => void;
  submitDisabled: boolean;
  submitLabel?: string;
  className?: string;
}

/** 시리즈 폼 모바일 하단 고정 — 임시저장·등록하기 */
export function SeriesFormMobileSubmitBar({
  showDraftButton = false,
  onDraftClick,
  draftDisabled = false,
  onSubmit,
  submitDisabled,
  submitLabel = "등록하기",
  className,
}: SeriesFormMobileSubmitBarProps) {
  return (
    <div
      className={cn(
        "flex gap-2 lg:hidden",
        MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS,
        "border-t border-border bg-background",
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        "py-3",
        "pb-[calc(var(--space-3)+env(safe-area-inset-bottom,0px))]",
        "[&_button]:h-9 [&_button]:min-h-9 [&_button]:min-w-0 [&_button]:flex-1",
        className,
      )}
      role="group"
      aria-label="시리즈 저장"
    >
      {showDraftButton ? (
        <Button
          type="button"
          variant="outline"
          shape="square"
          size="xl"
          disabled={draftDisabled}
          onClick={onDraftClick}
        >
          임시저장
        </Button>
      ) : null}
      <Button
        type="button"
        tone="brand"
        shape="square"
        size="xl"
        disabled={submitDisabled}
        onClick={onSubmit}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
