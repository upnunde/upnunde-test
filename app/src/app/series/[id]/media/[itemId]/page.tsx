"use client";

import React, { useState, useEffect, useMemo } from "react";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { useRouter, usePathname } from "next/navigation";
import { MediaResourceDetailPage } from "@/components/resource/MediaResourceDetailPage";
import { getMediaById } from "@/lib/resourceMockData";

export default function SeriesMediaEditPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { seriesId, itemId } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return {
      seriesId: segments[1] ?? "",
      itemId: segments[segments.length - 1] ?? "",
    };
  }, [pathname]);

  const initialData = itemId ? getMediaById(itemId) : undefined;

  useEffect(() => {
    if (itemId && !initialData) {
      router.replace(`/series/${seriesId}/resources`);
    }
  }, [itemId, initialData, seriesId, router]);

  if (itemId && !initialData) {
    return null;
  }

  return (
    <StandaloneHeaderPage
      profileImageUrl={profileImageUrl}
      onProfileImageChange={setProfileImageUrl}
    >
          <MediaResourceDetailPage initialData={initialData ?? undefined} />
    </StandaloneHeaderPage>
  );
}
