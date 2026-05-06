"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";

export default function MonetizationPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <AppSidebar defaultActiveId="monetization" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <div className="flex h-[64px] w-full shrink-0 flex-col items-center justify-center border-b border-border-10 bg-white px-5">
              <div className="flex w-full max-w-[1200px] items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-on-surface-10">수익창출</h1>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-stretch justify-start gap-0 overflow-y-auto px-5 py-0">
              <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col py-10">
                <p className="text-base font-medium text-on-surface-20">수익창출 화면은 준비 중이에요.</p>
                <p className="mt-2 text-sm text-on-surface-30">곧 정산·수익 인사이트를 확인할 수 있어요.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
