"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import {
  deriveSidebarActiveId,
  MobileAppSidebarDrawer,
} from "@/components/layout/MobileAppSidebarDrawer";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import { APP_MAIN_CLASS, APP_MAIN_PANEL_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";
import type { SidebarItemId } from "@/components/AppSidebar/AppSidebar";

export interface StandaloneHeaderPageProps {
  profileImageUrl: string | null;
  onProfileImageChange: (value: string | null) => void;
  children: React.ReactNode;
  className?: string;
  /** 모바일 드로어 활성 메뉴 (기본: 경로에서 추론) */
  sidebarDefaultActiveId?: SidebarItemId;
}

/**
 * AppShell 없는 Header+본문 페이지.
 * 모바일: 햄버거 → 전역 사이드바 드로어. lg+: 사이드바 미노출.
 */
export function StandaloneHeaderPage({
  profileImageUrl,
  onProfileImageChange,
  children,
  className,
  sidebarDefaultActiveId = "series",
}: StandaloneHeaderPageProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarActiveId = deriveSidebarActiveId(pathname, sidebarDefaultActiveId);

  return (
    <div className={cn(APP_PAGE_ROOT_CLASS, APP_BROWSER_BG_CLASS, className)}>
      <Header
        profileImageUrl={profileImageUrl}
        onProfileImageChange={onProfileImageChange}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <div className="lg:hidden">
        <MobileAppSidebarDrawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          defaultActiveId={sidebarActiveId}
        />
      </div>
      <main className={APP_MAIN_CLASS}>
        <div className={APP_MAIN_PANEL_CLASS}>{children}</div>
      </main>
    </div>
  );
}
