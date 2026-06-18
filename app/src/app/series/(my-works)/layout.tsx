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
import {
  PAGE_CONTAINER_CLASS,
  PAGE_FILTER_HEADER_INNER_CLASS,
  PAGE_FILTER_HEADER_SHELL_CLASS,
  PAGE_SCROLL_ROOT_CLASS,
  PAGE_SUBHEADER_WITH_FILTER_CLASS,
} from "@/lib/page-layout";
import { CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS } from "@/lib/chip-styles";
import { cn } from "@/lib/utils";
import { WORKS_TABS, WORKS_TAB_PATH, getWorksTabFromPathname } from "@/lib/worksArea";

export default function MyWorksLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeWorksTab = getWorksTabFromPathname(pathname);

  return (
    <AppShell sidebarActiveId="series" className="max-lg:bg-surface-10">
      <div className={PAGE_SUBHEADER_WITH_FILTER_CLASS}>
        <div className={cn(PAGE_CONTAINER_CLASS, "mx-0 flex items-center justify-start gap-my-16")}>
          <h1 className="text-heading2_700 text-on-surface-10">내 작품</h1>
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
          PAGE_SCROLL_ROOT_CLASS,
          PAGE_CONTAINER_CLASS,
          "mx-0 items-center gap-0 max-lg:gap-my-16 max-lg:bg-surface-10 max-lg:pt-my-20",
        )}
      >
        {children}
      </div>
    </AppShell>
  );
}
