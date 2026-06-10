"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PAGE_CONTAINER_CLASS, PAGE_SCROLL_GUTTER_CLASS, PAGE_STACK_CLASS, PAGE_SUBHEADER_CLASS } from "@/lib/page-layout";

export default function ProfilePage() {
  return (
    <AppShell sidebarActiveId="profile">
      <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
        <div className={PAGE_SUBHEADER_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-my-16`}>
            <h1 className="text-heading2_700 text-on-surface-10">내 정보 관리</h1>
          </div>
        </div>

        <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto py-0 ${PAGE_SCROLL_GUTTER_CLASS}`}>
          <div className={PAGE_STACK_CLASS}>
            <div className="min-h-[400px] rounded-[4px] border border-border-10 bg-surface-10" />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
