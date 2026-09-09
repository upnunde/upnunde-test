"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CharacterList } from "@/components/character/CharacterList";
import { CharacterDeleteModal } from "@/components/character/CharacterDeleteModal";
import { CharacterDetailPreviewModal } from "@/components/character/CharacterDetailPreviewModal";
import {
  ImportCharacterDialog,
  type ImportCharacterApplyPick,
} from "@/components/resource/character/ImportCharacterDialog";
import { PolicyAgreementModal } from "@/components/series/PolicyAgreementModal";
import { Snackbar } from "@/components/episode/Snackbar";
import {
  WorksVisibilityConfirmDialog,
  type WorksVisibilityAction,
} from "@/components/works/WorksVisibilityConfirmDialog";
import {
  IMPORT_CHARACTER_SERIES_GROUPS,
  characterResourceToCharacterData,
  collectImportedResourceKeys,
} from "@/lib/importableCharactersMock";
import { consumeMyWorksPendingCharacter } from "@/lib/myWorksCharacterCreate";
import { stageMyWorksCharacterEdit } from "@/lib/myWorksCharacterDetail";
import { MY_WORKS_CHARACTERS_MOCK } from "@/lib/myWorksCharactersMock";
import {
  getWorksCharacterChatPath,
  getWorksCharacterEditPath,
  WORKS_CHARACTER_NEW_PATH,
} from "@/lib/worksArea";
import type { CharacterData } from "@/types/character";

/**
 * 내 작품 — 캐릭터 목록 (`/series/character`)
 */
export default function WorksCharacterListPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<CharacterData[]>(MY_WORKS_CHARACTERS_MOCK);
  const [characterToDelete, setCharacterToDelete] = useState<CharacterData | null>(null);
  const [detailCharacter, setDetailCharacter] = useState<CharacterData | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [visibilityTarget, setVisibilityTarget] = useState<CharacterData | null>(null);
  const [visibilityAction, setVisibilityAction] = useState<WorksVisibilityAction | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    const created = consumeMyWorksPendingCharacter();
    if (!created) return;
    setCharacters((prev) => (prev.some((c) => c.id === created.id) ? prev : [...prev, created]));
  }, []);

  const showSnackbar = useCallback((message: string) => {
    setSnackbar({ open: true, message });
  }, []);

  const openSettings = useCallback(
    (character: CharacterData) => {
      stageMyWorksCharacterEdit(character);
      router.push(getWorksCharacterEditPath(character.id));
    },
    [router],
  );

  const openChat = useCallback(
    (character: CharacterData) => {
      router.push(getWorksCharacterChatPath(character.id));
    },
    [router],
  );

  const handleDelete = useCallback(
    (target: CharacterData) => {
      if (detailCharacter?.id === target.id) setDetailCharacter(null);
      setCharacters((prev) => prev.filter((c) => c.id !== target.id));
      showSnackbar("캐릭터를 삭제했습니다");
    },
    [detailCharacter?.id, showSnackbar],
  );

  const requestVisibility = useCallback((target: CharacterData, action: WorksVisibilityAction) => {
    setVisibilityTarget(target);
    setVisibilityAction(action);
  }, []);

  const handleConfirmVisibility = useCallback(() => {
    if (!visibilityTarget || !visibilityAction) return;
    const nextStatus = visibilityAction === "private" ? "PRIVATE" : "PUBLIC";
    setCharacters((prev) =>
      prev.map((c) => (c.id === visibilityTarget.id ? { ...c, status: nextStatus } : c)),
    );
    showSnackbar(
      visibilityAction === "private"
        ? "캐릭터를 비공개로 전환했습니다"
        : "캐릭터를 공개했습니다",
    );
    setVisibilityTarget(null);
    setVisibilityAction(null);
  }, [showSnackbar, visibilityAction, visibilityTarget]);

  const handleImportCharacter = useCallback(
    (picked: ImportCharacterApplyPick) => {
      const source = characterResourceToCharacterData(picked);
      setCharacters((prev) => (prev.some((c) => c.id === source.id) ? prev : [...prev, source]));
      showSnackbar("캐릭터를 불러왔습니다");
    },
    [showSnackbar],
  );

  const handleCreateCharacter = useCallback(() => {
    router.push(WORKS_CHARACTER_NEW_PATH);
  }, [router]);

  const excludeResourceKeys = useMemo(
    () => collectImportedResourceKeys(characters),
    [characters],
  );

  return (
    <>
      <CharacterList
        characters={characters}
        onCharacterSettings={openSettings}
        onViewDetail={setDetailCharacter}
        onStartChat={openChat}
        onSetPrivate={(character) => requestVisibility(character, "private")}
        onSetPublic={(character) => requestVisibility(character, "public")}
        onDelete={setCharacterToDelete}
        onCreateCharacter={() => setPolicyModalOpen(true)}
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

      <CharacterDetailPreviewModal
        open={!!detailCharacter}
        character={detailCharacter}
        onOpenChange={(open) => {
          if (!open) setDetailCharacter(null);
        }}
        onStartChat={openChat}
        onOpenSettings={openSettings}
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

      <WorksVisibilityConfirmDialog
        open={!!visibilityTarget && !!visibilityAction}
        action={visibilityAction}
        entityLabel="캐릭터"
        onOpenChange={(open) => {
          if (!open) {
            setVisibilityTarget(null);
            setVisibilityAction(null);
          }
        }}
        onConfirm={handleConfirmVisibility}
      />

      <PolicyAgreementModal
        open={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        onConfirm={handleCreateCharacter}
      />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </>
  );
}
