"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { CharacterDetailPage } from "@/components/resource/character/CharacterDetailPage";
import { resolveMyWorksCharacterDetail } from "@/lib/myWorksCharacterDetail";
import { WORKS_TAB_PATH } from "@/lib/worksArea";
import type { CharacterResource } from "@/types/resource";

/** 내 작품 — 캐릭터 설정 (`/series/character/[id]`) */
export default function WorksCharacterEditPage() {
  const [initialData, setInitialData] = useState<CharacterResource | undefined>();
  const [resolved, setResolved] = useState(false);
  const router = useRouter();
  const params = useParams();
  const characterId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!characterId) {
      setResolved(true);
      return;
    }

    const data = resolveMyWorksCharacterDetail(characterId);
    setInitialData(data);
    setResolved(true);
    if (!data) {
      router.replace(WORKS_TAB_PATH.character);
    }
  }, [characterId, router]);

  if (!resolved || (characterId && !initialData)) {
    return null;
  }

  return (
    <StandaloneHeaderPage>
      <CharacterDetailPage
        isNew={false}
        context="my-works"
        initialData={initialData}
      />
    </StandaloneHeaderPage>
  );
}
