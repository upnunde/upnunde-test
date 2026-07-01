"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import type { ChoiceItem, ScriptBlock } from "@/types/editor";
import { useEditorStore } from "@/store/useEditorStore";
import { dummyAsset } from "@/lib/dummy-asset-path";
import { CHARACTERS, BACKGROUNDS, BGMS } from "@/lib/mockData";
import { EDITOR_MOBILE_PREVIEW_OVERLAY_BOTTOM_CLASS } from "@/components/editor/editor-mobile-floating-layout";
import {
  PREVIEW_BG_IMAGE_CLASS,
  PREVIEW_BG_LAYER_CLASS,
  PREVIEW_CHARACTER_IMAGE_CLASS,
  PREVIEW_CHARACTER_LAYER_CLASS,
  PREVIEW_CHOICE_ITEM_CLASS,
  PREVIEW_CHOICE_ITEM_INTERACTIVE_CLASS,
  PREVIEW_CHOICE_ITEM_TEXT_CLASS,
  PREVIEW_CHOICE_SECTION_LABEL_CLASS,
  PREVIEW_DIALOGUE_BODY_CLASS,
  PREVIEW_DIALOGUE_SHELL_CLASS,
  PREVIEW_DIALOGUE_TEXT_CLASS,
  PREVIEW_EMPTY_SCENE_BG_CLASS,
  PREVIEW_OVERLAY_DIVIDER_CLASS,
  PREVIEW_OVERLAY_PANEL_POSITION_CLASS,
  PREVIEW_PROGRESS_BADGE_CLASS,
  PREVIEW_ROOT_CLASS,
  PREVIEW_SPEAKER_TEXT_CLASS,
  PREVIEW_TOP_BADGE_CLASS,
  PREVIEW_TOP_BAR_CLASS,
} from "@/lib/preview-overlay-styles";
import { cn } from "design-system/utils";
import { resolveSpeakerDisplay } from "@/lib/speakerPersona";

const EMPTY_RESOURCE = ["none", "선택 안함", "선택 안됨", ""];

function isEmptyResource(content: string | undefined): boolean {
  const v = content?.trim();
  return !v || EMPTY_RESOURCE.includes(v);
}

/** Remove inline control tags like <effect=...>, </effect>, <color=...> for preview-only text */
function stripInlineTags(content: string | undefined): string {
  if (!content) return "";
  return content.replace(/<[^>]*>/g, "");
}

/** Resolve background name to image URL from mock data, or fallback */
function getBackgroundUrl(name: string): string {
  const item = BACKGROUNDS.find((b) => b.name === name);
  if (item) return item.url;
  const fallback = pickFallbackBySeed(BACKGROUNDS, name, "__bg_fallback__");
  return fallback?.url ?? "";
}

/** Resolve character name to image URL from mock data, or fallback */
function getCharacterUrl(name: string): string {
  const item = CHARACTERS.find((c) => c.name === name);
  if (item) return item.url;
  const fallback = pickFallbackBySeed(CHARACTERS, name, "__char_fallback__");
  return fallback?.url ?? "";
}

/** Unknown resource는 등록된 리소스 풀에서 시드 기반으로 랜덤 선택 */
function pickFallbackBySeed<T>(
  items: T[],
  seedValue: string | undefined,
  fallbackSeed: string
): T | null {
  if (items.length === 0) return null;
  const seed = (seedValue?.trim() || fallbackSeed);
  const idx = Math.abs(hashString(seed)) % items.length;
  return items[idx] ?? items[0] ?? null;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function resolveBgmName(name: string | null): string | null {
  if (!name) return null;
  const matched = BGMS.find((b) => b.name === name);
  if (matched) return matched.name;
  const fallback = pickFallbackBySeed(BGMS, name, "__bgm_fallback__");
  return fallback?.name ?? null;
}

function previewOverlayPositionClass(interactive: boolean) {
  return cn(
    PREVIEW_OVERLAY_PANEL_POSITION_CLASS,
    interactive && cn(EDITOR_MOBILE_PREVIEW_OVERLAY_BOTTOM_CLASS, "max-lg:mb-0"),
  );
}

export interface AccumulatedState {
  currentBg: string | null;
  currentBgm: string | null;
  currentChar: string | null;
  currentSpeaker: string;
  currentTopDesc: string;
  currentDialogue: string;
  currentChoices: ChoiceItem[];
}

/**
 * State machine: Separates Persistent State (Resources) from Transient State (Dialogue).
 *
 * - Persistent State (BG, BGM, Character, Top Desc): Accumulated from block 0 to focused block.
 *   Resources persist until explicitly changed or cleared.
 *
 * - Transient State (Dialogue): ONLY visible when the focused block is a 'text' block.
 *   If focus moves to a resource block, dialogue disappears entirely.
 */
function computeAccumulatedState(
  blocks: ScriptBlock[],
  focusedBlockId: string | null,
  seriesPersona: string
): AccumulatedState {
  if (!blocks || blocks.length === 0) {
    return {
      currentBg: null,
      currentBgm: null,
      currentChar: null,
      currentSpeaker: "",
      currentTopDesc: "",
      currentDialogue: "",
      currentChoices: [],
    };
  }

  const denseBlocks = blocks.filter((b): b is ScriptBlock => b != null && typeof b === "object" && "type" in b);

  const focusedIndex =
    focusedBlockId != null
      ? denseBlocks.findIndex((b) => b.id === focusedBlockId)
      : denseBlocks.length - 1;

  const endIdx = focusedIndex >= 0 ? focusedIndex : Math.max(0, denseBlocks.length - 1);
  const focusedBlock = endIdx >= 0 && endIdx < denseBlocks.length ? denseBlocks[endIdx] : null;

  let startIdx = 0;
  for (let i = endIdx; i >= 0; i--) {
    if (denseBlocks[i]?.type === "scene") {
      startIdx = i + 1;
      break;
    }
  }

  const activeBlocks = denseBlocks.slice(startIdx, endIdx + 1);

  let currentBg: string | null = null;
  let currentBgm: string | null = null;
  let currentChar: string | null = null;
  let currentTopDesc = "";

  activeBlocks.forEach((block) => {
    if (!block) return;

    if (block.type === "background") {
      currentBg = isEmptyResource(block.content) ? null : (block.content?.trim() ?? null);
    }
    if (block.type === "bgm") {
      currentBgm = isEmptyResource(block.content) ? null : (block.content?.trim() ?? null);
    }
    if (block.type === "top_desc") {
      currentTopDesc = stripInlineTags(block.content?.trim() ?? "");
    }
    if (block.type === "character") {
      currentChar = isEmptyResource(block.content) ? null : (block.content?.trim() ?? null);
    }
  });

  const currentSpeaker =
    focusedBlock?.type === "text"
      ? resolveSpeakerDisplay(focusedBlock.data?.speaker, seriesPersona)
      : "";
  const currentDialogue =
    focusedBlock?.type === "text" ? stripInlineTags(focusedBlock.content ?? "") : "";
  const currentChoices =
    focusedBlock?.type === "choice" && Array.isArray(focusedBlock.data?.choices)
      ? focusedBlock.data.choices
      : [];

  return {
    currentBg,
    currentBgm,
    currentChar,
    currentSpeaker,
    currentTopDesc,
    currentDialogue,
    currentChoices,
  };
}

export interface PreviewScreenProps {
  blocks?: ScriptBlock[];
  focusedBlockId?: string | null;
  interactive?: boolean;
  progressLabel?: string;
  onTapAdvance?: () => void;
  onChoiceSelect?: (choice: ChoiceItem) => void;
}

export function PreviewScreen(props: PreviewScreenProps = {}) {
  const storeBlocks = useEditorStore((s) => s.blocks);
  const storeFocusedBlockId = useEditorStore((s) => s.focusBlockId);
  const seriesPersona = useEditorStore((s) => s.seriesPersona);

  const blocks = props.blocks ?? storeBlocks;
  const focusedBlockId = props.focusedBlockId !== undefined ? props.focusedBlockId : storeFocusedBlockId;
  const { interactive = false, progressLabel, onTapAdvance, onChoiceSelect } = props;

  const state = useMemo(
    () => computeAccumulatedState(blocks, focusedBlockId, seriesPersona),
    [blocks, focusedBlockId, seriesPersona]
  );
  const {
    currentBg,
    currentBgm,
    currentChar,
    currentSpeaker,
    currentTopDesc,
    currentDialogue,
    currentChoices,
  } = state;
  const displayBgm = resolveBgmName(currentBgm);

  const handleRootClick = () => {
    if (!interactive || currentChoices.length > 0) return;
    onTapAdvance?.();
  };

  const handleRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || currentChoices.length > 0) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTapAdvance?.();
    }
  };

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive && currentChoices.length === 0 ? 0 : undefined}
      aria-label={interactive ? "다음으로 진행" : undefined}
      onClick={interactive ? handleRootClick : undefined}
      onKeyDown={interactive ? handleRootKeyDown : undefined}
      className={cn(
        PREVIEW_ROOT_CLASS,
        interactive && currentChoices.length === 0 && "cursor-pointer",
      )}
    >
      {(progressLabel || currentTopDesc || displayBgm) && (
        <div className={PREVIEW_TOP_BAR_CLASS}>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {progressLabel ? (
              <span className={PREVIEW_PROGRESS_BADGE_CLASS}>{progressLabel}</span>
            ) : null}
            {currentTopDesc ? (
              <div className={cn(PREVIEW_TOP_BADGE_CLASS, "min-w-0 max-w-full")} role="status">
                <p className="truncate">{currentTopDesc}</p>
              </div>
            ) : null}
          </div>
          {displayBgm ? (
            <div
              className={cn(PREVIEW_TOP_BADGE_CLASS, "shrink-0")}
              role="status"
              aria-label={`BGM: ${displayBgm}`}
            >
              <span className="truncate">♪ {displayBgm}</span>
            </div>
          ) : null}
        </div>
      )}

      <div className={PREVIEW_BG_LAYER_CLASS}>
        {currentBg != null && currentBg !== "" ? (
          <Image
            src={getBackgroundUrl(currentBg)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className={PREVIEW_BG_IMAGE_CLASS}
          />
        ) : (
          <div className={PREVIEW_EMPTY_SCENE_BG_CLASS} />
        )}
      </div>

      {currentChar != null && currentChar !== "" && (
        <div className={PREVIEW_CHARACTER_LAYER_CLASS}>
          <Image
            src={getCharacterUrl(currentChar)}
            alt=""
            width={400}
            height={600}
            className={PREVIEW_CHARACTER_IMAGE_CLASS}
          />
        </div>
      )}

      {currentDialogue && (
        <div
          className={cn(
            previewOverlayPositionClass(interactive),
            PREVIEW_DIALOGUE_SHELL_CLASS,
          )}
        >
          {currentSpeaker && currentSpeaker !== "나레이션" && (
            <div className={cn("px-4 py-2", PREVIEW_OVERLAY_DIVIDER_CLASS)}>
              <span className={PREVIEW_SPEAKER_TEXT_CLASS}>{currentSpeaker}</span>
            </div>
          )}
          <div className={PREVIEW_DIALOGUE_BODY_CLASS}>
            <p className={PREVIEW_DIALOGUE_TEXT_CLASS}>{currentDialogue}</p>
          </div>
        </div>
      )}

      {currentChoices.length > 0 && (
        <div
          className={cn(
            previewOverlayPositionClass(interactive),
            PREVIEW_DIALOGUE_SHELL_CLASS,
            "p-2",
          )}
        >
          <div className={PREVIEW_CHOICE_SECTION_LABEL_CLASS}>선택지</div>
          <div className="flex flex-col gap-2">
            {currentChoices.map((choice, idx) => {
              const label = choice.isAiMode
                ? "✨ AI 모드로 직접 대화"
                : (choice.text?.trim() || `선택 ${idx + 1}`);

              if (interactive) {
                return (
                  <button
                    key={choice.id || `${choice.text}-${idx}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onChoiceSelect?.(choice);
                    }}
                    className={cn(PREVIEW_CHOICE_ITEM_CLASS, PREVIEW_CHOICE_ITEM_INTERACTIVE_CLASS)}
                  >
                    <div className="flex items-center gap-2">
                      {choice.isPaid ? (
                        <Image
                          src={dummyAsset("choice-paid-icon.png")}
                          alt=""
                          width={16}
                          height={16}
                          className="size-4 shrink-0"
                        />
                      ) : null}
                      <p className={PREVIEW_CHOICE_ITEM_TEXT_CLASS}>{label}</p>
                    </div>
                  </button>
                );
              }

              return (
                <div key={choice.id || `${choice.text}-${idx}`} className={PREVIEW_CHOICE_ITEM_CLASS}>
                  <div className="flex items-center gap-2">
                    {choice.isPaid ? (
                      <Image
                        src={dummyAsset("choice-paid-icon.png")}
                        alt=""
                        width={16}
                        height={16}
                        className="size-4 shrink-0"
                      />
                    ) : null}
                    <p className={PREVIEW_CHOICE_ITEM_TEXT_CLASS}>{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
