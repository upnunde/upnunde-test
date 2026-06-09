"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/chip";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CHIP_GROUP_GAP_CLASS } from "@/lib/chip-styles";
import {
  IMPORTABLE_CHARACTERS,
  type ImportCharacterSeriesGroup,
  type ImportableCharacterPick,
} from "@/lib/importableCharactersMock";
import type { CharacterSourceSeries } from "@/types/character";
import { cn } from "@/lib/utils";

export type { ImportableCharacterPick };

export type ImportCharacterApplyPick = ImportableCharacterPick & {
  sourceSeries?: CharacterSourceSeries;
};

export interface ImportCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (character: ImportCharacterApplyPick) => void;
  /** 기본: 등장인물 등록 화면(내 작품 → 리소스). 내 작품 탭에서는 시리즈 그룹 전달 */
  characters?: ImportableCharacterPick[];
  seriesGroups?: ImportCharacterSeriesGroup[];
  title?: string;
  /** 기본: 등장인물 등록 화면용. 내 작품 목록 등에서 문구만 바꿀 때 사용 */
  description?: string;
}

export function ImportCharacterDialog({
  open,
  onOpenChange,
  onApply,
  characters = IMPORTABLE_CHARACTERS,
  seriesGroups,
  title = "캐릭터 가져오기",
  description = "내 작품 캐릭터 중 하나를 선택해 등장인물 정보에 반영해 주세요.",
}: ImportCharacterDialogProps) {
  const [selectedImportCharacterId, setSelectedImportCharacterId] = useState<string | null>(null);
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);

  const activeGroup = useMemo(
    () => seriesGroups?.find((group) => group.seriesId === activeSeriesId) ?? seriesGroups?.[0] ?? null,
    [activeSeriesId, seriesGroups]
  );

  const visibleCharacters = activeGroup?.characters ?? characters;

  const resolvedId = selectedImportCharacterId ?? visibleCharacters[0]?.id ?? null;

  useEffect(() => {
    if (!open) return;
    if (seriesGroups?.length) {
      const firstGroup = seriesGroups[0]!;
      setActiveSeriesId(firstGroup.seriesId);
      setSelectedImportCharacterId(firstGroup.characters[0]?.id ?? null);
      return;
    }
    setActiveSeriesId(null);
    setSelectedImportCharacterId(characters[0]?.id ?? null);
  }, [open, seriesGroups, characters]);

  const handleDialogOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setSelectedImportCharacterId(null);
        setActiveSeriesId(null);
      }
      onOpenChange(next);
    },
    [onOpenChange]
  );

  const handleSeriesChange = useCallback(
    (seriesId: string) => {
      setActiveSeriesId(seriesId);
      const group = seriesGroups?.find((item) => item.seriesId === seriesId);
      setSelectedImportCharacterId(group?.characters[0]?.id ?? null);
    },
    [seriesGroups]
  );

  const handleApply = useCallback(() => {
    const selected = visibleCharacters.find((character) => character.id === resolvedId);
    if (!selected) return;

    onApply({
      ...selected,
      sourceSeries: activeGroup
        ? { id: activeGroup.seriesId, title: activeGroup.seriesTitle }
        : undefined,
    });
    handleDialogOpenChange(false);
  }, [visibleCharacters, resolvedId, activeGroup, onApply, handleDialogOpenChange]);

  const showSeriesFilter = Boolean(seriesGroups && seriesGroups.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-[680px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border-10 bg-white p-0">
        <div className="border-b border-border-10/5 px-5 py-3">
          <DialogTitle className="text-base font-bold leading-6 text-on-surface-10">{title}</DialogTitle>
          <p className="mt-1 text-sm text-on-surface-30">{description}</p>
        </div>

        {showSeriesFilter && (
          <div className="border-b border-border-10/5 px-5 py-3">
            <div
              className={cn(
                "inline-flex w-full min-w-0 flex-wrap items-center overflow-x-auto",
                CHIP_GROUP_GAP_CLASS
              )}
              role="tablist"
              aria-label="시리즈 선택"
            >
              {seriesGroups!.map((group) => {
                const isActive = group.seriesId === (activeGroup?.seriesId ?? seriesGroups![0]?.seriesId);
                return (
                  <FilterChip
                    key={group.seriesId}
                    role="tab"
                    aria-selected={isActive}
                    selected={isActive}
                    chipSize="m"
                    className="max-w-full min-w-0"
                    onClick={() => handleSeriesChange(group.seriesId)}
                  >
                    <span className="block truncate">{group.seriesTitle}</span>
                  </FilterChip>
                );
              })}
            </div>
          </div>
        )}

        <div className="max-h-[420px] overflow-y-auto px-5 py-4">
          {visibleCharacters.length === 0 ? (
            <p className="py-8 text-center text-sm text-on-surface-30">
              이 시리즈에 등록된 등장인물이 없어요.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {visibleCharacters.map((character) => {
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
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border-10/5 px-5 py-3">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-md bg-white px-3 text-sm text-on-surface-10 hover:bg-surface-20 disabled:border-border-20"
            onClick={() => handleDialogOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            className="h-8 rounded-md bg-slate-800 px-3 text-sm text-white hover:bg-slate-700"
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
