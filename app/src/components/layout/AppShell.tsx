"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import { deriveSidebarActiveId, type SidebarItemId } from "@/components/AppSidebar/AppSidebar";
import { MobileAppSidebarDrawer } from "@/components/layout/MobileAppSidebarDrawer";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import { APP_MAIN_CLASS, APP_MAIN_PANEL_CLASS, APP_SHELL_BODY_ROW_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";
import { usePathname } from "next/navigation";

export interface AppShellProps {
  sidebarActiveId: SidebarItemId;
  children: React.ReactNode;
  className?: string;
}

/** 글로벌 헤더 + 반응형 사이드바( lg 미만 드로어 ) + 본문 */
export function AppShell({ sidebarActiveId, children, className }: AppShellProps) {
  const pathname = usePathname();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const resolvedSidebarActiveId = deriveSidebarActiveId(pathname, sidebarActiveId);

  return (
    <div className={cn(APP_PAGE_ROOT_CLASS, APP_BROWSER_BG_CLASS, className)}>
      <Header
        profileImageUrl={profileImageUrl}
        onProfileImageChange={setProfileImageUrl}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <div className={cn(APP_SHELL_BODY_ROW_CLASS, APP_BROWSER_BG_CLASS)}>
        <MobileAppSidebarDrawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          defaultActiveId={resolvedSidebarActiveId}
        />
        <main className={APP_MAIN_CLASS}>
          <div className={APP_MAIN_PANEL_CLASS}>{children}</div>
        </main>
      </div>
    </div>
  );
}
