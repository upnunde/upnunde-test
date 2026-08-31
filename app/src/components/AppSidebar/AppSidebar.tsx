"use client";

import { useRouter, usePathname } from "next/navigation";
import { ICONS, Icon, type LucideIcon } from "@/lib/icons";
import { IconButton } from "@/components/ui/icon-button";
import { RenovelStudioLogo } from "@/components/brand/RenovelStudioLogo";
import { WORKS_TAB_PATH } from "@/lib/worksArea";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "design-system/ui/sidebar";
import { cn } from "design-system/utils";

const SIDEBAR_ITEMS = [
  { id: "series", label: "내 작품", path: "/series" },
  { id: "analytics", label: "통계 분석", path: "/analytics" },
  { id: "reactions", label: "반응", path: "/reactions" },
  { id: "settlements", label: "수익 정산", path: "/settlements" },
] as const;
/** 문의는 설정 > 서비스 문의로 이동 — 사이드바에서는 노출하지 않는다. */
const SIDEBAR_BOTTOM_ITEMS = [
  { id: "profile", label: "설정", path: "/profile" },
  { id: "notification", label: "알림", path: "/notifications" },
  { id: "guide", label: "이용가이드", path: "/guide" },
] as const;

type SidebarTopItemId = (typeof SIDEBAR_ITEMS)[number]["id"];
type SidebarBottomItemId = (typeof SIDEBAR_BOTTOM_ITEMS)[number]["id"];
export type SidebarItemId = SidebarTopItemId | SidebarBottomItemId;

function sidebarIconFor(id: SidebarItemId): LucideIcon {
  switch (id) {
    case "series":
      return ICONS.libraryBig;
    case "analytics":
      return ICONS.barChart3;
    case "reactions":
      return ICONS.heart;
    case "settlements":
      return ICONS.circleWon;
    case "profile":
      return ICONS.settings;
    case "guide":
      return ICONS.bookOpen;
    case "notification":
      return ICONS.bell;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
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

export function deriveSidebarActiveId(pathname: string | null, fallback: SidebarItemId): SidebarItemId {
  if (!pathname) return fallback;
  // 문의는 설정 하위 진입점이라 설정 메뉴를 활성으로 둔다
  if (pathname.startsWith("/profile") || pathname.startsWith("/inquiry")) return "profile";
  if (pathname.startsWith("/notifications")) return "notification";
  if (pathname.startsWith("/guide")) return "guide";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/management") || pathname.startsWith("/comments") || pathname.startsWith("/reactions")) {
    return "reactions";
  }
  if (pathname.startsWith("/settlements")) return "settlements";
  if (pathname.startsWith("/monetization/settlements")) return "settlements";
  if (pathname.startsWith("/series")) return "series";
  return fallback;
}

function AppSidebarMobileHeader({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  // 글로벌 헤더의 [햄버거][로고] 좌측 배치와 동일하게 — 여는 햄버거 자리에 닫기(X)가 스왑되어 오고, 로고는 원위치 유지
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background pl-3 pr-3 lg:hidden">
      {/* 글로벌 헤더 '메뉴 열기' IconButton과 동일 스펙(ghost·circle·icon-xl) — 아이콘만 menu→close 스왑 */}
      <IconButton
        type="button"
        variant="ghost"
        shape="circle"
        size="icon-xl"
        icon={ICONS.close}
        onClick={onClose}
        className="text-foreground-muted"
        aria-label="메뉴 닫기"
      />
      <button
        type="button"
        onClick={() => router.push(WORKS_TAB_PATH.series)}
        className="flex cursor-pointer items-center"
        aria-label="내 작품으로 이동"
      >
        <RenovelStudioLogo />
      </button>
    </div>
  );
}

function AppSidebarMenu({
  items,
  activeId,
  onSelect,
}: {
  items: readonly { id: SidebarItemId; label: string; path: string }[];
  activeId: SidebarItemId;
  onSelect: (id: SidebarItemId, path: string) => void;
}) {
  return (
    <SidebarGroup className="px-2">
      <SidebarMenu>
        {items.map(({ id, label, path }) => (
          <SidebarMenuItem key={id}>
            <SidebarMenuButton
              isActive={activeId === id}
              onClick={() => onSelect(id, path)}
            >
              <Icon icon={sidebarIconFor(id)} size="xl" />
              {label}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
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
  const activeId = deriveSidebarActiveId(pathname, defaultActiveId);

  const handleClick = (id: SidebarItemId, path: string) => {
    onSelect?.(id);
    router.push(path);
    onNavigate?.();
  };

  return (
    <nav
      className={cn(
        "flex h-full w-[240px] shrink-0 flex-col border-r border-border bg-background lg:py-4",
        "max-lg:fixed max-lg:inset-0 max-lg:z-modal max-lg:w-full max-lg:max-w-none max-lg:overflow-hidden max-lg:border-r-0",
        !mobileOpen && "max-lg:hidden",
        "lg:relative",
      )}
      aria-label="메인 메뉴"
    >
      <AppSidebarMobileHeader onClose={() => onNavigate?.()} />

      <div className="flex min-h-0 flex-1 flex-col max-lg:overflow-y-auto max-lg:py-4 lg:contents">
        <AppSidebarMenu
          items={SIDEBAR_ITEMS}
          activeId={activeId}
          onSelect={handleClick}
        />

        {/* 모바일: 본 메뉴 아래 구분선 후 하단 메뉴 순서대로 노출 */}
        <div
          className="mx-5 my-2 border-t border-border lg:hidden"
          role="separator"
          aria-hidden
        />
        <div className="lg:hidden">
          <AppSidebarMenu
            items={SIDEBAR_BOTTOM_ITEMS}
            activeId={activeId}
            onSelect={handleClick}
          />
        </div>

        {/* 데스크톱: 하단 고정 */}
        <div className="mt-auto hidden lg:block">
          <AppSidebarMenu
            items={SIDEBAR_BOTTOM_ITEMS}
            activeId={activeId}
            onSelect={handleClick}
          />
        </div>
      </div>
    </nav>
  );
}
