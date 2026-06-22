"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS } from "@/lib/page-layout";
import {
  RESOURCE_MGMT_BANNER_BODY,
} from "@/lib/episode-resource-copy";
import { cn } from "@/lib/utils";

const STORAGE_KEY_PREFIX = "resource-mgmt-banner-dismissed";

/** [정책 11, 12] 첫 진입 시 노출되는 안내 배너. 닫으면 localStorage에 저장하여 영구 비노출 */
export interface ResourceBannerProps {
  seriesId: string;
}

/** 클라이언트 마운트 여부를 setState 없이 읽기 위한 더미 subscribe */
const subscribeNoop = () => () => {};

export function ResourceBanner({ seriesId }: ResourceBannerProps) {
  /** SSR과 CSR의 hydration 결과가 일치하도록 — 서버에서는 false, 클라이언트에서는 true */
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(`${STORAGE_KEY_PREFIX}-${seriesId}`) === "true";
    } catch {
      return false;
    }
  });

  const handleClose = () => {
    const key = `${STORAGE_KEY_PREFIX}-${seriesId}`;
    try {
      localStorage.setItem(key, "true");
    } catch {
      // ignore quota / private mode
    }
    setDismissed(true);
  };

  if (!isClient || dismissed) return null;

  return (
    <div className="inline-flex self-stretch flex-col items-center justify-start gap-my-12 pt-0">
      <div
        className={cn(
          "mx-auto inline-flex w-full min-w-0 max-w-[1200px] items-center justify-center gap-my-16 rounded-[4px] bg-primary-primary-container p-my-20 outline outline-1 outline-offset-[-1px] outline-primary/20",
          PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
          "max-lg:outline-none",
        )}
      >
        <div className="flex-1 flex justify-start items-center gap-my-20">
          <div className="flex justify-start items-center gap-my-8">
            <div className="w-6 h-6 relative rounded overflow-hidden shrink-0">
              <Info
                className="w-5 h-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-on-primary-container"
                aria-hidden
              />
            </div>
            <div className="text-primary-on-primary-container text-body1_700 font-['Pretendard_JP']">
              안내
            </div>
          </div>
          <p className="flex-1 text-on-surface-20 text-body2_400 lg:text-body3_500 font-['Pretendard_JP']">
            {RESOURCE_MGMT_BANNER_BODY}
          </p>
        </div>
        <div className="flex justify-start items-center gap-my-8">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full text-on-surface-30 hover:bg-surface-20"
            aria-label="배너 닫기"
          >
            <X className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
