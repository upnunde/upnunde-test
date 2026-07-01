import type { ReactNode } from "react";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

/** 분석·대시보드용 카드 셸. ResourceSection과 동일하게 `border-border` 기준면 유지. */
export function AnalyticsPanel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-sm border border-border bg-background",
        PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
        className,
      )}
    >
      {children}
    </div>
  );
}
