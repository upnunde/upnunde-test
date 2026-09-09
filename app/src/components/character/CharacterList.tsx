"use client";

import React from "react";
import { CharacterItem } from "@/components/character/CharacterItem";
import { WorksEmptyCreateButton } from "@/components/works/WorksEmptyCreateButton";
import type { CharacterData } from "@/types/character";
import { WORKS_LIST_CREATE_SLOT_CLASS, WORKS_LIST_GRID_CLASS } from "@/lib/worksArea";

export interface CharacterListProps {
  characters: CharacterData[];
  onCharacterSettings?: (character: CharacterData) => void;
  onViewDetail?: (character: CharacterData) => void;
  onStartChat?: (character: CharacterData) => void;
  onSetPrivate?: (character: CharacterData) => void;
  onSetPublic?: (character: CharacterData) => void;
  onDelete?: (character: CharacterData) => void;
  onCreateCharacter?: () => void;
  onImportCharacter?: () => void;
  className?: string;
}

export function CharacterList({
  characters,
  onCharacterSettings,
  onViewDetail,
  onStartChat,
  onSetPrivate,
  onSetPublic,
  onDelete,
  onCreateCharacter,
  onImportCharacter,
  className,
}: CharacterListProps) {
  const isEmpty = characters.length === 0;

  return (
    <div className={`${WORKS_LIST_GRID_CLASS} ${className ?? ""}`}>
      {characters.map((character) => (
        <CharacterItem
          key={character.id}
          character={character}
          onCharacterSettings={onCharacterSettings}
          onViewDetail={onViewDetail}
          onStartChat={onStartChat}
          onSetPrivate={onSetPrivate}
          onSetPublic={onSetPublic}
          onDelete={onDelete}
        />
      ))}
      <div className={WORKS_LIST_CREATE_SLOT_CLASS}>
        <WorksEmptyCreateButton
          hint={isEmpty ? "새로운 캐릭터를 등록하세요" : "캐릭터를 더 추가하세요"}
          actionLabel={isEmpty ? "새 캐릭터 생성" : "캐릭터 추가"}
          onClick={onCreateCharacter}
          secondaryActionLabel="캐릭터 불러오기"
          onSecondaryClick={onImportCharacter}
        />
      </div>
    </div>
  );
}
