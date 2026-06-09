"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AiFieldLoadingMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex min-w-0 items-center text-body3_400", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="ai-field-text-shimmer truncate">{message}</span>
      <span className="ai-field-loading-dots" aria-hidden>
        <span />
        <span />
        <span />
      </span>
    </span>
  );
}

const inputShellClass =
  "rounded-md border border-border-10 bg-white px-my-12 text-body3_400 text-on-surface-10";

export function EpisodeAiTextField({
  isLoading,
  loadingMessage,
  shellClassName,
  children,
}: {
  isLoading: boolean;
  loadingMessage: string;
  shellClassName?: string;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <div
        className={cn(inputShellClass, "flex items-center", shellClassName)}
        aria-busy="true"
      >
        <AiFieldLoadingMessage message={loadingMessage} />
      </div>
    );
  }
  return <>{children}</>;
}

export function EpisodeAiThumbnailLoading({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-[160px] w-[90px] shrink-0 animate-pulse rounded-[4px] bg-surface-20",
        className,
      )}
      role="status"
      aria-busy="true"
      aria-label="대표 이미지 생성 중"
    />
  );
}
