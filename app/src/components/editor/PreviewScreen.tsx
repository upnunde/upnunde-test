"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import type { ChoiceItem, ScriptBlock } from "@/types/editor";
import { useEditorStore } from "@/store/useEditorStore";
import { dummyAsset } from "@/lib/dummy-asset-path";
import { CHARACTERS, BACKGROUNDS, BGMS } from "@/lib/mockData";
import { EDITOR_MOBILE_PREVIEW_OVERLAY_BOTTOM_CLASS } from "@/components/editor/editor-mobile-floating-layout";
import {
  PREVIEW_PROGRESS_BADGE_CLASS,
  PREVIEW_TOP_BADGE_CLASS,
  PREVIEW_TOP_BAR_CLASS,
} from "@/lib/preview-overlay-styles";
import { cn } from "@/lib/utils";
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
  // Safety check: return empty state if blocks array is empty or invalid
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

  // Use a dense copy so we never hit undefined in the middle of the array
  const denseBlocks = blocks.filter((b): b is ScriptBlock => b != null && typeof b === "object" && "type" in b);

  // Identify focused block
  const focusedIndex =
    focusedBlockId != null
      ? denseBlocks.findIndex((b) => b.id === focusedBlockId)
      : denseBlocks.length - 1;
  
  const endIdx = focusedIndex >= 0 ? focusedIndex : Math.max(0, denseBlocks.length - 1);
  const focusedBlock = endIdx >= 0 && endIdx < denseBlocks.length ? denseBlocks[endIdx] : null;
  
  // Find the most recent scene block before or at the focused block
  // Resources before a scene block should not be applied to that scene
  let startIdx = 0;
  for (let i = endIdx; i >= 0; i--) {
    if (denseBlocks[i]?.type === "scene") {
      startIdx = i + 1; // Start accumulating resources after the scene block
      break;
    }
  }
  
  // Active blocks: from the most recent scene block (or block 0) to focused block (inclusive)
  const activeBlocks = denseBlocks.slice(startIdx, endIdx + 1);

  // Calculate Persistent State: accumulate resources from activeBlocks (visual only; no speaker)
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
    // Speaker is NOT taken from # character; it comes from the focused text block only.
  });

  // Transient State: speaker and dialogue ONLY from the focused text block
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
  /** 탭으로 다음 블록 진행(모바일 재생 모드) */
  interactive?: boolean;
  /** 모바일 미리보기 상단 진행 표시 (예: 3 / 12) */
  progressLabel?: string;
  onTapAdvance?: () => void;
  onChoiceSelect?: (choice: ChoiceItem) => void;
}

/** If blocks/focusedBlockId are not passed, reads from useEditorStore (recommended). */
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
        "relative flex h-full min-h-0 w-full flex-shrink-0 items-stretch justify-stretch overflow-hidden overscroll-none",
        interactive && currentChoices.length === 0 && "cursor-pointer",
      )}
      style={{ height: "100%", overflow: "hidden" }}
    >
      {(progressLabel || currentTopDesc || displayBgm) && (
        <div className={PREVIEW_TOP_BAR_CLASS}>
          <div className="flex min-w-0 flex-1 items-center gap-my-8">
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

      {/* Layer 1: BG (absolute fill) — from accumulated state up to focused block */}
      <div className="absolute inset-0 z-0">
        {currentBg != null && currentBg !== "" ? (
          <Image
            src={getBackgroundUrl(currentBg)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-slate-800 to-slate-900" />
        )}
      </div>

      {/* Layer 2: Character (centered) — from accumulated state */}
      {currentChar != null && currentChar !== "" && (
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-24 pointer-events-none">
          <Image
            src={getCharacterUrl(currentChar)}
            alt=""
            width={400}
            height={600}
            className="max-h-[55%] max-w-[80%] object-contain w-auto h-auto"
          />
        </div>
      )}

      {/* Layer 3: Visual Novel style text box — speaker from focused text block only; hide nameplate when "나레이션" */}
      {currentDialogue && (
        <div
          className={cn(
            "absolute left-0 right-0 z-20 mx-3 rounded-[4px]",
            interactive
              ? cn("bottom-0 mb-3", EDITOR_MOBILE_PREVIEW_OVERLAY_BOTTOM_CLASS, "max-lg:mb-0")
              : "bottom-0 mb-3",
            "bg-black/75 backdrop-blur-sm",
            "border-2 border-white/20"
          )}
        >
          {currentSpeaker && currentSpeaker !== "나레이션" && (
            <div className="border-b border-white/10 px-my-16 py-my-8">
              <span className="text-body3_500 text-amber-300/95">
                {currentSpeaker}
              </span>
            </div>
          )}
          <div className="min-h-[64px] px-my-16 py-my-12">
            <p className="text-white/95 text-body3_400 whitespace-pre-wrap">
              {currentDialogue}
            </p>
          </div>
        </div>
      )}

      {/* Layer 4: Choice preview — visible when focused block is a choice block */}
      {currentChoices.length > 0 && (
        <div
          className={cn(
            "absolute left-0 right-0 z-20 mx-3 rounded-[4px]",
            interactive
              ? cn("bottom-0 mb-3", EDITOR_MOBILE_PREVIEW_OVERLAY_BOTTOM_CLASS, "max-lg:mb-0")
              : "bottom-0 mb-3",
            "bg-black/75 backdrop-blur-sm",
            "border-2 border-white/20 p-my-8"
          )}
        >
          <div className="mb-2 px-my-8 text-caption2_500 tracking-wide text-white/70">
            선택지
          </div>
          <div className="flex flex-col gap-my-8">
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
                    className="w-full rounded-lg border border-white/15 bg-white/10 px-my-12 py-my-8 text-left transition-colors hover:bg-white/20 active:bg-white/25"
                  >
                    <div className="flex items-center gap-my-8">
                      {choice.isPaid ? (
                        <Image
                          src={dummyAsset("choice-paid-icon.png")}
                          alt=""
                          width={16}
                          height={16}
                          className="h-4 w-4 shrink-0"
                        />
                      ) : null}
                      <p className="text-body3_400 text-white/95">{label}</p>
                    </div>
                  </button>
                );
              }

              return (
                <div
                  key={choice.id || `${choice.text}-${idx}`}
                  className="rounded-lg border border-white/15 bg-white/10 px-my-12 py-my-8"
                >
                  <div className="flex items-center gap-my-8">
                    {choice.isPaid ? (
                      <Image
                        src={dummyAsset("choice-paid-icon.png")}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4 shrink-0"
                      />
                    ) : null}
                    <p className="text-body3_400 text-white/95">{label}</p>
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
