"use client";

import { useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { BACKGROUNDS, CHARACTERS, BGMS, SFX } from "@/lib/mockData";
import type { BlockType } from "@/types/editor";
import { cn } from "@/lib/utils";

const PICKER_TYPES: BlockType[] = ["background", "character", "bgm", "sfx"];

export interface ResourcePickerProps {
  type: BlockType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
  onClose: () => void;
  /** Anchor element - picker positions relative to this */
  children: React.ReactNode;
}

function getItemsForType(type: BlockType): { id: string; name: string; url?: string; fileUrl?: string }[] {
  switch (type) {
    case "background":
      return BACKGROUNDS;
    case "character":
      return CHARACTERS;
    case "bgm":
      return BGMS;
    case "sfx":
      return SFX;
    default:
      return [];
  }
}

function isImageType(type: BlockType): boolean {
  return type === "background" || type === "character";
}

export function ResourcePicker({
  type,
  isOpen,
  onOpenChange,
  onSelect,
  onClose,
  children,
}: ResourcePickerProps) {
  const items = useMemo(() => getItemsForType(type), [type]);

  const handleSelect = (name: string) => {
    onSelect(name);
    onOpenChange(false);
    onClose();
  };

  if (!PICKER_TYPES.includes(type)) return <>{children}</>;

  const imageMode = isImageType(type);

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-80 p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div
          className={cn(
            "max-h-64 overflow-y-auto p-2",
            imageMode ? "grid grid-cols-3 gap-2" : "flex flex-col gap-0.5"
          )}
        >
          {imageMode ? (
            <>
              <button
                type="button"
                onClick={() => handleSelect("")}
                className="flex flex-col items-center gap-1 rounded-lg border border-transparent p-1.5 text-center hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-0 col-span-3"
              >
                <div className="h-14 w-full overflow-hidden rounded bg-slate-50 flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-500">선택 안 함</span>
                </div>
              </button>
              {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.name)}
                className="flex flex-col items-center gap-1 rounded-lg border border-transparent p-1.5 text-center hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-0"
              >
                <div className="h-14 w-full overflow-hidden rounded bg-slate-100">
                  {"url" in item && item.url ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      —
                    </div>
                  )}
                </div>
                <span className="truncate text-xs font-medium text-slate-700">
                  {item.name}
                </span>
              </button>
            ))}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSelect("")}
                className="flex items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-slate-100 focus:outline-none focus:ring-0"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500">
                  —
                </span>
                <span className="truncate font-medium text-slate-800">선택 안 함</span>
              </button>
              {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.name)}
                className="flex items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-slate-100 focus:outline-none focus:ring-0"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500">
                  ♪
                </span>
                <span className="truncate font-medium text-slate-800">
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
