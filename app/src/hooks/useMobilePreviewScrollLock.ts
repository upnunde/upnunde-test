"use client";

import { useEffect } from "react";
import { isMobileDocumentScrollMode } from "@/lib/mobile-document-scroll";

/** 모바일 미리보기 활성 시 문서 스크롤 잠금 — 풀화면 고정 셸과 함께 사용 */
export function useMobilePreviewScrollLock(active: boolean) {
  useEffect(() => {
    if (!active || !isMobileDocumentScrollMode()) return;

    const { body, documentElement } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [active]);
}
