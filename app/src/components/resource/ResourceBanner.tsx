"use client";

import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY_PREFIX = "resource-mgmt-banner-dismissed";

/** [정책 11, 12] 첫 진입 시 노출되는 안내 배너. 닫으면 localStorage에 저장하여 영구 비노출 */
export interface ResourceBannerProps {
  seriesId: string;
}

export function ResourceBanner({ seriesId }: ResourceBannerProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const key = `${STORAGE_KEY_PREFIX}-${seriesId}`;
    try {
      const dismissed = localStorage.getItem(key);
      setVisible(dismissed !== "true");
    } catch {
      setVisible(true);
    }
  }, [seriesId]);

  const handleClose = () => {
    const key = `${STORAGE_KEY_PREFIX}-${seriesId}`;
    try {
      localStorage.setItem(key, "true");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div className="self-stretch px-5 pt-0 inline-flex flex-col justify-start items-center gap-3">
      <div className="w-full max-w-[1400px] min-w-[800px] p-5 bg-surface-10 rounded-xl outline outline-1 outline-offset-[-1px] outline-border-10 inline-flex justify-center items-center gap-10">
        <div className="flex-1 flex justify-start items-center gap-5">
          <div className="flex justify-start items-center gap-2">
            <div className="w-6 h-6 relative rounded overflow-hidden shrink-0">
              <Info
                className="w-5 h-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
                aria-hidden
              />
            </div>
            <div className="text-primary text-base font-bold font-['Pretendard_JP'] leading-6">
              안내
            </div>
          </div>
          <p className="flex-1 text-on-surface-20 text-base font-medium font-['Pretendard_JP'] leading-6">
            등록된 리소스는 앞으로 제작할 모든 에피소드를 구성하는 근간이 되는 핵심 데이터입니다.
          </p>
        </div>
        <div className="flex justify-start items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full text-on-surface-30 hover:bg-slate-100"
            aria-label="배너 닫기"
          >
            <span className="text-lg leading-none">×</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
