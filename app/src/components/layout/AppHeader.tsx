"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dummyAsset } from "@/lib/dummy-asset-path";
import { loadProfileSettings, PROFILE_UPDATED_EVENT } from "@/lib/profile-storage";

export function AppHeader() {
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setAvatarUrl(loadProfileSettings().public.avatarUrl);
    sync();
    window.addEventListener(PROFILE_UPDATED_EVENT, sync);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, sync);
  }, []);

  return (
    <header className="sticky top-0 z-sticky flex flex-col bg-background w-full shrink-0">
      {/* Top Bar */}
      <div className="border-b border-border">
        <div className="w-full flex h-14 items-center justify-between pl-3 pr-3 lg:pl-5 lg:pr-5">
          <div
            className="flex h-full w-[240px] items-center border-r border-border pl-0 pr-5"
          >
            <Image
              src={dummyAsset("renovel-logo.png")}
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
            <Avatar className="w-9 h-9 border border-border hover:opacity-90 transition-opacity">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt="Profile" /> : null}
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
