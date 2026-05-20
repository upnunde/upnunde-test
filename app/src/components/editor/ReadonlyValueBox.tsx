"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 편집 화면 리소스/메타 값 박스와 동일 톤 — 화살표·호버·클릭 없음 */
export const READONLY_VALUE_BOX_CLASS =
  "inline-flex h-8 min-w-0 w-fit max-w-full items-center gap-1 rounded-[8px] border border-border-10 bg-white px-2 py-1.5 pointer-events-none select-none";

export function ReadonlyValueBox({
  label,
  leading,
  empty = false,
  className,
}: {
  label: ReactNode;
  leading?: ReactNode;
  empty?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(READONLY_VALUE_BOX_CLASS, className)}
    >
      {leading}
      <span
        className={cn(
          "min-w-0 max-w-full truncate text-[13px] font-medium",
          empty ? "text-on-surface-30" : "text-on-surface-30"
        )}
      >
        {label}
      </span>
    </span>
  );
}
