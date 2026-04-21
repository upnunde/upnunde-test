"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import { ImageResourceDetailPage } from "@/components/resource/ImageResourceDetailPage";
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
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <ImageResourceDetailPage kind="media" initialData={initialData ?? undefined} />
        </div>
      </div>
    </div>
  );
}
