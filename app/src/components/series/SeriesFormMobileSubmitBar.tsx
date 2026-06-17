"use client";

import { Button } from "@/components/ui/button";
import { MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS } from "@/lib/mobile-viewport";
import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

interface SeriesFormMobileSubmitBarProps {
  showDraftButton?: boolean;
  onDraftClick?: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  className?: string;
}

/** 시리즈 폼 모바일 하단 고정 — 임시저장·등록하기 */
export function SeriesFormMobileSubmitBar({
  showDraftButton = false,
  onDraftClick,
  onSubmit,
  submitDisabled,
  className,
}: SeriesFormMobileSubmitBarProps) {
  return (
    <div
      className={cn(
        "flex gap-my-8 lg:hidden",
        MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS,
        "border-t border-border-10 bg-white",
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        "py-my-12",
        "pb-[calc(var(--spacing-my-12)+env(safe-area-inset-bottom,0px))]",
        "[&_button]:h-my-36 [&_button]:min-h-my-36 [&_button]:min-w-0 [&_button]:flex-1",
        className,
      )}
      role="group"
      aria-label="시리즈 저장"
    >
      {showDraftButton ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onDraftClick}
          className="bg-white text-on-surface-20 hover:bg-surface-20 disabled:border-border-20"
        >
          임시저장
        </Button>
      ) : null}
      <Button
        type="button"
        size="lg"
        onClick={onSubmit}
        disabled={submitDisabled}
        className={cn(
          "bg-primary text-primary-foreground hover:bg-primary/90",
          submitDisabled && "bg-primary/40 hover:bg-primary/40 cursor-not-allowed",
        )}
      >
        등록하기
      </Button>
    </div>
  );
}
