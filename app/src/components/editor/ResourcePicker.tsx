"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { BACKGROUNDS, CHARACTERS, BGMS, SFX, GALLERIES, VIDEOS } from "@/lib/mockData";
import type { BlockType } from "@/types/editor";
import { cn } from "@/lib/utils";

const PICKER_TYPES: BlockType[] = ["background", "character", "bgm", "sfx", "gallery", "video", "event"];
const EPISODE_END_LABEL = "에피소드 종료";

export interface ResourcePickerProps {
  type: BlockType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
  onClose: () => void;
  /** 현재 선택된 리소스 이름 (하이라이트용, 선택 안 함은 빈 문자열) */
  selectedName?: string;
  /** 특정 타입에서 목록을 외부에서 주입하고 싶을 때 사용 */
  itemsOverride?: { id: string; name: string; url?: string; fileUrl?: string }[];
  /** Anchor element - picker positions relative to this */
  children: React.ReactNode;
}

function getItemsForType(type: BlockType): {
  id: string;
  name: string;
  url?: string;
  fileUrl?: string;
}[] {
  switch (type) {
    case "background":
      return BACKGROUNDS;
    case "character":
      return CHARACTERS;
    case "bgm":
      return BGMS;
    case "sfx":
      return SFX;
    case "gallery":
      return GALLERIES;
    case "video":
      return VIDEOS;
    default:
      return [];
  }
}

function isImageType(type: BlockType): boolean {
  return type === "background" || type === "character" || type === "gallery";
}

/** Inset ring layer above image (z-10) so it is not covered by the resource */
function ThumbnailFrameOverlay({
  isCharacter,
  isActive,
  className,
}: {
  isCharacter: boolean;
  /** Strong ring when selected */
  isActive: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-10",
        isCharacter ? "rounded-[999px]" : "rounded-lg",
        isActive
          ? "ring-2 ring-inset ring-primary"
          : "ring-1 ring-inset ring-border-20/10",
        "group-focus-visible:ring-2 group-focus-visible:ring-inset group-focus-visible:ring-primary",
        className
      )}
    />
  );
}

const PICKER_TITLE: Record<BlockType, string> = {
  character: "캐릭터",
  background: "배경",
  bgm: "배경음악",
  sfx: "효과음",
  scene: "장면",
  gallery: "갤러리",
  video: "동영상",
  text: "텍스트",
  top_desc: "장면정보",
  choice: "선택지",
  event: "장면 전환",
  event_end: "이벤트 종료",
  direction: "연출",
};

export function ResourcePicker({
  type,
  isOpen,
  onOpenChange,
  onSelect,
  onClose,
  selectedName,
  itemsOverride,
  children,
}: ResourcePickerProps) {
  const optionButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = useMemo(() => {
    const base = itemsOverride ?? getItemsForType(type);
    // 외부에서 순서를 정의해 주입한 경우(장면 전환 목록 등)에는 그대로 유지한다.
    if (itemsOverride) return [...base];
    // 데모용 더미 리소스 — type 문자열에서 파생한 고정 시드로 한 번만 섞어 재렌더 시 순서를 고정한다
    let seed = 1;
    for (let i = 0; i < type.length; i += 1) {
      seed = (seed * 31 + type.charCodeAt(i)) % 9973;
    }
    return [...base]
      .map((item, idx) => ({ item, key: ((idx + 1) * seed) % 9973 }))
      .sort((a, b) => a.key - b.key)
      .map((entry) => entry.item);
  }, [type, itemsOverride]);

  const handleSelect = (name: string) => {
    onSelect(name);
    onOpenChange(false);
    onClose();
  };

  const isPickerType = PICKER_TYPES.includes(type);
  const imageMode = isImageType(type);
  const isCharacter = type === "character";
  const isSceneTransition = type === "event";
  const title = PICKER_TITLE[type] ?? "리소스";
  const gridColumns = 3;

  const optionCount = imageMode ? 1 + items.length : items.length + 1;

  const focusFirstOption = useCallback(() => {
    requestAnimationFrame(() => {
      optionButtonRefs.current[0]?.focus();
    });
  }, []);

  useEffect(() => {
    if (!isPickerType) return;
    if (!isOpen) return;
    optionButtonRefs.current = optionButtonRefs.current.slice(0, optionCount);
    focusFirstOption();
  }, [isPickerType, isOpen, optionCount, focusFirstOption]);

  if (!isPickerType) return <>{children}</>;

  const focusOption = (index: number) => {
    const clamped = Math.max(0, Math.min(index, optionCount - 1));
    optionButtonRefs.current[clamped]?.focus();
  };

  const handleOptionKeyDown = (index: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
      onClose();
      return;
    }

    if (imageMode) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusOption(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusOption(index - 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        focusOption(index + gridColumns);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focusOption(index - gridColumns);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusOption(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusOption(index - 1);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-fit max-h-[420px] flex flex-col justify-start items-stretch overflow-hidden p-0 bg-surface-10 rounded-[4px] border border-[rgba(0,0,0,0.07)] outline outline-1 outline-offset-[-1px] outline-border-20/10"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          focusFirstOption();
        }}
      >
        {/* 헤더: 타이틀 + 닫기 버튼 */}
        <div className="flex w-full items-center justify-between px-5 py-2">
          <div className="text-on-surface-10 text-base font-bold leading-6">{title}</div>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-surface-20/60 text-on-surface-30 hover:text-on-surface-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            style={{ marginLeft: 0, marginRight: -8 }}
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>

        <div
          className={cn(
            "flex-1 max-h-full overflow-y-auto",
            imageMode ? "px-5 pt-0 pb-5 grid grid-cols-3 gap-4 w-fit" : "pt-0 px-2 pb-2 flex flex-col gap-0.5"
          )}
        >
          {imageMode ? (
            <>
              <button
                type="button"
                onClick={() => handleSelect("")}
                ref={(el) => {
                  optionButtonRefs.current[0] = el;
                }}
                onKeyDown={(e) => handleOptionKeyDown(0, e)}
                className="group rounded-lg cursor-pointer inline-flex flex-col justify-start items-center gap-2 col-span-1 focus:outline-none focus:ring-0"
              >
                <div
                  className={cn(
                    isCharacter
                      ? "w-24 h-24 relative bg-surface-disabled-10/0 rounded-[999px] overflow-hidden"
                      : "w-24 h-44 relative bg-surface-disabled-10/0 rounded-lg overflow-hidden"
                  )}
                >
                  <div
                    className={cn(
                      isCharacter ? "w-24 h-24" : "w-24 h-44",
                      "left-0 top-0 absolute z-0 bg-surface-disabled/30"
                    )}
                  >
                    <div
                      className="absolute inset-0"
                      aria-hidden
                    >
                      <svg
                        className="absolute inset-0 h-full w-full text-border-20/20"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden
                      >
                        <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <ThumbnailFrameOverlay
                    isCharacter={isCharacter}
                    isActive={selectedName === ""}
                  />
                </div>
                <div
                  className={cn(
                    "self-stretch flex flex-col justify-center",
                    isCharacter ? "items-center" : "items-start"
                  )}
                >
                  <div className="text-center justify-center text-on-surface-10 text-[13px] font-normal leading-5">
                    선택 안 함
                  </div>
                </div>
              </button>
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.name)}
                  ref={(el) => {
                    optionButtonRefs.current[idx + 1] = el;
                  }}
                  onKeyDown={(e) => handleOptionKeyDown(idx + 1, e)}
                  className={cn(
                    "group rounded-lg cursor-pointer inline-flex flex-col justify-start items-center gap-2 hover:bg-surface-10/40 focus:outline-none focus:ring-0",
                    isCharacter ? "" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      isCharacter
                        ? "w-[100px] h-[100px] relative rounded-[999px] overflow-hidden border border-[rgba(0,0,0,0.07)]"
                        : "w-24 h-44 relative rounded-lg overflow-hidden bg-surface-disabled-10/0"
                    )}
                  >
                    {"url" in item && item.url ? (
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        sizes={isCharacter ? "100px" : "96px"}
                        className="object-cover"
                      />
                    ) : (
                      <div className="relative z-0 flex h-full w-full items-center justify-center text-xs text-on-surface-30">
                        —
                      </div>
                    )}
                    <ThumbnailFrameOverlay
                      isCharacter={isCharacter}
                      isActive={selectedName === item.name}
                    />
                  </div>
                  <div
                    className={cn(
                      "self-stretch flex flex-col justify-center",
                      isCharacter ? "items-center" : "items-start"
                    )}
                  >
                    <span
                      className={cn(
                        "text-center justify-center text-[13px] font-normal leading-5 truncate",
                        selectedName === item.name ? "text-primary" : "text-on-surface-10"
                      )}
                    >
                      {item.name}
                    </span>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <>
              {!isSceneTransition && (
                <button
                  type="button"
                  onClick={() => handleSelect("")}
                  ref={(el) => {
                    optionButtonRefs.current[0] = el;
                  }}
                  onKeyDown={(e) => handleOptionKeyDown(0, e)}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-surface-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 focus:ring-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-20 text-on-surface-disabled/60">
                    —
                  </span>
                  <span className="truncate font-medium text-on-surface-10">선택 안 함</span>
                </button>
              )}
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.name)}
                  ref={(el) => {
                    optionButtonRefs.current[idx + (isSceneTransition ? 0 : 1)] = el;
                  }}
                  onKeyDown={(e) =>
                    handleOptionKeyDown(idx + (isSceneTransition ? 0 : 1), e)
                  }
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-surface-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 focus:ring-0"
                >
                  {!isSceneTransition && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-20 text-on-surface-30">
                      ♪
                    </span>
                  )}
                  <span className="truncate font-medium text-on-surface-10">
                    {item.name}
                  </span>
                </button>
              ))}
              {isSceneTransition && (
                <div className="mt-1 border-t border-border-10 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelect(EPISODE_END_LABEL)}
                    ref={(el) => {
                      optionButtonRefs.current[items.length] = el;
                    }}
                    onKeyDown={(e) => handleOptionKeyDown(items.length, e)}
                    className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-surface-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 focus:ring-0"
                  >
                    <span className="truncate font-medium text-on-surface-10">
                      {EPISODE_END_LABEL}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
