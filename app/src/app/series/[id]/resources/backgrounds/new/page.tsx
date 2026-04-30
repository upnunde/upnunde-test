"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import { ImageResourceDetailPage } from "@/components/resource/ImageResourceDetailPage";

export default function SeriesBackgroundNewPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <ImageResourceDetailPage kind="background" />
        </div>
      </div>
    </div>
  );
}

