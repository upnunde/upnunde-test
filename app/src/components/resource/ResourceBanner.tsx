"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS } from "@/lib/page-layout";
import { RESOURCE_MGMT_BANNER_BODY } from "@/lib/episode-resource-copy";
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

  const handleDismiss = () => {
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
      <Alert
        status="primary"
        type="icon"
        size="md"
        removable
        onDismiss={handleDismiss}
        className={cn(
          "mx-auto w-full min-w-0 max-w-[1200px]",
          PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
        )}
      >
        <AlertTitle>안내</AlertTitle>
        <AlertDescription>{RESOURCE_MGMT_BANNER_BODY}</AlertDescription>
      </Alert>
    </div>
  );
}
