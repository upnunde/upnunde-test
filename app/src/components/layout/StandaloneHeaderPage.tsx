"use client";

import Header from "@/components/Header/Header";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import { APP_MAIN_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

export interface StandaloneHeaderPageProps {
  profileImageUrl: string | null;
  onProfileImageChange: (value: string | null) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * AppShell 없는 Header+본문 페이지.
 * 이중 div/main 래핑 없이 단일 main — 모바일 문서 스크롤·sticky containing block 일원화.
 */
export function StandaloneHeaderPage({
  profileImageUrl,
  onProfileImageChange,
  children,
  className,
}: StandaloneHeaderPageProps) {
  return (
    <div className={cn(APP_PAGE_ROOT_CLASS, APP_BROWSER_BG_CLASS, className)}>
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={onProfileImageChange} />
      <main className={cn(APP_MAIN_CLASS, "bg-surface-20")}>{children}</main>
    </div>
  );
}
