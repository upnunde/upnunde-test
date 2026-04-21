"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import type { ChoiceItem, ScriptBlock } from "@/types/editor";
import { useEditorStore } from "@/store/useEditorStore";
import { CHARACTERS, BACKGROUNDS, BGMS } from "@/lib/mockData";
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
}

/** If blocks/focusedBlockId are not passed, reads from useEditorStore (recommended). */
export function PreviewScreen(props: PreviewScreenProps = {}) {
  const storeBlocks = useEditorStore((s) => s.blocks);
  const storeFocusedBlockId = useEditorStore((s) => s.focusBlockId);
  const seriesPersona = useEditorStore((s) => s.seriesPersona);

  const blocks = props.blocks ?? storeBlocks;
  const focusedBlockId = props.focusedBlockId !== undefined ? props.focusedBlockId : storeFocusedBlockId;

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

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-shrink-0 items-stretch justify-stretch overflow-hidden overscroll-none"
      style={{ height: "100%", overflow: "hidden" }}
    >
      {/* Top-left badge: current top_desc (from state up to focused block) */}
      {currentTopDesc && (
        <div
          className="absolute left-3 top-10 z-20 max-w-[calc(100%-24px)] rounded-lg border border-white/20 bg-black/60 px-3 py-2 backdrop-blur-sm"
          role="status"
        >
          <p className="text-xs leading-relaxed text-white/95">
            {currentTopDesc}
          </p>
        </div>
      )}

      {/* Optional: BGM label (state persisted for future audio playback) */}
      {displayBgm && (
        <div
          className="absolute right-3 top-10 z-20 rounded-lg border border-white/20 bg-black/60 px-2 py-1 text-[10px] text-white/80"
          role="status"
          aria-label={`BGM: ${displayBgm}`}
        >
          ♪ {displayBgm}
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
            "absolute bottom-0 left-0 right-0 z-20 mx-3 mb-3 rounded-xl",
            "bg-black/75 backdrop-blur-sm",
            "border-2 border-white/20"
          )}
        >
          {currentSpeaker && currentSpeaker !== "나레이션" && (
            <div className="border-b border-white/10 px-4 py-2">
              <span className="text-sm font-semibold text-amber-300/95">
                {currentSpeaker}
              </span>
            </div>
          )}
          <div className="min-h-[64px] px-4 py-3">
            <p className="text-white/95 text-sm leading-relaxed whitespace-pre-wrap">
              {currentDialogue}
            </p>
          </div>
        </div>
      )}

      {/* Layer 4: Choice preview — visible when focused block is a choice block */}
      {currentChoices.length > 0 && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 z-20 mx-3 mb-3 rounded-xl",
            "bg-black/75 backdrop-blur-sm",
            "border-2 border-white/20 p-2"
          )}
        >
          <div className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-white/70">
            선택지
          </div>
          <div className="flex flex-col gap-2">
            {currentChoices.map((choice, idx) => (
              <div
                key={choice.id || `${choice.text}-${idx}`}
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  {choice.isPaid && (
                    <Image
                      src="/choice-paid-icon.png"
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4 shrink-0"
                    />
                  )}
                  <p className="text-sm leading-relaxed text-white/95">
                    {choice.isAiMode
                      ? "✨ AI 모드로 직접 대화"
                      : (choice.text?.trim() || `선택 ${idx + 1}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
