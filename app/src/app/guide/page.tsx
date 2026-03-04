"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";

export default function GuidePage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="guide" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            {/* Sub Header */}
            <div className="w-full h-[80px] shrink-0 border-b border-slate-200 bg-white flex flex-col items-center justify-center">
              <div className="w-full max-w-[1200px] min-w-[800px] p-0 flex items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-slate-900">가이드</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-3">
              {/* 가이드 콘텐츠 추후 구성 */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
