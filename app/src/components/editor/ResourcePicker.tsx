"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { MenuList, MenuListItem, MenuListSeparator } from "@/components/ui/menu-list";
import { MOBILE_BOTTOM_SHEET_SCRIM_CLASS, MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS, mobileBottomSheetMediumMaxHeightClassName } from "@/components/ui/modal/modal-styles";
import { BACKGROUNDS, CHARACTERS, BGMS, SFX, GALLERIES, VIDEOS } from "@/lib/mockData";
import {
  RESOURCE_PICKER_SHEET_GRID_CLASS,
  RESOURCE_THUMBNAIL_FLUID_IMAGE_SIZES,
  RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS,
  THUMBNAIL_DIM_OVERLAY_CLASS,
  estimateResourceThumbnailGridColumns,
} from "@/lib/thumbnail-styles";
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
  isActive,
  className,
}: {
  /** Strong ring when selected */
  isActive: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-10 rounded-lg",
        isActive
          ? "ring-2 ring-inset ring-primary"
          : "ring-1 ring-inset ring-border-20/10",
        "group-focus-visible:ring-2 group-focus-visible:ring-inset group-focus-visible:ring-primary",
        className
      )}
    />
  );
}

/** PC 팝오버 — 배경·갤러리·캐릭터 공통 9:16 고정 썸네일 */
const DESKTOP_PICKER_THUMB_CLASS =
  "relative h-44 w-24 overflow-hidden rounded-lg bg-surface-disabled-10/0";

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
  optionButtonRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  onSelect: (name: string) => void;
  onOptionKeyDown: (index: number, e: React.KeyboardEvent<HTMLElement>) => void;
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

  const imageThumbClass = (selected?: boolean) => {
    if (isSheet) {
      return cn(
        "relative overflow-hidden rounded-lg bg-surface-disabled/0 outline outline-1 outline-offset-[-1px]",
        RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS,
        selected
          ? "outline-2 outline-offset-[-2px] outline-primary"
          : "outline-border-20",
      );
    }

    return DESKTOP_PICKER_THUMB_CLASS;
  };

  const imageCellClass = cn(
    "group flex min-w-0 cursor-pointer flex-col focus:outline-none focus:ring-0",
    isSheet
      ? "w-full items-start justify-start gap-my-4"
      : "inline-flex items-start justify-start gap-my-8 hover:bg-surface-10/40",
  );

  const imageLabelClass = cn(
    "w-full min-w-0 truncate text-left text-body4_400 font-['Pretendard_JP']",
    isSheet && "self-stretch",
  );

  const isSceneTransition = type === "event";

  if (imageMode) {
    return (
      <div
        className={cn(
          "grid",
          isSheet ? RESOURCE_PICKER_SHEET_GRID_CLASS : "w-fit grid-cols-3 gap-my-16 px-my-20 pb-my-20 pt-my-20",
        )}
      >
        <button
          type="button"
          onClick={() => onSelect("")}
          ref={(el) => {
            optionButtonRefs.current[0] = el;
          }}
          onKeyDown={(e) => onOptionKeyDown(0, e)}
          className={cn(imageCellClass, !isSheet && "col-span-1")}
        >
          <div className={imageThumbClass(selectedName === "")}>
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
            {!isSheet && (
              <ThumbnailFrameOverlay isActive={selectedName === ""} />
            )}
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
            <div className={imageThumbClass(selectedName === item.name)}>
              {"url" in item && item.url ? (
                <>
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    sizes={isSheet ? RESOURCE_THUMBNAIL_FLUID_IMAGE_SIZES : "96px"}
                    className="object-cover object-center"
                  />
                  <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
                </>
              ) : (
                <div className="relative z-0 flex h-full w-full items-center justify-center text-caption1_400 text-on-surface-30">
                  —
                </div>
              )}
              {!isSheet && (
                <ThumbnailFrameOverlay isActive={selectedName === item.name} />
              )}
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
      </div>
    );
  }

  return (
    <MenuList
      className={cn(
        isSheet ? "w-full px-my-8 pb-my-16 pt-my-8" : "gap-my-2 px-my-8 pb-my-8 pt-0",
      )}
    >
          {!isSceneTransition && (
            <MenuListItem
              variant={isSheet ? "form" : "compact"}
              onClick={() => onSelect("")}
              ref={(el) => {
                optionButtonRefs.current[0] = el;
              }}
              onKeyDown={(e) => onOptionKeyDown(0, e)}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-20 text-on-surface-disabled/60">
                —
              </span>
              <span className="truncate">선택 안 함</span>
            </MenuListItem>
          )}
          {items.map((item, idx) => (
            <MenuListItem
              key={item.id}
              variant={isSheet ? "form" : "compact"}
              onClick={() => onSelect(item.name)}
              ref={(el) => {
                optionButtonRefs.current[idx + (isSceneTransition ? 0 : 1)] = el;
              }}
              onKeyDown={(e) => onOptionKeyDown(idx + (isSceneTransition ? 0 : 1), e)}
            >
              {!isSceneTransition && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-20 text-on-surface-30">
                  ♪
                </span>
              )}
              <span className={cn("truncate", selectedName === item.name && "text-primary")}>
                {item.name}
              </span>
            </MenuListItem>
          ))}
          {isSceneTransition && (
            <>
              <MenuListSeparator />
              <MenuListItem
                variant={isSheet ? "form" : "compact"}
                onClick={() => onSelect(EPISODE_END_LABEL)}
                ref={(el) => {
                  optionButtonRefs.current[items.length] = el;
                }}
                onKeyDown={(e) => onOptionKeyDown(items.length, e)}
              >
                <span className="truncate">{EPISODE_END_LABEL}</span>
              </MenuListItem>
            </>
          )}
        </MenuList>
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
  const optionButtonRefs = useRef<(HTMLElement | null)[]>([]);
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
  const [mobileGridColumns, setMobileGridColumns] = useState(3);
  const optionCount = imageMode ? 1 + items.length : items.length + 1;

  useEffect(() => {
    if (isDesktop || !imageMode) return;

    const updateColumns = () => {
      const contentWidth = window.innerWidth - 40;
      setMobileGridColumns(estimateResourceThumbnailGridColumns(contentWidth));
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [imageMode, isDesktop]);

  const gridColumns = isDesktop ? 3 : mobileGridColumns;

  const focusFirstOption = useCallback(() => {
    requestAnimationFrame(() => {
      optionButtonRefs.current[0]?.focus();
    });
  }, []);

  useEffect(() => {
    if (!isPickerType || !isOpen) return;
    optionButtonRefs.current = optionButtonRefs.current.slice(0, optionCount);
    if (isDesktop) focusFirstOption();
  }, [focusFirstOption, isDesktop, isOpen, isPickerType, optionCount]);

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

  useEffect(() => {
    if (isDesktop || !isOpen || !isPickerType) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevOverflow;
    };
  }, [isDesktop, isOpen, isPickerType]);

  if (!isPickerType) return <>{children}</>;

  const focusOption = (index: number) => {
    const clamped = Math.max(0, Math.min(index, optionCount - 1));
    optionButtonRefs.current[clamped]?.focus();
  };

  const handleOptionKeyDown = (index: number, e: React.KeyboardEvent<HTMLElement>) => {
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
              className={MOBILE_BOTTOM_SHEET_SCRIM_CLASS}
              aria-hidden
              onClick={handleDismiss}
            />
            <div
              className={cn(
                MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS,
                "bg-surface-10",
                mobileBottomSheetMediumMaxHeightClassName,
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
        className="flex max-h-[480px] min-h-0 w-fit flex-col overflow-hidden rounded-[4px] border border-[rgba(0,0,0,0.07)] bg-surface-10 p-0 outline outline-1 outline-offset-[-1px] outline-border-20/10"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          focusFirstOption();
        }}
      >
        <ResourcePickerHeader title={title} onClose={() => onOpenChange(false)} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ResourcePickerOptions {...optionsProps} isSheet={false} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
