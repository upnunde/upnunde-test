"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CharacterList } from "@/components/character/CharacterList";
import { CharacterDeleteModal } from "@/components/character/CharacterDeleteModal";
import {
  ImportCharacterDialog,
  type ImportCharacterApplyPick,
} from "@/components/resource/character/ImportCharacterDialog";
import {
  IMPORT_CHARACTER_SERIES_GROUPS,
  characterResourceToCharacterData,
  collectImportedResourceKeys,
} from "@/lib/importableCharactersMock";
import { consumeMyWorksPendingCharacter } from "@/lib/myWorksCharacterCreate";
import { MY_WORKS_CHARACTERS_MOCK } from "@/lib/myWorksCharactersMock";
import { WORKS_CHARACTER_NEW_PATH } from "@/lib/worksArea";
import type { CharacterData } from "@/types/character";

/**
 * 내 작품 — 캐릭터 목록 (`/series/character`)
 */
export default function WorksCharacterListPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<CharacterData[]>(MY_WORKS_CHARACTERS_MOCK);
  const [characterToDelete, setCharacterToDelete] = useState<CharacterData | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  useEffect(() => {
    const created = consumeMyWorksPendingCharacter();
    if (!created) return;
    setCharacters((prev) => (prev.some((c) => c.id === created.id) ? prev : [...prev, created]));
  }, []);

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

  const handleImportCharacter = useCallback((picked: ImportCharacterApplyPick) => {
    const source = characterResourceToCharacterData(picked);
    setCharacters((prev) => (prev.some((c) => c.id === source.id) ? prev : [...prev, source]));
  }, []);

  const excludeResourceKeys = useMemo(
    () => collectImportedResourceKeys(characters),
    [characters],
  );

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
        onCreateCharacter={() => router.push(WORKS_CHARACTER_NEW_PATH)}
        onImportCharacter={() => setImportModalOpen(true)}
      />

      <ImportCharacterDialog
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        seriesGroups={IMPORT_CHARACTER_SERIES_GROUPS}
        excludeResourceKeys={excludeResourceKeys}
        title="캐릭터 불러오기"
        description="시리즈를 선택한 뒤, 리소스에 등록한 등장인물을 내 작품 캐릭터로 추가해 주세요."
        onApply={handleImportCharacter}
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
