"use client";

import React, { useState } from "react";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { MediaResourceDetailPage } from "@/components/resource/MediaResourceDetailPage";

export default function SeriesMediaNewPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <StandaloneHeaderPage
      profileImageUrl={profileImageUrl}
      onProfileImageChange={setProfileImageUrl}
    >
          <MediaResourceDetailPage />
    </StandaloneHeaderPage>
  );
}

