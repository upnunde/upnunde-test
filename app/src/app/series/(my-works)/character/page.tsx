"use client";

import React, { useCallback, useState } from "react";
import { CharacterList } from "@/components/character/CharacterList";
import { CharacterDeleteModal } from "@/components/character/CharacterDeleteModal";
import { MY_WORKS_CHARACTERS_MOCK } from "@/lib/myWorksCharactersMock";
import type { CharacterData } from "@/types/character";

/**
 * 내 작품 — 캐릭터 목록 (`/series/character`)
 */
export default function WorksCharacterListPage() {
  const [characters, setCharacters] = useState<CharacterData[]>(MY_WORKS_CHARACTERS_MOCK);
  const [characterToDelete, setCharacterToDelete] = useState<CharacterData | null>(null);

  const handleDelete = useCallback((target: CharacterData) => {
    setCharacters((prev) => prev.filter((c) => c.id !== target.id));
  }, []);

  const handleSetPrivate = useCallback((target: CharacterData) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === target.id ? { ...c, status: "PRIVATE" as const } : c))
    );
  }, []);

  const handleSetPublic = useCallback((target: CharacterData) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === target.id ? { ...c, status: "PUBLIC" as const } : c))
    );
  }, []);

  return (
    <>
      <CharacterList
        characters={characters}
        onCharacterSettings={() => {
          // TODO: 캐릭터 설정 화면 연결
        }}
        onSetPrivate={handleSetPrivate}
        onSetPublic={handleSetPublic}
        onDelete={(character) => setCharacterToDelete(character)}
        onCreateCharacter={() => {
          // TODO: 새 캐릭터 생성 플로우
        }}
      />

      <CharacterDeleteModal
        open={!!characterToDelete}
        character={characterToDelete}
        onClose={() => setCharacterToDelete(null)}
        onConfirm={(character) => {
          handleDelete(character);
          setCharacterToDelete(null);
        }}
      />
    </>
  );
}
