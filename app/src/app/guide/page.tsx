"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PAGE_CONTAINER_CLASS } from "@/lib/page-layout";

export default function GuidePage() {
  return (
    <AppShell sidebarActiveId="guide">
      <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
        <div className="flex h-[64px] w-full shrink-0 flex-col items-center justify-center border-b border-border-10 bg-white px-my-20">
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-my-16`}>
            <h1 className="text-heading2_700 text-on-surface-10">가이드</h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-my-12 overflow-y-auto px-my-20 py-my-32">
          <div className={PAGE_CONTAINER_CLASS}>{/* 가이드 콘텐츠 추후 구성 */}</div>
        </div>
      </main>
    </AppShell>
  );
}
