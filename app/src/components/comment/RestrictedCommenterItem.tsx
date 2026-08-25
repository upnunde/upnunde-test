"use client";

import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { Button } from "design-system/ui/button";
import { cn } from "design-system/utils";
import type { RestrictedCommenter } from "@/types/comment";

export function RestrictedCommenterItem({
  item,
  onUnrestrict,
}: {
  item: RestrictedCommenter;
  onUnrestrict: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        "flex items-start justify-between gap-4 border-b border-divider py-5 last:border-b-0",
        "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
      )}
    >
      <div className="min-w-0 flex flex-col gap-1.5">
        <span className="truncate text-body1_700 text-foreground lg:text-body2_700">{item.authorName}</span>
        <span className="truncate text-body3_400 text-foreground-muted">{item.seriesTitle}</span>
        <span className="text-body3_400 text-foreground">{item.reason}</span>
        <span className="text-caption1_400 text-foreground-placeholder">제한일 {item.restrictedAt}</span>
      </div>
      <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => onUnrestrict(item.id)}>
        제한 해제
      </Button>
    </div>
  );
}
