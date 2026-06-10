"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { mobileBottomSheetMaxHeightClassName, MOBILE_BOTTOM_SHEET_PAD_CLASS } from "@/components/ui/modal/modal-styles";
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

interface ResourcePickerOptionsProps {
  type: BlockType;
  items: { id: string; name: string; url?: string; fileUrl?: string }[];
  selectedName?: string;
  isSheet: boolean;
  optionButtonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onSelect: (name: string) => void;
  onOptionKeyDown: (index: number, e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

function ResourcePickerOptions({
  type,
  items,
  selectedName,
  isSheet,
  optionButtonRefs,
  onSelect,
  onOptionKeyDown,
}: ResourcePickerOptionsProps) {
  const imageMode = isImageType(type);
  const isCharacter = type === "character";

  const imageThumbClass = (selected?: boolean) =>
    cn(
      isSheet
        ? isCharacter
          ? "relative aspect-square w-full overflow-hidden rounded-[999px] bg-surface-disabled-10/0"
          : "relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface-disabled-10/0"
        : isCharacter
          ? cn(
              "relative overflow-hidden rounded-[999px] bg-surface-disabled-10/0",
              selected === undefined ? "h-24 w-24" : "h-[100px] w-[100px] border border-[rgba(0,0,0,0.07)]",
            )
          : "relative h-44 w-24 overflow-hidden rounded-lg bg-surface-disabled-10/0",
    );

  const imageCellClass = cn(
    "group flex min-w-0 cursor-pointer flex-col rounded-lg focus:outline-none focus:ring-0",
    isSheet
      ? cn(
          "w-full items-center active:bg-surface-20/60",
          isCharacter ? "gap-my-4 px-my-2 py-my-8" : "gap-my-4 px-my-4 py-my-4",
        )
      : cn(
          "inline-flex items-center justify-start gap-my-8 hover:bg-surface-10/40",
          isCharacter ? "items-center" : "items-start",
        ),
  );

  const imageLabelClass = cn(
    "w-full min-w-0 text-body4_400",
    isSheet
      ? "line-clamp-2 min-h-[2lh] px-my-2 text-center leading-snug"
      : cn("truncate", isCharacter ? "text-center" : "text-left"),
  );

  const isSceneTransition = type === "event";

  const sheetImageGridClass = isCharacter
    ? "grid-cols-4 gap-x-my-8 gap-y-my-12"
    : "grid-cols-3 gap-x-my-12 gap-y-my-16";

  return (
    <div
      className={cn(
        !isSheet && "max-h-full overflow-y-auto",
        imageMode
          ? cn(
              "grid",
              isSheet
                ? cn("w-full px-my-12 pb-my-16 pt-my-8", sheetImageGridClass)
                : "w-fit grid-cols-3 gap-my-16 px-my-16 lg:px-my-20 pb-my-20 pt-0",
            )
          : cn(
              "flex flex-col",
              isSheet
                ? "w-full gap-my-4 px-my-12 pb-my-16 pt-my-8"
                : "gap-my-2 px-my-8 pb-my-8 pt-0",
            ),
      )}
    >
      {imageMode ? (
        <>
          <button
            type="button"
            onClick={() => onSelect("")}
            ref={(el) => {
              optionButtonRefs.current[0] = el;
            }}
            onKeyDown={(e) => onOptionKeyDown(0, e)}
            className={cn(imageCellClass, !isSheet && "col-span-1")}
          >
            <div className={imageThumbClass()}>
              <div className="absolute inset-0 z-0 bg-surface-disabled/30">
                <div className="absolute inset-0" aria-hidden>
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
              <ThumbnailFrameOverlay isCharacter={isCharacter} isActive={selectedName === ""} />
            </div>
            <span className={cn(imageLabelClass, "text-on-surface-10")}>선택 안 함</span>
          </button>
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.name)}
              ref={(el) => {
                optionButtonRefs.current[idx + 1] = el;
              }}
              onKeyDown={(e) => onOptionKeyDown(idx + 1, e)}
              className={imageCellClass}
            >
              <div className={imageThumbClass(true)}>
                {"url" in item && item.url ? (
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    sizes={isSheet ? "(max-width: 1024px) 28vw, 100px" : isCharacter ? "100px" : "96px"}
                    className="object-cover"
                  />
                ) : (
                  <div className="relative z-0 flex h-full w-full items-center justify-center text-caption1_400 text-on-surface-30">
                    —
                  </div>
                )}
                <ThumbnailFrameOverlay
                  isCharacter={isCharacter}
                  isActive={selectedName === item.name}
                />
              </div>
              <span
                className={cn(
                  imageLabelClass,
                  selectedName === item.name ? "text-primary" : "text-on-surface-10",
                )}
              >
                {item.name}
              </span>
            </button>
          ))}
        </>
      ) : (
        <>
          {!isSceneTransition && (
            <button
              type="button"
              onClick={() => onSelect("")}
              ref={(el) => {
                optionButtonRefs.current[0] = el;
              }}
              onKeyDown={(e) => onOptionKeyDown(0, e)}
              className={cn(
                "flex cursor-pointer items-center gap-my-8 rounded px-my-8 py-my-8 text-left text-body3_400 hover:bg-surface-20 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
                isSheet && "min-h-12",
              )}
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
              onClick={() => onSelect(item.name)}
              ref={(el) => {
                optionButtonRefs.current[idx + (isSceneTransition ? 0 : 1)] = el;
              }}
              onKeyDown={(e) => onOptionKeyDown(idx + (isSceneTransition ? 0 : 1), e)}
              className={cn(
                "flex cursor-pointer items-center gap-my-8 rounded px-my-8 py-my-8 text-left text-body3_400 hover:bg-surface-20 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
                isSheet && "min-h-12",
              )}
            >
              {!isSceneTransition && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-20 text-on-surface-30">
                  ♪
                </span>
              )}
              <span className="truncate font-medium text-on-surface-10">{item.name}</span>
            </button>
          ))}
          {isSceneTransition && (
            <div className="mt-1 border-t border-border-10 pt-my-4">
              <button
                type="button"
                onClick={() => onSelect(EPISODE_END_LABEL)}
                ref={(el) => {
                  optionButtonRefs.current[items.length] = el;
                }}
                onKeyDown={(e) => onOptionKeyDown(items.length, e)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-my-8 rounded px-my-8 py-my-8 text-left text-body3_400 hover:bg-surface-20 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
                  isSheet && "min-h-12",
                )}
              >
                <span className="truncate font-medium text-on-surface-10">{EPISODE_END_LABEL}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ResourcePickerHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex w-full shrink-0 items-center justify-between border-b border-border-10 px-my-12 py-my-12 lg:px-my-20 lg:py-my-8">
      <div className="text-body1_700 text-on-surface-10">{title}</div>
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-30 transition-colors hover:bg-surface-20/60 hover:text-on-surface-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        style={{ marginRight: -8 }}
      >
        <X className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}

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
  const isDesktop = useIsLgUp();
  const optionButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = useMemo(() => {
    const base = itemsOverride ?? getItemsForType(type);
    if (itemsOverride) return [...base];
    let seed = 1;
    for (let i = 0; i < type.length; i += 1) {
      seed = (seed * 31 + type.charCodeAt(i)) % 9973;
    }
    return [...base]
      .map((item, idx) => ({ item, key: ((idx + 1) * seed) % 9973 }))
      .sort((a, b) => a.key - b.key)
      .map((entry) => entry.item);
  }, [type, itemsOverride]);

  const handleSelect = useCallback(
    (name: string) => {
      onSelect(name);
      onOpenChange(false);
      onClose();
    },
    [onClose, onOpenChange, onSelect],
  );

  const handleDismiss = useCallback(() => {
    onOpenChange(false);
    onClose();
  }, [onClose, onOpenChange]);

  const isPickerType = PICKER_TYPES.includes(type);
  const imageMode = isImageType(type);
  const title = PICKER_TITLE[type] ?? "리소스";
  const gridColumns = type === "character" && !isDesktop ? 4 : 3;
  const optionCount = imageMode ? 1 + items.length : items.length + 1;

  const focusFirstOption = useCallback(() => {
    requestAnimationFrame(() => {
      optionButtonRefs.current[0]?.focus();
    });
  }, []);

  useEffect(() => {
    if (!isPickerType || !isOpen) return;
    optionButtonRefs.current = optionButtonRefs.current.slice(0, optionCount);
    focusFirstOption();
  }, [focusFirstOption, isOpen, isPickerType, optionCount]);

  useEffect(() => {
    if (!isPickerType || !isOpen || isDesktop) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDismiss, isDesktop, isOpen, isPickerType]);

  if (!isPickerType) return <>{children}</>;

  const focusOption = (index: number) => {
    const clamped = Math.max(0, Math.min(index, optionCount - 1));
    optionButtonRefs.current[clamped]?.focus();
  };

  const handleOptionKeyDown = (index: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleDismiss();
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

  const optionsProps = {
    type,
    items,
    selectedName,
    optionButtonRefs,
    onSelect: handleSelect,
    onOptionKeyDown: handleOptionKeyDown,
  };

  const mobileSheet =
    !isDesktop && isOpen && typeof document !== "undefined"
      ? createPortal(
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30"
              aria-hidden
              onClick={handleDismiss}
            />
            <div
              className={cn(
                "fixed inset-x-0 bottom-0 z-50 flex min-h-0 flex-col rounded-t-[4px] border-t border-border-10 bg-surface-10 shadow-elevation-40",
                MOBILE_BOTTOM_SHEET_PAD_CLASS,
                mobileBottomSheetMaxHeightClassName,
              )}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <ResourcePickerHeader title={title} onClose={handleDismiss} />
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-0">
                <ResourcePickerOptions {...optionsProps} isSheet />
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  if (!isDesktop) {
    return (
      <>
        {children}
        {mobileSheet}
      </>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent
        align="start"
        className="flex max-h-[420px] w-fit flex-col items-stretch justify-start overflow-hidden rounded-[4px] border border-[rgba(0,0,0,0.07)] bg-surface-10 p-0 outline outline-1 outline-offset-[-1px] outline-border-20/10"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          focusFirstOption();
        }}
      >
        <ResourcePickerHeader title={title} onClose={() => onOpenChange(false)} />
        <div className="flex-1 max-h-full overflow-hidden">
          <ResourcePickerOptions {...optionsProps} isSheet={false} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
