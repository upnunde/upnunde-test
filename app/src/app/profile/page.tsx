"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";

export default function ProfilePage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <AppSidebar defaultActiveId="profile" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <div className="flex h-16 w-full shrink-0 items-center justify-center border-b border-border-10 bg-white px-5">
              <div className="flex w-full max-w-[1200px] items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-on-surface-10">내 정보 관리</h1>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-0">
              <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 py-5">
                <div className="min-h-[400px] rounded-[4px] border border-border-10 bg-surface-10" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
