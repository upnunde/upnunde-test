"use client";

import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";
import type { WorkLike } from "@/types/reaction";

export function LikeSeriesHeader({ title }: { title: string }) {
  return (
    <div
      className={cn(
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        "sticky top-0 z-sticky border-b border-border bg-background py-3",
      )}
    >
      <h2 className="truncate text-body1_700 text-foreground">{title}</h2>
    </div>
  );
}

export function LikeItem({ like }: { like: WorkLike }) {
  return (
    <article
      className={cn(
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        "border-b border-divider py-5 last:border-b-0",
        "lg:grid lg:grid-cols-[5.5rem_minmax(0,1fr)_auto] lg:items-start lg:gap-x-6",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3 lg:mb-0 lg:block lg:pt-0.5">
        <span className="text-body3_500 text-foreground-muted tabular-nums">{like.episodeLabel}</span>
        <time className="text-caption1_400 text-foreground-placeholder lg:hidden">{like.createdAt}</time>
      </div>

      <div className="min-w-0 flex flex-col gap-1">
        <span className="text-body2_700 text-foreground">{like.authorName}</span>
        <p className="text-body3_400 text-foreground-muted">에피소드를 좋아합니다</p>
      </div>

      <time className="mt-2 hidden text-caption1_400 text-foreground-placeholder lg:mt-0.5 lg:block">
        {like.createdAt}
      </time>
    </article>
  );
}
