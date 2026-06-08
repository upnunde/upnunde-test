"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 서브 헤더·에디터 헤더 뒤로가기 — standard 36×36 (`size="icon-lg"`) */
export const HEADER_BACK_BUTTON_CLASS =
  "shrink-0 rounded-full border-border-20 disabled:border-border-20 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0";

export function HeaderBackButton({
  onClick,
  "aria-label": ariaLabel = "뒤로 가기",
  className,
}: {
  onClick: () => void;
  "aria-label"?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(HEADER_BACK_BUTTON_CLASS, className)}
    >
      <ChevronLeft className="text-on-surface-30" />
    </Button>
  );
}
