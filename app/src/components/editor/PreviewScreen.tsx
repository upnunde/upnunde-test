"use client";

import React, { useMemo } from "react";
import type { ScriptBlock } from "@/types/editor";
import { useEditorStore } from "@/store/useEditorStore";
import { CHARACTERS, BACKGROUNDS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const EMPTY_RESOURCE = ["none", "선택 안함", "선택 안됨", ""];

function isEmptyResource(content: string | undefined): boolean {
  const v = content?.trim();
  return !v || EMPTY_RESOURCE.includes(v);
}

/** Resolve background name to image URL from mock data, or fallback */
function getBackgroundUrl(name: string): string {
  const item = BACKGROUNDS.find((b) => b.name === name);
  return item ? item.url : `https://picsum.photos/seed/${encodeURIComponent(name)}/400/700`;
}

/** Resolve character name to image URL from mock data, or fallback */
function getCharacterUrl(name: string): string {
  const item = CHARACTERS.find((c) => c.name === name);
  return item ? item.url : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

export interface AccumulatedState {
  currentBg: string | null;
  currentBgm: string | null;
  currentChar: string | null;
  currentSpeaker: string;
  currentTopDesc: string;
  currentDialogue: string;
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
  focusedBlockId: string | null
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
      currentTopDesc = block.content?.trim() ?? "";
    }
    if (block.type === "character") {
      currentChar = isEmptyResource(block.content) ? null : (block.content?.trim() ?? null);
    }
    // Speaker is NOT taken from # character; it comes from the focused text block only.
  });

  // Transient State: speaker and dialogue ONLY from the focused text block
  const currentSpeaker =
    focusedBlock?.type === "text" ? (focusedBlock.data?.speaker ?? "독백") : "";
  const currentDialogue =
    focusedBlock?.type === "text" ? (focusedBlock.content ?? "") : "";

  return {
    currentBg,
    currentBgm,
    currentChar,
    currentSpeaker,
    currentTopDesc,
    currentDialogue,
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

  const blocks = props.blocks ?? storeBlocks;
  const focusedBlockId = props.focusedBlockId !== undefined ? props.focusedBlockId : storeFocusedBlockId;

  const state = useMemo(
    () => computeAccumulatedState(blocks, focusedBlockId),
    [blocks, focusedBlockId]
  );
  const {
    currentBg,
    currentBgm,
    currentChar,
    currentSpeaker,
    currentTopDesc,
    currentDialogue,
  } = state;

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-shrink-0 items-stretch justify-stretch overflow-hidden overscroll-none"
      style={{ height: "100%", overflow: "hidden" }}
    >
      {/* Smartphone frame: fills parent (300×652), rounded corners, black border, notch */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem] border-[8px] border-slate-800",
          "bg-black",
          "h-full w-full min-h-0 min-w-0"
        )}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 top-0 z-30 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black"
          aria-hidden
        />

        {/* Top-left badge: current top_desc (from state up to focused block) */}
        {currentTopDesc && (
          <div
            className="absolute left-3 top-8 z-20 max-w-[calc(100%-24px)] rounded-lg border border-white/20 bg-black/60 px-3 py-2 backdrop-blur-sm"
            role="status"
          >
            <p className="text-xs leading-relaxed text-white/95">
              {currentTopDesc}
            </p>
          </div>
        )}

        {/* Optional: BGM label (state persisted for future audio playback) */}
        {currentBgm && (
          <div
            className="absolute right-3 top-8 z-20 rounded-lg border border-white/20 bg-black/60 px-2 py-1 text-[10px] text-white/80"
            role="status"
            aria-label={`BGM: ${currentBgm}`}
          >
            ♪ {currentBgm}
          </div>
        )}

        {/* Layer 1: BG (absolute fill) — from accumulated state up to focused block */}
        <div className="absolute inset-0 z-0">
          {currentBg != null && currentBg !== "" ? (
            <img
              src={getBackgroundUrl(currentBg)}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-slate-800 to-slate-900" />
          )}
        </div>

        {/* Layer 2: Character (centered) — from accumulated state */}
        {currentChar != null && currentChar !== "" && (
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-24 pointer-events-none">
            <img
              src={getCharacterUrl(currentChar)}
              alt=""
              className="max-h-[55%] max-w-[80%] object-contain"
            />
          </div>
        )}

        {/* Layer 3: Visual Novel style text box — speaker from focused text block only; hide nameplate when "독백" */}
        {currentDialogue && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 z-20 mx-3 mb-3 rounded-xl",
              "bg-black/75 backdrop-blur-sm",
              "border-2 border-white/20"
            )}
          >
            {currentSpeaker && currentSpeaker !== "독백" && (
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
      </div>
    </div>
  );
}
