"use client";

import { useMemo } from "react";
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
  const items = useMemo(() => {
    const base = itemsOverride ?? getItemsForType(type);
    // 외부에서 순서를 정의해 주입한 경우(장면 전환 목록 등)에는 그대로 유지한다.
    if (itemsOverride) return [...base];
    // 데모용 더미 리소스는 목록 내에서 랜덤 배치
    return [...base].sort(() => Math.random() - 0.5);
  }, [type, itemsOverride]);

  const handleSelect = (name: string) => {
    onSelect(name);
    onOpenChange(false);
    onClose();
  };

  if (!PICKER_TYPES.includes(type)) return <>{children}</>;

  const imageMode = isImageType(type);
  const isCharacter = type === "character";
  const isSceneTransition = type === "event";
  const title = PICKER_TITLE[type] ?? "리소스";

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-fit max-h-[420px] flex flex-col justify-start items-stretch overflow-hidden p-0 bg-surface-10 rounded-2xl border border-[rgba(0,0,0,0.07)] outline outline-1 outline-offset-[-1px] outline-border-20/10"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* 헤더: 타이틀 + 닫기 버튼 */}
        <div className="flex w-full items-center justify-between px-5 py-3">
          <div className="text-on-surface-10 text-base font-bold leading-6">{title}</div>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-surface-20/60 text-on-surface-30 hover:text-on-surface-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ marginLeft: 0, marginRight: -8 }}
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>

        <div
          className={cn(
            "flex-1 max-h-full overflow-y-auto",
            imageMode ? "px-5 pt-2 pb-5 grid grid-cols-3 gap-4 w-fit" : "p-2 flex flex-col gap-0.5"
          )}
        >
          {imageMode ? (
            <>
              <button
                type="button"
                onClick={() => handleSelect("")}
                className="rounded-lg cursor-pointer inline-flex flex-col justify-start items-center gap-2 col-span-1 focus:outline-none focus:ring-0"
              >
                <div
                  className={cn(
                    isCharacter
                      ? "w-24 h-24 relative bg-surface-disabled-10/0 rounded-[999px] overflow-hidden"
                      : "w-24 h-44 relative bg-surface-disabled-10/0 rounded-lg overflow-hidden",
                    selectedName === ""
                      ? "outline outline-2 outline-primary"
                      : "outline outline-1 outline-offset-[-1px] outline-border-20/10"
                  )}
                >
                  <div
                    className={cn(
                      isCharacter ? "w-24 h-24" : "w-24 h-44",
                      "left-0 top-0 absolute bg-surface-disabled/30"
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
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.name)}
                  className={cn(
                    "rounded-lg cursor-pointer inline-flex flex-col justify-start items-center gap-2 hover:bg-surface-10/40 focus:outline-none focus:ring-0",
                    isCharacter ? "" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      isCharacter
                        ? "w-[100px] h-[100px] relative rounded-[999px] overflow-hidden border border-[rgba(0,0,0,0.07)]"
                        : "w-24 h-44 relative rounded-lg overflow-hidden bg-surface-disabled-10/0",
                      selectedName === item.name
                        ? "outline outline-2 outline-primary"
                        : "outline outline-1 outline-offset-[-1px] outline-border-20/10"
                    )}
                  >
                    {"url" in item && item.url ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className={cn(
                          isCharacter ? "w-[100px] h-[100px]" : "w-24 h-44 border border-[rgba(0,0,0,0.07)]",
                          "left-0 top-0 absolute object-cover"
                        )}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-on-surface-30">
                        —
                      </div>
                    )}
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
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-slate-100 focus:outline-none focus:ring-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-on-surface-disabled/60">
                    —
                  </span>
                  <span className="truncate font-medium text-on-surface-10">선택 안 함</span>
                </button>
              )}
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.name)}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-slate-100 focus:outline-none focus:ring-0"
                >
                  {!isSceneTransition && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-on-surface-30">
                      ♪
                    </span>
                  )}
                  <span className="truncate font-medium text-on-surface-10">
                    {item.name}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
