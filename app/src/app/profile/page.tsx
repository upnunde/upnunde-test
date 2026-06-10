"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PAGE_CONTAINER_CLASS } from "@/lib/page-layout";

export default function ProfilePage() {
  return (
    <AppShell sidebarActiveId="profile">
      <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
        <div className="flex h-16 w-full shrink-0 items-center justify-center border-b border-border-10 bg-white px-my-20">
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-my-16`}>
            <h1 className="text-heading2_700 text-on-surface-10">내 정보 관리</h1>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-my-20 py-0">
          <div className={`${PAGE_CONTAINER_CLASS} flex flex-col gap-my-20 py-my-20`}>
            <div className="min-h-[400px] rounded-[4px] border border-border-10 bg-surface-10" />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
