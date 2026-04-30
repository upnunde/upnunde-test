"use client";

import React from "react";

/**
 * 등록된 에피소드가 0개일 때 노출 (정책 14).
 * 부모가 '단품'이면 이 컴포넌트는 사용하지 않음 (정책 15).
 */
export interface EmptyStateBannerProps {
  className?: string;
}

export function EmptyStateBanner({ className }: EmptyStateBannerProps) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center rounded-[4px] border border-border-10 bg-surface-20 py-16 px-8 text-center " +
        (className ?? "")
      }
      role="status"
      aria-label="등록된 에피소드가 없습니다"
    >
      <p className="text-base font-medium text-on-surface-30">
        등록된 에피소드가 없습니다.
      </p>
      <p className="mt-2 text-sm text-on-surface-30">
        에피소드를 추가하여 시리즈를 완성해 보세요.
      </p>
    </div>
  );
}
