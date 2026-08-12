"use client";

/**
 * 내 작품 공통 레이아웃 — /series, /series/character, /series/scenario
 *
 * ⚠️ 회귀 방지: app/src/app/series/page.tsx 를 만들지 마세요 (같은 URL 중복 → 탭·「내 작품」 헤더 소실).
 * 가드: npm run check:routes · .cursor/rules/page-route-guard.mdc
 */

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { analyticsScopeFilterShellClassName } from "@/components/analytics/analytics-filter-chips";
import { AppShell } from "@/components/layout/AppShell";
import { ContentScopeChipGroup } from "@/components/shared/ContentScopeChipGroup";
import { APP_BROWSER_BG_ROOT_CLASS } from "@/lib/mobile-viewport";
import {
  PAGE_CONTAINER_CLASS,
  PAGE_CONTENT_PAD_X_CLASS,
  PAGE_FILTER_HEADER_INNER_CLASS,
  PAGE_FILTER_HEADER_SHELL_CLASS,
  PAGE_SCROLL_ROOT_TRANSPARENT_CLASS,
  PAGE_SUBHEADER_WITH_FILTER_CLASS,
} from "@/lib/page-layout";
import { CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS } from "@/lib/chip-styles";
import { cn } from "design-system/utils";
import { WORKS_TABS, WORKS_TAB_PATH, getWorksTabFromPathname } from "@/lib/worksArea";

export default function MyWorksLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeWorksTab = getWorksTabFromPathname(pathname);

  return (
    <AppShell sidebarActiveId="series" browserBgClassName={APP_BROWSER_BG_ROOT_CLASS}>
      <div className={PAGE_SUBHEADER_WITH_FILTER_CLASS}>
        <div className={cn(PAGE_CONTAINER_CLASS, "flex items-center justify-start gap-4")}>
          <h1 className="text-heading2_700 text-foreground">내 작품</h1>
        </div>
      </div>

      <div className={PAGE_FILTER_HEADER_SHELL_CLASS}>
        <div className={PAGE_FILTER_HEADER_INNER_CLASS}>
          <div className={analyticsScopeFilterShellClassName}>
            <div
              className={cn(
                "flex w-full items-center overflow-x-auto",
                CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS,
              )}
            >
              <ContentScopeChipGroup
                items={WORKS_TABS}
                activeId={activeWorksTab}
                onSelect={(id) => router.push(WORKS_TAB_PATH[id])}
                ariaLabel="내 작품 범주"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          PAGE_SCROLL_ROOT_TRANSPARENT_CLASS,
          PAGE_CONTENT_PAD_X_CLASS,
          "w-full min-w-0 max-w-[1200px] mx-auto lg:max-w-none",
          "items-center gap-0 max-lg:gap-4 max-lg:pt-5",
        )}
      >
        {children}
      </div>
    </AppShell>
  );
}
