"use client";

import { createContext, useContext } from "react";

const SeriesFormMobileChromeContext = createContext(false);

export function SeriesFormMobileChromeProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <SeriesFormMobileChromeContext.Provider value={enabled}>
      {children}
    </SeriesFormMobileChromeContext.Provider>
  );
}

/** 시리즈 폼 스캐폴드 모바일 — 카드 인라인 스텝 네비 + 하단 고정 제출 바 */
export function useSeriesFormMobileSubmitBarPresent() {
  return useContext(SeriesFormMobileChromeContext);
}
