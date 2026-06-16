"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/chip";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CHIP_GROUP_GAP_CLASS } from "@/lib/chip-styles";
import {
  IMPORTABLE_CHARACTERS,
  importedResourceKey,
  type ImportCharacterSeriesGroup,
  type ImportableCharacterPick,
} from "@/lib/importableCharactersMock";
import type { CharacterSourceSeries } from "@/types/character";
import { THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";
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
  /** 이미 불러온 리소스 등장인물 키 (`seriesId:resourceCharacterId`) — 목록에서 제외 */
  excludeResourceKeys?: ReadonlySet<string> | readonly string[];
}

export function ImportCharacterDialog({
  open,
  onOpenChange,
  onApply,
  characters = IMPORTABLE_CHARACTERS,
  seriesGroups,
  title = "캐릭터 가져오기",
  description = "내 작품 캐릭터 중 하나를 선택해 등장인물 정보에 반영해 주세요.",
  excludeResourceKeys,
}: ImportCharacterDialogProps) {
  const [selectedImportCharacterId, setSelectedImportCharacterId] = useState<string | null>(null);
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);

  const excludedKeys = useMemo(
    () => new Set(excludeResourceKeys ?? []),
    [excludeResourceKeys],
  );

  const isExcluded = useCallback(
    (character: ImportableCharacterPick, seriesId?: string) => {
      if (!seriesId) return excludedKeys.has(character.id);
      return excludedKeys.has(importedResourceKey(seriesId, character.id));
    },
    [excludedKeys],
  );

  const availableSeriesGroups = useMemo(() => {
    if (!seriesGroups?.length) return null;
    return seriesGroups
      .map((group) => ({
        ...group,
        characters: group.characters.filter((character) => !isExcluded(character, group.seriesId)),
      }))
      .filter((group) => group.characters.length > 0);
  }, [seriesGroups, isExcluded]);

  const availableCharacters = useMemo(
    () => characters.filter((character) => !isExcluded(character)),
    [characters, isExcluded],
  );

  const activeGroup = useMemo(
    () =>
      availableSeriesGroups?.find((group) => group.seriesId === activeSeriesId) ??
      availableSeriesGroups?.[0] ??
      null,
    [activeSeriesId, availableSeriesGroups],
  );

  const visibleCharacters: ImportableCharacterPick[] = activeGroup?.characters ?? availableCharacters;

  const resolvedId = useMemo(() => {
    if (selectedImportCharacterId && visibleCharacters.some((c) => c.id === selectedImportCharacterId)) {
      return selectedImportCharacterId;
    }
    return visibleCharacters[0]?.id ?? null;
  }, [selectedImportCharacterId, visibleCharacters]);

  useEffect(() => {
    if (!open) return;
    if (availableSeriesGroups?.length) {
      const firstGroup = availableSeriesGroups[0]!;
      setActiveSeriesId(firstGroup.seriesId);
      setSelectedImportCharacterId(firstGroup.characters[0]?.id ?? null);
      return;
    }
    setActiveSeriesId(null);
    setSelectedImportCharacterId(availableCharacters[0]?.id ?? null);
  }, [open, availableSeriesGroups, availableCharacters]);

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
      const group = availableSeriesGroups?.find((item) => item.seriesId === seriesId);
      setSelectedImportCharacterId(group?.characters[0]?.id ?? null);
    },
    [availableSeriesGroups],
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

  const showSeriesFilter = Boolean(availableSeriesGroups && availableSeriesGroups.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="flex w-full max-h-[90vh] min-h-0 max-lg:max-w-none flex-col gap-0 overflow-hidden lg:rounded-[4px] border border-border-10 bg-white p-0 lg:max-w-2xl">
        <div className="border-b border-border-10/5 px-my-20 py-my-12">
          <DialogTitle className="text-body1_700 text-on-surface-10">{title}</DialogTitle>
          <p className="mt-1 text-body3_400 text-on-surface-30">{description}</p>
        </div>

        {showSeriesFilter && (
          <div className="border-b border-border-10/5 px-my-20 pb-my-12 pt-0">
            <div
              className={cn(
                "inline-flex w-full min-w-0 flex-wrap items-center overflow-x-auto",
                CHIP_GROUP_GAP_CLASS
              )}
              role="tablist"
              aria-label="시리즈 선택"
            >
              {availableSeriesGroups!.map((group) => {
                const isActive =
                  group.seriesId === (activeGroup?.seriesId ?? availableSeriesGroups![0]?.seriesId);
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

        <div className="min-h-0 flex-1 overflow-y-auto px-my-20 py-my-16">
          {visibleCharacters.length === 0 ? (
            <p className="py-my-32 text-center text-body3_400 text-on-surface-30">
              {showSeriesFilter
                ? "불러올 수 있는 등장인물이 없어요. 이미 모두 내 작품에 추가했거나 이 시리즈에 등록된 인물이 없어요."
                : "불러올 수 있는 캐릭터가 없어요."}
            </p>
          ) : (
            <div className="flex flex-col gap-my-12">
              {visibleCharacters.map((character) => {
                const selected = character.id === resolvedId;
                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => setSelectedImportCharacterId(character.id)}
                    className={`flex w-full items-center gap-my-12 rounded-[4px] border px-my-12 py-my-12 text-left transition-colors ${
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
                      <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body3_700 text-on-surface-10">{character.name}</p>
                      <p className="mt-1 line-clamp-2 text-body3_400 text-on-surface-30">{character.summary}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-my-8 border-t border-border-10/5 px-my-20 py-my-12">
          <Button
            type="button"
            variant="outline"
            className="h-my-36 min-h-my-36 rounded-md bg-white px-my-12 text-body3_400 text-on-surface-10 hover:bg-surface-20 disabled:border-border-20 lg:h-8 lg:min-h-8"
            onClick={() => handleDialogOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            className="h-my-36 min-h-my-36 rounded-md bg-slate-800 px-my-12 text-body3_400 text-white hover:bg-slate-700 lg:h-8 lg:min-h-8"
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
