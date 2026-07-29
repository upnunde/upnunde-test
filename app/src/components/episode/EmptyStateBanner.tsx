"use client";

import React from "react";
import { Button } from "design-system/ui/button";
import {
  EPISODE_EMPTY_GUIDE_LINE1,
  EPISODE_EMPTY_GUIDE_LINE2,
} from "@/lib/episode-resource-copy";

/**
 * 등록된 에피소드가 0개일 때 노출 (정책 14).
 * 부모가 '단품'이면 이 컴포넌트는 사용하지 않음 (정책 15).
 */
export interface EmptyStateBannerProps {
  className?: string;
  onAddEpisode?: () => void;
  onRegisterResources?: () => void;
}

export function EmptyStateBanner({
  className,
  onAddEpisode,
  onRegisterResources,
}: EmptyStateBannerProps) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center rounded-sm border border-border bg-muted py-16 px-8 text-center " +
        (className ?? "")
      }
      role="status"
      aria-label="등록된 에피소드가 없습니다"
    >
      <p className="text-body1_500 text-foreground-muted">
        등록된 에피소드가 없습니다.
      </p>
      <p className="mt-3 max-w-md text-body4_400 text-foreground-muted">
        {EPISODE_EMPTY_GUIDE_LINE1}
        <br />
        {EPISODE_EMPTY_GUIDE_LINE2}
      </p>
      {(onAddEpisode || onRegisterResources) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {onAddEpisode ? (
            <Button type="button" onClick={onAddEpisode}>
              새 에피소드
            </Button>
          ) : null}
          {onRegisterResources ? (
            <Button type="button" variant="outline" onClick={onRegisterResources}>
              리소스 등록하기
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
