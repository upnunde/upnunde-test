"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PAGE_CONTAINER_CLASS, PAGE_SCROLL_GUTTER_CLASS, PAGE_SUBHEADER_CLASS } from "@/lib/page-layout";

export default function GuidePage() {
  return (
    <AppShell sidebarActiveId="guide">
      <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
        <div className={PAGE_SUBHEADER_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-my-16`}>
            <h1 className="text-heading2_700 text-on-surface-10">가이드</h1>
          </div>
        </div>

        <div className={`flex flex-1 flex-col items-center gap-my-12 overflow-y-auto py-my-32 ${PAGE_SCROLL_GUTTER_CLASS}`}>
          <div className={PAGE_CONTAINER_CLASS}>{/* 가이드 콘텐츠 추후 구성 */}</div>
        </div>
      </main>
    </AppShell>
  );
}
