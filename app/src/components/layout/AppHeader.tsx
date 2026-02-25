"use client";

import { useState } from "react";
import Image from "next/image";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppHeader() {
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex flex-col bg-white w-full shrink-0">
      {/* Top Bar */}
      <div className="border-b border-slate-200">
        <div className="w-full flex h-14 items-center justify-between pl-5 pr-5">
          <div
            className="flex items-center"
            style={{
              height: "100%",
              width: "240px",
              borderRight: "1px solid rgba(0, 0, 0, 0.07)",
              paddingRight: "20px",
              paddingLeft: "0px"
            }}
          >
            <Image
              src="/renovel-logo.png"
              alt="RE:NOVEL Studio"
              width={187}
              height={20}
              className="h-auto"
              style={{
                width: "187px",
                height: "20px"
              }}
              priority
            />
          </div>
          <button
            type="button"
            onClick={() => setProfileDrawerOpen(true)}
            className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="프로필 편집"
          >
            <Avatar className="w-10 h-10 border border-slate-200 hover:opacity-90 transition-opacity">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
      <ProfileEditModal
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
      />
    </header>
  );
}
