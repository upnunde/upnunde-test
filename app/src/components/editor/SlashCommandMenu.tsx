"use client";

import { useEffect, useRef } from "react";
import {
  Image,
  Music,
  User,
  Film,
  ImagePlus,
  ListChecks,
  Heading,
  Sparkles,
} from "lucide-react";
import type { BlockType } from "@/types/editor";
import { cn } from "@/lib/utils";
import {
  BACKGROUNDS,
  CHARACTERS,
  BGMS,
  SFX,
} from "@/lib/mockData";
import { useEditorStore } from "@/store/useEditorStore";

export type SlashSelectPayload =
  | BlockType
  | { type: BlockType; content: string; data?: { isNew?: boolean } };

export interface SlashCommandMenuProps {
  position: { top: number; left: number };
  onSelect: (payload: SlashSelectPayload) => void;
  onClose: () => void;
  targetBlockId: string;
}

/** 문장 내 안내문구(PICKER_LABEL_KO)와 동일한 한글 라벨 */
const ALL_OPTIONS: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: "scene", label: "씬", icon: Heading },
  { type: "top_desc", label: "상황정보", icon: Film },
  { type: "background", label: "배경", icon: Image },
  { type: "bgm", label: "BGM", icon: Music },
  { type: "sfx", label: "SFX", icon: Music },
  { type: "character", label: "캐릭터", icon: User },
  { type: "gallery", label: "갤러리", icon: ImagePlus },
  { type: "choice", label: "선택", icon: ListChecks },
  { type: "event", label: "이벤트", icon: Sparkles },
  { type: "event_end", label: "이벤트 종료", icon: Sparkles },
];

function getDefaultPayloadForType(
  type: BlockType
): { type: BlockType; content: string; data: { isNew: true } } | null {
  switch (type) {
    case "background":
      return BACKGROUNDS[0]
        ? { type: "background", content: BACKGROUNDS[0].name, data: { isNew: true } }
        : null;
    case "character":
      return CHARACTERS[0]
        ? { type: "character", content: CHARACTERS[0].name, data: { isNew: true } }
        : null;
    case "bgm":
      return BGMS[0]
        ? { type: "bgm", content: BGMS[0].name, data: { isNew: true } }
        : null;
    case "sfx":
      return SFX[0]
        ? { type: "sfx", content: SFX[0].name, data: { isNew: true } }
        : null;
    default:
      return null;
  }
}

export function SlashCommandMenu({
  position,
  onSelect,
  onClose,
  targetBlockId,
}: SlashCommandMenuProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Calculate isEventActive: check blocks above the target block
  const targetIndex = blocks.findIndex((b) => b.id === targetBlockId);
  const precedingBlocks = targetIndex >= 0 ? blocks.slice(0, targetIndex) : [];
  const lastEventBlock = [...precedingBlocks].reverse().find(
    (b) => b.type === "event" || b.type === "event_end"
  );
  const isEventActive = lastEventBlock?.type === "event";

  // Filter options based on event state
  const OPTIONS = ALL_OPTIONS.filter((option) => {
    if (isEventActive) {
      // If event is active, hide "event" option
      return option.type !== "event";
    } else {
      // If no event is active, hide "event_end" option
      return option.type !== "event_end";
    }
  });

  // 기본 포커스: 메뉴 열리면 첫 항목에 포커스
  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, OPTIONS.length);
    buttonRefs.current[0]?.focus();
  }, [OPTIONS.length]);

  const handleOptionKeyDown = (index: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(index + 1, OPTIONS.length - 1);
      buttonRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(index - 1, 0);
      buttonRefs.current[prev]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // Calculate adjusted position to keep menu within viewport
  const menuWidth = 200; // min-w-[200px]
  const menuHeight = OPTIONS.length * 40 + 8; // Approximate height (py-1 = 4px top/bottom)
  const padding = 8; // Padding from viewport edges
  
  const adjustedPosition = (() => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 1080;
    
    let { top, left } = position;
    
    // Adjust horizontal position: ensure menu doesn't go off right edge
    if (left + menuWidth + padding > viewportWidth) {
      left = viewportWidth - menuWidth - padding;
    }
    // Ensure menu doesn't go off left edge
    if (left < padding) {
      left = padding;
    }
    
    // Adjust vertical position: ensure menu doesn't go off bottom edge
    if (top + menuHeight + padding > viewportHeight) {
      // Try to show above cursor instead
      top = position.top - menuHeight - 4; // 4px gap
      // If still off screen, align to bottom
      if (top < padding) {
        top = viewportHeight - menuHeight - padding;
      }
    }
    // Ensure menu doesn't go off top edge
    if (top < padding) {
      top = padding;
    }
    
    return { top, left };
  })();

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed z-50 min-w-[200px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        style={{ top: adjustedPosition.top, left: adjustedPosition.left }}
        role="listbox"
      >
        {OPTIONS.map(({ type, label, icon: Icon }, index) => (
          <button
            key={type}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="option"
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
              "hover:bg-slate-100 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-inset"
            )}
            onClick={() => {
              const defaultPayload = getDefaultPayloadForType(type);
              if (defaultPayload) {
                onSelect(defaultPayload);
              } else {
                onSelect(type);
              }
            }}
            onKeyDown={(e) => handleOptionKeyDown(index, e)}
          >
            <Icon className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="text-slate-800">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
