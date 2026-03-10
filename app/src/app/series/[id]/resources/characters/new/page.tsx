"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { CharacterDetailPage } from "@/components/resource/character/CharacterDetailPage";

export default function SeriesCharacterNewPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="series" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <CharacterDetailPage isNew />
        </div>
      </div>
    </div>
  );
}

