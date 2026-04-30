import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 분석·대시보드용 카드 셸. ResourceSection과 동일하게 `border-border-10` 기준면 유지. */
export function AnalyticsPanel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-[4px] border border-border-10 bg-surface-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
