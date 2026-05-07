"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { WORKS_TABS, WORKS_TAB_PATH, getWorksTabFromPathname, type WorksTabId } from "@/lib/worksArea";

export default function MyWorksLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const activeWorksTab = getWorksTabFromPathname(pathname);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <AppSidebar defaultActiveId="series" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <div className="w-full h-[64px] shrink-0 border-b border-border-10 bg-white flex flex-col items-center justify-center px-5">
              <div className="w-full max-w-[1200px] flex items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-on-surface-10">내 작품</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col items-center py-0 gap-0 px-5">
              <div className="w-full max-w-[1200px] mx-0">
                <div className="inline-flex flex-col items-start justify-start gap-2.5 self-stretch px-0 pb-2.5 pt-5">
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
              <div className="w-full max-w-[1200px] mx-0">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
