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
  children: React.ReactNode;
  className?: string;
  /** 모바일 드로어 활성 메뉴 (기본: 경로에서 추론) */
  sidebarDefaultActiveId?: SidebarItemId;
  /**
   * 모바일에서 main을 뷰포트 높이에 가두고 내부 스크롤만 사용.
   * 대화·에디터형 풀스크린 페이지용.
   */
  lockViewport?: boolean;
}

/**
 * AppShell 없는 Header+본문 페이지.
 * 모바일: 햄버거 → 전역 사이드바 드로어. lg+: 사이드바 미노출.
 * 헤더 아바타는 Header 내부 storage 단일 소스.
 */
export function StandaloneHeaderPage({
  children,
  className,
  sidebarDefaultActiveId = "series",
  lockViewport = false,
}: StandaloneHeaderPageProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarActiveId = deriveSidebarActiveId(pathname, sidebarDefaultActiveId);

  return (
    <div className={cn(APP_PAGE_ROOT_CLASS, APP_BROWSER_BG_CLASS, className)}>
      <Header onMenuClick={() => setSidebarOpen(true)} hideOnMobile />
      <div className="lg:hidden">
        <MobileAppSidebarDrawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          defaultActiveId={sidebarActiveId}
        />
      </div>
      <main
        className={cn(
          APP_MAIN_CLASS,
          lockViewport && "max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-hidden",
        )}
      >
        <div
          className={cn(
            APP_MAIN_PANEL_CLASS,
            lockViewport && "max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-hidden",
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
