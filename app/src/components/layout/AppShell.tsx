"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar, { type SidebarItemId } from "@/components/AppSidebar/AppSidebar";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import { APP_MAIN_CLASS, APP_MAIN_PANEL_CLASS, APP_SHELL_BODY_ROW_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  sidebarActiveId: SidebarItemId;
  children: React.ReactNode;
  className?: string;
}

/** 글로벌 헤더 + 반응형 사이드바( lg 미만 드로어 ) + 본문 */
export function AppShell({ sidebarActiveId, children, className }: AppShellProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn(APP_PAGE_ROOT_CLASS, APP_BROWSER_BG_CLASS, className)}>
      <Header
        profileImageUrl={profileImageUrl}
        onProfileImageChange={setProfileImageUrl}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <div className={cn(APP_SHELL_BODY_ROW_CLASS, APP_BROWSER_BG_CLASS)}>
        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-0 z-40 bg-black/50 lg:hidden max-lg:bottom-auto max-lg:top-[var(--app-vv-live-top,0px)] max-lg:h-[var(--app-vv-live-height,100dvh)]"
            aria-label="메뉴 닫기"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
        <AppSidebar
          defaultActiveId={sidebarActiveId}
          mobileOpen={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />
        <main className={APP_MAIN_CLASS}>
          <div className={APP_MAIN_PANEL_CLASS}>{children}</div>
        </main>
      </div>
    </div>
  );
}
