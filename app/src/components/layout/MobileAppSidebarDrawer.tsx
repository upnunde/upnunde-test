"use client";

import AppSidebar, { deriveSidebarActiveId, type SidebarItemId } from "@/components/AppSidebar/AppSidebar";

const MOBILE_SIDEBAR_BACKDROP_CLASS =
  "fixed inset-x-0 bottom-0 top-0 z-overlay bg-dim-20 lg:hidden max-lg:bottom-auto max-lg:top-[var(--app-vv-live-top,0px)] max-lg:h-[var(--app-vv-live-height,100dvh)]";

export interface MobileAppSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultActiveId?: SidebarItemId;
}

/** lg 미만 전역 메뉴 드로어 — AppShell 본문 옆·StandaloneHeaderPage 오버레이 공용 */
export function MobileAppSidebarDrawer({
  open,
  onClose,
  defaultActiveId = "series",
}: MobileAppSidebarDrawerProps) {
  return (
    <>
      {open ? (
        <button
          type="button"
          className={MOBILE_SIDEBAR_BACKDROP_CLASS}
          aria-label="메뉴 닫기"
          onClick={onClose}
        />
      ) : null}
      <AppSidebar
        defaultActiveId={defaultActiveId}
        mobileOpen={open}
        onNavigate={onClose}
      />
    </>
  );
}

export { deriveSidebarActiveId };
