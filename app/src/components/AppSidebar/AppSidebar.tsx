"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  LibraryBig,
  Mail,
  Receipt,
  UserRoundCog,
  X,
} from "lucide-react";
import { SidebarList } from "./SidebarList";
import { Button } from "@/components/ui/button";
import { dummyAsset } from "@/lib/dummy-asset-path";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { id: "series", label: "내 작품", path: "/series" },
  { id: "analytics", label: "분석", path: "/analytics" },
  { id: "settlements", label: "정산", path: "/settlements" },
  { id: "notification", label: "알림", path: "/notifications" },
] as const;
const SIDEBAR_BOTTOM_ITEMS = [
  { id: "profile", label: "내 정보 관리", path: "/profile" },
  { id: "inquiry", label: "문의", path: "/inquiry" },
  { id: "guide", label: "이용가이드", path: "/guide" },
] as const;

type SidebarTopItemId = (typeof SIDEBAR_ITEMS)[number]["id"];
type SidebarBottomItemId = (typeof SIDEBAR_BOTTOM_ITEMS)[number]["id"];
export type SidebarItemId = SidebarTopItemId | SidebarBottomItemId;

const SIDEBAR_ICON_PROPS = {
  className: "shrink-0 opacity-90",
  strokeWidth: 1.75,
  "aria-hidden": true as const,
};

function sidebarIconFor(id: SidebarItemId): React.ReactNode {
  switch (id) {
    case "series":
      return <LibraryBig {...SIDEBAR_ICON_PROPS} />;
    case "analytics":
      return <BarChart3 {...SIDEBAR_ICON_PROPS} />;
    case "settlements":
      return <Receipt {...SIDEBAR_ICON_PROPS} />;
    case "guide":
      return <BookOpen {...SIDEBAR_ICON_PROPS} />;
    case "profile":
      return <UserRoundCog {...SIDEBAR_ICON_PROPS} />;
    case "notification":
      return <Bell {...SIDEBAR_ICON_PROPS} />;
    case "inquiry":
      return <Mail {...SIDEBAR_ICON_PROPS} />;
    default:
      return null;
  }
}

export interface AppSidebarProps {
  /** 초기 선택 메뉴 id (기본: 'series') */
  defaultActiveId?: SidebarItemId;
  /** 메뉴 클릭 시 호출 (선택 사항) */
  onSelect?: (id: SidebarItemId) => void;
  /** 모바일 드로어 열림 (lg 미만) */
  mobileOpen?: boolean;
  /** 라우트 이동 후 모바일 드로어 닫기 */
  onNavigate?: () => void;
}

function deriveActiveId(pathname: string | null, fallback: SidebarItemId): SidebarItemId {
  if (!pathname) return fallback;
  if (pathname.startsWith("/notifications")) return "notification";
  if (pathname.startsWith("/inquiry")) return "inquiry";
  if (pathname.startsWith("/guide")) return "guide";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/settlements")) return "settlements";
  if (pathname.startsWith("/monetization/settlements")) return "settlements";
  if (pathname.startsWith("/series")) return "series";
  return fallback;
}

function AppSidebarMobileHeader({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-10 bg-white pl-my-12 pr-my-16 lg:hidden">
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="flex cursor-pointer items-center"
        aria-label="로그인 화면으로 이동"
      >
        <Image
          src={dummyAsset("renovel-studio-logo.png")}
          alt="RE:NOVEL Studio"
          width={94}
          height={20}
          priority
          className="h-5 w-auto object-contain object-left max-lg:h-4"
        />
      </button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="h-8 w-8 shrink-0"
        onClick={onClose}
        aria-label="메뉴 닫기"
      >
        <X className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}

export default function AppSidebar({
  defaultActiveId = "series",
  onSelect,
  mobileOpen = false,
  onNavigate,
}: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  /** 라우트 경로에서 직접 파생 — 별도의 setState 동기화가 필요 없음 */
  const activeId = deriveActiveId(pathname, defaultActiveId);

  const handleClick = (id: SidebarItemId, path?: string) => {
    onSelect?.(id);
    if (path) {
      router.push(path);
      onNavigate?.();
    }
  };

  const sidebarListItems = SIDEBAR_ITEMS.map(({ id, label }) => ({
    id,
    label,
    icon: sidebarIconFor(id),
  }));
  const sidebarBottomItems = SIDEBAR_BOTTOM_ITEMS.map(({ id, label }) => ({
    id,
    label,
    icon: sidebarIconFor(id),
  }));

  return (
    <nav
      className={cn(
        "flex h-full w-[240px] shrink-0 flex-col border-r border-border-10 bg-white lg:py-my-16",
        "max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:w-full max-lg:max-w-none max-lg:overflow-hidden max-lg:border-r-0",
        !mobileOpen && "max-lg:hidden",
        "lg:relative",
      )}
      aria-label="메인 메뉴"
    >
      <AppSidebarMobileHeader onClose={() => onNavigate?.()} />

      <div className="flex min-h-0 flex-1 flex-col max-lg:overflow-y-auto max-lg:py-my-16 lg:contents">
        <SidebarList
          items={sidebarListItems}
          activeId={activeId}
          onSelect={(id) => {
            const item = SIDEBAR_ITEMS.find((i) => i.id === id);
            if (!item) return;
            handleClick(item.id, item.path);
          }}
          listClassName="flex flex-col gap-0 px-my-8"
        />

        {/* 모바일: 알림 아래 구분선 후 하단 메뉴 순서대로 노출 */}
        <div
          className="mx-my-20 my-my-8 border-t border-border-10 lg:hidden"
          role="separator"
          aria-hidden
        />
        <div className="px-my-8 lg:hidden">
          <SidebarList
            items={sidebarBottomItems}
            activeId={activeId}
            onSelect={(id) => {
              const item = SIDEBAR_BOTTOM_ITEMS.find((i) => i.id === id);
              if (!item) return;
              handleClick(item.id, item.path);
            }}
            listClassName="flex flex-col gap-my-4"
          />
        </div>

        {/* 데스크톱: 하단 고정 */}
        <div className="mt-auto hidden px-my-8 lg:block">
          <SidebarList
            items={sidebarBottomItems}
            activeId={activeId}
            onSelect={(id) => {
              const item = SIDEBAR_BOTTOM_ITEMS.find((i) => i.id === id);
              if (!item) return;
              handleClick(item.id, item.path);
            }}
            listClassName="flex flex-col gap-0"
          />
        </div>
      </div>
    </nav>
  );
}
