"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar, { type SidebarItemId } from "@/components/AppSidebar/AppSidebar";
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
    <div className={cn("flex h-screen w-full flex-col overflow-hidden bg-white", className)}>
      <Header
        profileImageUrl={profileImageUrl}
        onProfileImageChange={setProfileImageUrl}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <div className="relative flex flex-1 overflow-hidden bg-surface-20">
        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-label="메뉴 닫기"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
        <AppSidebar
          defaultActiveId={sidebarActiveId}
          mobileOpen={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
