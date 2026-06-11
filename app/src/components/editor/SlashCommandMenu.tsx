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
  MessageSquareText,
} from "lucide-react";
import type { BlockType } from "@/types/editor";
import { MOBILE_BOTTOM_SHEET_PAD_CLASS } from "@/lib/mobile-viewport";
import { cn } from "@/lib/utils";
import {
  BACKGROUNDS,
  CHARACTERS,
  BGMS,
  SFX,
  VIDEOS,
  GALLERIES,
} from "@/lib/mockData";

export type SlashSelectPayload =
  | BlockType
  | { type: BlockType; content: string; data?: { isNew?: boolean } }
  | { action: "add_sentence" };

type SlashMenuOption =
  | { id: "add_sentence"; label: string; icon: React.ElementType }
  | { id: BlockType; type: BlockType; label: string; icon: React.ElementType };

export type SlashCommandMenuPresentation = "popover" | "sheet";

export interface SlashCommandMenuProps {
  position: { top: number; left: number };
  onSelect: (payload: SlashSelectPayload) => void;
  onClose: () => void;
  /** 모바일: 하단 시트 / 데스크톱: 커서 근처 팝오버 */
  presentation?: SlashCommandMenuPresentation;
  /** 향후 블록 단위 컨텍스트 식별용 (현재는 미사용) */
  targetBlockId?: string;
}

/** 문장 내 안내문구(PICKER_LABEL_KO)와 동일한 한글 라벨 */
const BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: "scene", label: "장면추가", icon: Heading },
  { type: "top_desc", label: "장면정보", icon: Clapperboard },
  { type: "background", label: "배경", icon: Image },
  { type: "bgm", label: "배경음악", icon: Music },
  { type: "sfx", label: "효과음", icon: Music },
  { type: "character", label: "캐릭터", icon: User },
  { type: "gallery", label: "갤러리", icon: ImagePlus },
  { type: "video", label: "동영상", icon: Film },
  { type: "choice", label: "선택지", icon: ListChecks },
  { type: "event", label: "장면 전환", icon: Sparkles },
];

const MENU_OPTIONS: SlashMenuOption[] = [
  { id: "add_sentence", label: "문장추가", icon: MessageSquareText },
  ...BLOCK_OPTIONS.map((opt) => ({ id: opt.type, ...opt })),
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
  presentation = "popover",
}: SlashCommandMenuProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const OPTIONS = MENU_OPTIONS;

  // 기본 포커스: 메뉴 열리면 첫 항목에 포커스
  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, OPTIONS.length);
    buttonRefs.current[0]?.focus();
  }, [OPTIONS.length]);

  /** 백드롭이 투명이라 메뉴만 닫힌 뒤에도 레이어가 남으면 호버·클릭이 전부 막힌 것처럼 보임 — 포커스 위치와 관계없이 Escape로 닫기 */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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

  const renderOption = (option: SlashMenuOption, index: number, isSheet: boolean) => {
    const Icon = option.icon;
    return (
      <button
        key={option.id}
        ref={(el) => {
          buttonRefs.current[index] = el;
        }}
        type="button"
        role="option"
        aria-selected={false}
        className={cn(
          "flex w-full cursor-pointer items-center gap-my-12 text-left text-body3_400",
          isSheet ? "px-my-20 py-my-16" : "gap-my-8 px-my-12 py-my-8",
          "hover:bg-surface-20 focus:bg-surface-20 focus:outline-none",
        )}
        onClick={() => {
          if (option.id === "add_sentence") {
            onSelect({ action: "add_sentence" });
            return;
          }
          const type = option.type;
          const defaultPayload = getDefaultPayloadForType(type);
          if (defaultPayload) {
            onSelect(defaultPayload);
          } else {
            onSelect(type);
          }
        }}
        onKeyDown={(e) => handleOptionKeyDown(index, e)}
      >
        <Icon className={cn("shrink-0 text-on-surface-30", isSheet ? "h-5 w-5" : "h-4 w-4")} />
        <span className="text-on-surface-10">{option.label}</span>
      </button>
    );
  };

  if (presentation === "sheet") {
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/30"
          aria-hidden
          onClick={onClose}
        />
        <div
          className={cn(
            "fixed inset-x-0 z-50 max-h-[min(70vh,520px)] overflow-y-auto rounded-t-[4px] border-t border-border-10 bg-white shadow-elevation-40",
            MOBILE_BOTTOM_SHEET_PAD_CLASS,
          )}
          role="listbox"
          aria-label="블록 추가"
        >
          <div className="border-b border-border-10 px-my-20 py-my-16">
            <p className="text-body1_500 text-on-surface-10">블록 추가</p>
            <p className="mt-my-4 text-caption1_400 text-on-surface-30">
              아래에 추가할 블록을 선택해 주세요
            </p>
          </div>
          <div className="py-my-8">
            {OPTIONS.map((option, index) => renderOption(option, index, true))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 cursor-pointer"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed z-50 min-w-[200px] rounded-lg border border-border-10 bg-white py-my-4 shadow-elevation-40"
        style={{ top: adjustedPosition.top, left: adjustedPosition.left }}
        role="listbox"
      >
        {OPTIONS.map((option, index) => renderOption(option, index, false))}
      </div>
    </>
  );
}
