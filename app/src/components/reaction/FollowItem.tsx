"use client";

import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";
import type { WorkFollow } from "@/types/reaction";

export function FollowItem({ follow }: { follow: WorkFollow }) {
  return (
    <article
      className={cn(
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        "flex items-start justify-between gap-4 border-b border-divider py-5 last:border-b-0",
      )}
    >
      <div className="min-w-0 flex flex-col gap-1">
        <span className="truncate text-body1_700 text-foreground lg:text-body2_700">{follow.authorName}</span>
        <p className="text-body3_400 text-foreground-muted">
          {follow.seriesTitle ? (
            <>
              <span className="text-foreground">{follow.seriesTitle}</span>을(를) 팔로우했습니다
            </>
          ) : (
            "작가를 팔로우했습니다"
          )}
        </p>
      </div>
      <time className="shrink-0 text-caption1_400 text-foreground-placeholder">{follow.createdAt}</time>
    </article>
  );
}
