"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IMPORTABLE_CHARACTERS } from "@/lib/importableCharactersMock";
import type { CharacterResource } from "@/types/resource";

export type ImportableCharacterPick = Pick<CharacterResource, "id" | "name" | "summary" | "imageUrl">;

export interface ImportCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (character: ImportableCharacterPick) => void;
}

export function ImportCharacterDialog({ open, onOpenChange, onApply }: ImportCharacterDialogProps) {
  const [selectedImportCharacterId, setSelectedImportCharacterId] = useState<string | null>(null);

  const resolvedId = selectedImportCharacterId ?? IMPORTABLE_CHARACTERS[0]?.id ?? null;

  const handleDialogOpenChange = useCallback(
    (next: boolean) => {
      if (!next) setSelectedImportCharacterId(null);
      onOpenChange(next);
    },
    [onOpenChange]
  );

  const handleApply = useCallback(() => {
    const selected = IMPORTABLE_CHARACTERS.find((c) => c.id === resolvedId);
    if (!selected) return;
    onApply(selected);
    handleDialogOpenChange(false);
  }, [resolvedId, onApply, handleDialogOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-[680px] max-w-[calc(100vw-2rem)] rounded-[4px] border border-border-10 bg-white p-0">
        <div className="border-b border-border-10/5 px-5 py-3">
          <DialogTitle className="text-base font-bold leading-6 text-on-surface-10">캐릭터 가져오기</DialogTitle>
          <p className="mt-1 text-sm text-on-surface-30">
            내 작품 캐릭터 중 하나를 선택해 등장인물 정보에 반영해 주세요.
          </p>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-3">
            {IMPORTABLE_CHARACTERS.map((character) => {
              const selected = character.id === resolvedId;
              return (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => setSelectedImportCharacterId(character.id)}
                  className={`flex w-full items-center gap-3 rounded-[4px] border px-3 py-3 text-left transition-colors ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border-10 bg-white hover:bg-surface-20"
                  }`}
                >
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded border border-border-10 bg-surface-20">
                    <Image
                      src={character.imageUrl}
                      alt={character.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-on-surface-10">{character.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-on-surface-30">{character.summary}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border-10/5 px-5 py-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-md border-border-10 bg-white px-3 text-sm text-on-surface-10 hover:bg-surface-20"
            onClick={() => handleDialogOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            className="h-9 rounded-md bg-slate-800 px-3 text-sm text-white hover:bg-slate-700"
            onClick={handleApply}
            disabled={!resolvedId}
          >
            적용하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
