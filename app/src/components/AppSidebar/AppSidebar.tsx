"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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

export default function AppSidebar({ defaultActiveId = "series", onSelect }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<SidebarItemId>(defaultActiveId);

  useEffect(() => {
    if (!pathname) return;
    const idFromPath =
      pathname.startsWith("/notifications")
        ? "notification"
        : pathname.startsWith("/inquiry")
          ? "inquiry"
          : pathname.startsWith("/guide")
            ? "guide"
            : pathname.startsWith("/series")
              ? "series"
              : undefined;
    if (idFromPath) setActiveId(idFromPath);
  }, [pathname]);

  const handleClick = (id: SidebarItemId, path?: string) => {
    setActiveId(id);
    onSelect?.(id);
    if (path) router.push(path);
  };

  return (
    <nav className="shrink-0 w-[200px] border-r border-slate-200 bg-white py-4" aria-label="메인 메뉴">
      <ul className="flex flex-col gap-1 px-2">
        {SIDEBAR_ITEMS.map((item) => {
          const isFocused = activeId === item.id;
          const path = item.path;
          return (
            <li key={item.id}>
              <button
                type="button"
                data-state={isFocused ? "focused" : undefined}
                onClick={() => handleClick(item.id, path)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isFocused ? "text-primary" : "text-slate-700"
                }`}
                aria-current={isFocused ? "page" : undefined}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5" aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
