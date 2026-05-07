"use client";

import React from "react";
import { CharacterItem } from "@/components/character/CharacterItem";
import { WorksEmptyCreateButton } from "@/components/works/WorksEmptyCreateButton";
import type { CharacterData } from "@/types/character";
import { WORKS_GRID_CELL_MAX_WIDTH_CLASS } from "@/lib/worksArea";

export interface CharacterListProps {
  characters: CharacterData[];
  onCharacterSettings?: (character: CharacterData) => void;
  onSetPrivate?: (character: CharacterData) => void;
  onSetPublic?: (character: CharacterData) => void;
  onDelete?: (character: CharacterData) => void;
  onCreateCharacter?: () => void;
  className?: string;
}

export function CharacterList({
  characters,
  onCharacterSettings,
  onSetPrivate,
  onSetPublic,
  onDelete,
  onCreateCharacter,
  className,
}: CharacterListProps) {
  const isEmpty = characters.length === 0;

  return (
    <div
      className={`grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-4 ${className ?? ""}`}
    >
      {characters.map((character) => (
        <CharacterItem
          key={character.id}
          character={character}
          onCharacterSettings={onCharacterSettings}
          onSetPrivate={onSetPrivate}
          onSetPublic={onSetPublic}
          onDelete={onDelete}
        />
      ))}
      <div className={isEmpty ? WORKS_GRID_CELL_MAX_WIDTH_CLASS : "min-w-0"}>
        <WorksEmptyCreateButton
          hint="새로운 캐릭터를 등록하세요"
          actionLabel="새 캐릭터 생성"
          onClick={onCreateCharacter}
        />
      </div>
    </div>
  );
}
