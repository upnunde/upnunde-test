"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_VIEWPORT_SHELL_CLASS } from "@/lib/mobile-viewport";
import Header from "@/components/Header/Header";
import { CharacterDetailPage } from "@/components/resource/character/CharacterDetailPage";

export default function SeriesCharacterNewPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <div className={cn(APP_VIEWPORT_SHELL_CLASS, "bg-white")}>
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <CharacterDetailPage isNew />
        </div>
      </div>
    </div>
  );
}

