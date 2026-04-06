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
  Clapperboard,
} from "lucide-react";
import type { BlockType } from "@/types/editor";
import { cn } from "@/lib/utils";
import {
  BACKGROUNDS,
  CHARACTERS,
  BGMS,
  SFX,
  VIDEOS,
  GALLERIES,
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
  { type: "scene", label: "씬추가", icon: Heading },
  { type: "top_desc", label: "장면정보", icon: Clapperboard },
  { type: "background", label: "배경", icon: Image },
  { type: "bgm", label: "배경음악", icon: Music },
  { type: "sfx", label: "효과음", icon: Music },
  { type: "character", label: "캐릭터", icon: User },
  { type: "gallery", label: "갤러리", icon: ImagePlus },
  { type: "video", label: "동영상", icon: Film },
  { type: "choice", label: "선택지", icon: ListChecks },
  { type: "event", label: "씬 전환", icon: Sparkles },
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
    case "video":
      return VIDEOS[0]
        ? { type: "video", content: VIDEOS[0].name, data: { isNew: true } }
        : null;
    case "gallery":
      return GALLERIES[0]
        ? { type: "gallery", content: GALLERIES[0].name, data: { isNew: true } }
        : null;
    case "event":
      return { type: "event", content: "", data: { isNew: true } };
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
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const OPTIONS = ALL_OPTIONS;

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
        className="fixed inset-0 z-40 cursor-pointer"
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
              "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm",
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
            <Icon className="h-4 w-4 shrink-0 text-on-surface-30" />
            <span className="text-on-surface-10">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
