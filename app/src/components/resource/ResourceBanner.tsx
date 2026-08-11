"use client";

import React, { useState, useSyncExternalStore } from "react";
import { ICONS } from "@/lib/icons";
import { Button } from "design-system/ui/button";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS } from "@/lib/page-layout";
import {
  RESOURCE_MGMT_BANNER_BODY,
} from "@/lib/episode-resource-copy";
import { cn } from "design-system/utils";

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
    <div className="inline-flex self-stretch flex-col items-center justify-start gap-3 pt-0">
      <div
        className={cn(
          "mx-auto inline-flex w-full min-w-0 max-w-[1200px] items-center justify-center gap-4 rounded-sm bg-primary-container py-2 px-4 outline outline-1 outline-offset-[-1px] outline-primary/20",
          PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
          "max-lg:outline-none",
        )}
      >
        <div className="flex-1 flex justify-start items-center gap-5">
          <div className="flex justify-start items-center gap-2">
            <div className="w-6 h-6 relative rounded overflow-hidden shrink-0">
              <ICONS.info
                className="w-5 h-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-container-foreground"
                aria-hidden
              />
            </div>
            <div className="text-primary-container-foreground text-body1_700 font-['Pretendard_JP']">
              안내
            </div>
          </div>
          <p className="flex-1 text-foreground-muted text-body2_400 lg:text-body3_500 font-['Pretendard_JP']">
            {RESOURCE_MGMT_BANNER_BODY}
          </p>
        </div>
        <div className="flex justify-start items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full text-foreground-placeholder hover:bg-muted"
            aria-label="배너 닫기"
          >
            <ICONS.close className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
