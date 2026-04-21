"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarList } from "./SidebarList";

const SIDEBAR_ITEMS = [
  {
    id: "series",
    label: "시리즈",
    path: "/series",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    id: "guide",
    label: "가이드",
    path: "/guide",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    id: "notification",
    label: "알림",
    path: "/notifications",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    id: "inquiry",
    label: "문의",
    path: "/inquiry",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
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

  const sidebarListItems = SIDEBAR_ITEMS.map(({ id, label, icon }) => ({
    id,
    label,
    icon,
  }));

  return (
    <nav className="shrink-0 w-[240px] border-r border-slate-200 bg-white py-4" aria-label="메인 메뉴">
      <SidebarList
        items={sidebarListItems}
        activeId={activeId}
        onSelect={(id) => {
          const item = SIDEBAR_ITEMS.find((i) => i.id === id);
          if (!item) return;
          handleClick(item.id, item.path);
        }}
        listClassName="flex flex-col gap-1 px-2"
      />
    </nav>
  );
}
