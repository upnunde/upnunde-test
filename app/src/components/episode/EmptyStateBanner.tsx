"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
        "flex flex-col items-center justify-center rounded-[4px] border border-border-10 bg-surface-20 py-my-64 px-my-32 text-center " +
        (className ?? "")
      }
      role="status"
      aria-label="등록된 에피소드가 없습니다"
    >
      <p className="text-body1_500 text-on-surface-20">
        등록된 에피소드가 없습니다.
      </p>
      <p className="mt-my-12 max-w-md text-body4_400 text-on-surface-20">
        {EPISODE_EMPTY_GUIDE_LINE1}
        <br />
        {EPISODE_EMPTY_GUIDE_LINE2}
      </p>
      {(onAddEpisode || onRegisterResources) && (
        <div className="mt-my-32 flex flex-wrap items-center justify-center gap-my-8">
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
