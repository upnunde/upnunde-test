"use client";

/**
 * 내 작품 공통 레이아웃 — /series, /series/character, /series/scenario
 *
 * ⚠️ 회귀 방지: app/src/app/series/page.tsx 를 만들지 마세요 (같은 URL 중복 → 탭·「내 작품」 헤더 소실).
 * 가드: npm run check:routes · .cursor/rules/page-route-guard.mdc
 */

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { PAGE_CONTAINER_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { WORKS_TABS, WORKS_TAB_PATH, getWorksTabFromPathname, type WorksTabId } from "@/lib/worksArea";

export default function MyWorksLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeWorksTab = getWorksTabFromPathname(pathname);

  return (
    <AppShell sidebarActiveId="series">
      <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
        <div className="flex h-[64px] w-full shrink-0 flex-col items-center justify-center border-b border-border-10 bg-white px-my-20">
          <div className={cn(PAGE_CONTAINER_CLASS, "mx-0 flex items-center justify-start gap-my-16")}>
            <h1 className="text-heading2_700 text-on-surface-10">내 작품</h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-0 overflow-y-auto px-my-20 py-0">
          <div className={cn(PAGE_CONTAINER_CLASS, "mx-0")}>
            <div className="inline-flex flex-col items-start justify-start gap-my-8 self-stretch px-0 pb-my-8 pt-my-20">
              <SegmentedTextTabs
                aria-label="내 작품 범주"
                items={WORKS_TABS}
                activeId={activeWorksTab}
                onSelect={(id) => {
                  if (id === "series" || id === "character" || id === "scenario") {
                    router.push(WORKS_TAB_PATH[id as WorksTabId]);
                  }
                }}
                size="xl"
              />
            </div>
          </div>
          <div className={cn(PAGE_CONTAINER_CLASS, "mx-0")}>{children}</div>
        </div>
      </main>
    </AppShell>
  );
}
