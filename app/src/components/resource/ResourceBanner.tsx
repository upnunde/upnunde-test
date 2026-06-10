"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="self-stretch pt-0 inline-flex flex-col justify-start items-center gap-my-12">
      <div className="w-full min-w-0 max-w-[1200px] mx-auto p-my-20 bg-surface-10 rounded-[4px] outline outline-1 outline-offset-[-1px] outline-border-10 inline-flex justify-center items-center gap-my-40">
        <div className="flex-1 flex justify-start items-center gap-my-20">
          <div className="flex justify-start items-center gap-my-8">
            <div className="w-6 h-6 relative rounded overflow-hidden shrink-0">
              <Info
                className="w-5 h-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
                aria-hidden
              />
            </div>
            <div className="text-primary text-body1_700 font-['Pretendard_JP']">
              안내
            </div>
          </div>
          <p className="flex-1 text-on-surface-20 text-body1_500 font-['Pretendard_JP']">
            등록된 리소스는 앞으로 제작할 모든 에피소드를 구성하는 근간이 되는 핵심 데이터입니다.
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
            <span className="text-heading5_700">×</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
