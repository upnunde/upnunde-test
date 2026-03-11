"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header/Header";
import { CharacterDetailPage } from "@/components/resource/character/CharacterDetailPage";
import { getCharacterById } from "@/lib/resourceMockData";

export default function SeriesCharacterEditPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const seriesId = typeof params?.id === "string" ? params.id : "";
  const itemId = typeof params?.itemId === "string" ? params.itemId : "";

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
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <CharacterDetailPage isNew={false} initialData={initialData ?? undefined} />
        </div>
      </div>
    </div>
  );
}
