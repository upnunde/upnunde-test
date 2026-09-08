"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CharacterChatScreen } from "@/components/character/CharacterChatScreen";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { resolveMyWorksCharacterData } from "@/lib/myWorksCharacterDetail";
import { WORKS_TAB_PATH } from "@/lib/worksArea";
import type { CharacterData } from "@/types/character";

/**
 * 내 작품 — 캐릭터 대화 풀페이지 (`/series/character/[id]/chat`)
 * 모달이 아니라 라우트로 열어 의도치 않은 닫힘을 막는다.
 * 모바일: visualViewport 높이에 맞춰 키보드·브라우저 크롬에 대응.
 */
export default function WorksCharacterChatPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = typeof params.id === "string" ? params.id : "";
  const [character, setCharacter] = useState<CharacterData | undefined>();
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!characterId) {
      setResolved(true);
      return;
    }
    const data = resolveMyWorksCharacterData(characterId);
    setCharacter(data);
    setResolved(true);
    if (!data) {
      router.replace(WORKS_TAB_PATH.character);
    }
  }, [characterId, router]);

  if (!resolved || !character) {
    return null;
  }

  return (
    <StandaloneHeaderPage
      className="max-lg:h-[var(--app-vv-live-height,100dvh)] max-lg:max-h-[var(--app-vv-live-height,100dvh)] max-lg:overflow-hidden"
      sidebarDefaultActiveId="series"
      lockViewport
    >
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden max-lg:h-full lg:h-full">
        <CharacterChatScreen
          character={character}
          onClose={() => router.push(WORKS_TAB_PATH.character)}
        />
      </div>
    </StandaloneHeaderPage>
  );
}
