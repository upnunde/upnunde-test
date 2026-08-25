"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageCard } from "@/components/layout/PageCard";
import { ReactionTabStrip } from "@/components/reaction/ReactionTabStrip";
import { analyticsScopeFilterShellClassName } from "@/components/analytics/analytics-filter-chips";
import { CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS } from "@/lib/chip-styles";
import {
  PAGE_CONTAINER_CLASS,
  PAGE_DESKTOP_SCROLL_SHELL_CLASS,
  PAGE_FILTER_HEADER_INNER_CLASS,
  PAGE_FILTER_HEADER_SHELL_CLASS,
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  PAGE_SCROLL_ROOT_FLOW_CLASS,
  PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
  PAGE_SUBHEADER_WITH_FILTER_CLASS,
} from "@/lib/page-layout";
import { APP_BROWSER_BG_ROOT_CLASS } from "@/lib/mobile-viewport";
import type { ReactionTab } from "@/types/reaction";
import { cn } from "design-system/utils";

/**
 * 반응 — 댓글·구독자를 모아 보는 화면
 */
export default function ReactionsPage() {
  const [activeTab, setActiveTab] = useState<ReactionTab>("comments");

  return (
    <AppShell sidebarActiveId="reactions" browserBgClassName={APP_BROWSER_BG_ROOT_CLASS}>
      <div className={PAGE_DESKTOP_SCROLL_SHELL_CLASS}>
        <div className={PAGE_SUBHEADER_WITH_FILTER_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
            <h1 className="text-heading2_700 text-foreground">반응</h1>
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
                <ReactionTabStrip
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            PAGE_SCROLL_ROOT_FLOW_CLASS,
            PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
            "items-stretch justify-start gap-0",
          )}
        >
          <div className={cn(PAGE_CONTAINER_CLASS, "flex")}>
            <div className="min-w-0 flex-1">
              <PageCard
                fullWidth
                className="flex h-fit shrink-0 flex-col gap-0 overflow-hidden rounded-sm px-0 pt-2 pb-5 max-lg:rounded-none max-lg:border-0 lg:px-0"
              >
                <p
                  className={cn(
                    PAGE_FLUSH_CONTENT_PAD_X_CLASS,
                    "py-12 text-center text-body3_400 text-foreground-placeholder",
                  )}
                >
                  {activeTab === "comments"
                    ? "댓글 반응이 없습니다"
                    : "구독자 반응이 없습니다"}
                </p>
              </PageCard>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
