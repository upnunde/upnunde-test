"use client";

import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { Button } from "design-system/ui/button";
import { cn } from "design-system/utils";
import type { WorkComment } from "@/types/comment";

export function CommentSeriesHeader({ title }: { title: string }) {
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

export function CommentItem({
  comment,
  onTogglePick,
  onRestrict,
  onReply,
}: {
  comment: WorkComment;
  onTogglePick: (id: string) => void;
  onRestrict: (id: string) => void;
  onReply: (id: string) => void;
}) {
  const { episodeLabel, authorName, content, createdAt, likeCount, replyCount, isPicked, isCreator } =
    comment;

  return (
    <article
      className={cn(
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        "border-b border-divider py-5 last:border-b-0",
        "lg:grid lg:grid-cols-[5.5rem_minmax(0,1fr)_auto] lg:items-start lg:gap-x-6",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3 lg:mb-0 lg:block lg:pt-0.5">
        <span className="text-body3_500 text-foreground-muted tabular-nums">{episodeLabel}</span>
        <time className="text-caption1_400 text-foreground-placeholder lg:hidden">{createdAt}</time>
      </div>

      <div className="min-w-0 flex flex-col gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-body2_700 text-foreground">{authorName}</span>
          {isCreator ? (
            <span className="inline-flex h-5 items-center rounded px-1.5 text-caption1_500 bg-info/15 text-info">
              CREATOR
            </span>
          ) : null}
          {isPicked ? (
            <span className="inline-flex h-5 items-center rounded px-1.5 text-caption1_500 bg-primary-container text-primary">
              PICK
            </span>
          ) : null}
        </div>

        <p className="whitespace-pre-wrap text-body1_400 text-foreground lg:text-body2_400">{content}</p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
          <span className="text-caption1_400 text-foreground-placeholder">
            좋아요 {likeCount}
            <span className="mx-1.5" aria-hidden>
              ·
            </span>
            답글 {replyCount}
          </span>

          {!isCreator ? (
            <div className="flex flex-wrap items-center gap-1 lg:hidden">
              <Button type="button" variant="ghost" size="sm" onClick={() => onReply(comment.id)}>
                답글
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => onTogglePick(comment.id)}>
                {isPicked ? "PICK 해제" : "PICK"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                tone="destructive"
                onClick={() => onRestrict(comment.id)}
              >
                작성 제한
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden min-w-[9.5rem] flex-col items-end gap-3 lg:flex">
        <time className="text-caption1_400 text-foreground-placeholder">{createdAt}</time>
        {!isCreator ? (
          <div className="flex flex-col items-stretch gap-1">
            <Button type="button" variant="outline" size="sm" onClick={() => onReply(comment.id)}>
              답글
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => onTogglePick(comment.id)}>
              {isPicked ? "PICK 해제" : "PICK"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              tone="destructive"
              onClick={() => onRestrict(comment.id)}
            >
              작성 제한
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
