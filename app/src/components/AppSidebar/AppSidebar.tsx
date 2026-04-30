"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarList } from "./SidebarList";

const SIDEBAR_ITEMS = [
  { id: "series", label: "내 작품", path: "/series" },
  { id: "analytics", label: "분석", path: "/analytics" },
  { id: "guide", label: "가이드", path: "/guide" },
  { id: "notification", label: "알림", path: "/notifications" },
  { id: "inquiry", label: "문의", path: "/inquiry" },
] as const;

export type SidebarItemId = (typeof SIDEBAR_ITEMS)[number]["id"];

export interface AppSidebarProps {
  /** 초기 선택 메뉴 id (기본: 'series') */
  defaultActiveId?: SidebarItemId;
  /** 메뉴 클릭 시 호출 (선택 사항) */
  onSelect?: (id: SidebarItemId) => void;
}

function deriveActiveId(pathname: string | null, fallback: SidebarItemId): SidebarItemId {
  if (!pathname) return fallback;
  if (pathname.startsWith("/notifications")) return "notification";
  if (pathname.startsWith("/inquiry")) return "inquiry";
  if (pathname.startsWith("/guide")) return "guide";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/series")) return "series";
  return fallback;
}

export default function AppSidebar({ defaultActiveId = "series", onSelect }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  /** 라우트 경로에서 직접 파생 — 별도의 setState 동기화가 필요 없음 */
  const activeId = deriveActiveId(pathname, defaultActiveId);

  const handleClick = (id: SidebarItemId, path?: string) => {
    onSelect?.(id);
    if (path) router.push(path);
  };

  const sidebarListItems = SIDEBAR_ITEMS.map(({ id, label }) => ({ id, label }));

  return (
    <nav className="shrink-0 w-[240px] border-r border-border-10 bg-white py-4" aria-label="메인 메뉴">
      <SidebarList
        items={sidebarListItems}
        activeId={activeId}
        onSelect={(id) => {
          const item = SIDEBAR_ITEMS.find((i) => i.id === id);
          if (!item) return;
          handleClick(item.id, item.path);
        }}
        listClassName="flex flex-col gap-0 px-2"
      />
    </nav>
  );
}
