"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PAGE_CONTAINER_CLASS, PAGE_SCROLL_ROOT_CLASS, PAGE_STACK_CLASS, PAGE_SUBHEADER_WITH_STICKY_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

export default function ProfilePage() {
  return (
    <AppShell sidebarActiveId="profile">
      <div className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
        <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
          <h1 className="text-heading2_700 text-foreground">내 정보 관리</h1>
        </div>
      </div>

      <div className={cn(PAGE_SCROLL_ROOT_CLASS, "items-stretch justify-start gap-0")}>
        <div className={PAGE_STACK_CLASS}>
          <div className="min-h-[400px] rounded-sm border border-border bg-background" />
        </div>
      </div>
    </AppShell>
  );
}
