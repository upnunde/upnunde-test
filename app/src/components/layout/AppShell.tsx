"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import { deriveSidebarActiveId, type SidebarItemId } from "@/components/AppSidebar/AppSidebar";
import { MobileAppSidebarDrawer } from "@/components/layout/MobileAppSidebarDrawer";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import { APP_MAIN_LAYOUT_CLASS, APP_MAIN_PANEL_CLASS, APP_SHELL_BODY_ROW_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";
import { usePathname } from "next/navigation";

export interface AppShellProps {
  sidebarActiveId: SidebarItemId;
  children: React.ReactNode;
  className?: string;
  /** 브라우저·본문 배경 — 기본 Background(`bg-canvas`). */
  browserBgClassName?: string;
}

/** 글로벌 헤더 + 반응형 사이드바( lg 미만 드로어 ) + 본문 */
export function AppShell({
  sidebarActiveId,
  children,
  className,
  browserBgClassName = APP_BROWSER_BG_CLASS,
}: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const resolvedSidebarActiveId = deriveSidebarActiveId(pathname, sidebarActiveId);

  return (
    <div className={cn(APP_PAGE_ROOT_CLASS, browserBgClassName, className)}>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className={cn(APP_SHELL_BODY_ROW_CLASS, browserBgClassName)}>
        <MobileAppSidebarDrawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          defaultActiveId={resolvedSidebarActiveId}
        />
        <main className={cn(APP_MAIN_LAYOUT_CLASS, browserBgClassName)}>
          <div className={APP_MAIN_PANEL_CLASS}>{children}</div>
        </main>
      </div>
    </div>
  );
}
