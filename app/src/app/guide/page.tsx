"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PAGE_CONTAINER_CLASS, PAGE_SCROLL_ROOT_CLASS, PAGE_SUBHEADER_WITH_STICKY_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

export default function GuidePage() {
  return (
    <AppShell sidebarActiveId="guide">
      <div className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
            <h1 className="text-heading2_700 text-foreground">가이드</h1>
          </div>
        </div>

        <div className={cn(PAGE_SCROLL_ROOT_CLASS, "items-center gap-3")}>
          <div className={PAGE_CONTAINER_CLASS}>{/* 가이드 콘텐츠 추후 구성 */}</div>
        </div>
    </AppShell>
  );
}
