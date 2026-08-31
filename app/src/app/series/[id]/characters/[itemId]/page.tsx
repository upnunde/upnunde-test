"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { CharacterDetailPage } from "@/components/resource/character/CharacterDetailPage";
import { getCharacterById } from "@/lib/resourceMockData";

export default function SeriesCharacterEditPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { seriesId, itemId } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return {
      seriesId: segments[1] ?? "",
      itemId: segments[segments.length - 1] ?? "",
    };
  }, [pathname]);

  const initialData = itemId ? getCharacterById(itemId) : undefined;

  useEffect(() => {
    if (itemId && !initialData) {
      router.replace(`/series/${seriesId}/resources`);
    }
  }, [itemId, initialData, seriesId, router]);

  if (itemId && !initialData) {
    return null;
  }

  return (
    <StandaloneHeaderPage>
      <CharacterDetailPage isNew={false} initialData={initialData ?? undefined} />
    </StandaloneHeaderPage>
  );
}
