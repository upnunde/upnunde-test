"use client";

import NextImage from "next/image";
import { Film, Music } from "lucide-react";
import type { BlockType, ScriptBlock } from "@/types/editor";
import { BACKGROUNDS, CHARACTERS, GALLERIES } from "@/lib/mockData";
import { initialCharacters } from "@/lib/resourceMockData";
import {
  isResourceValueEmpty,
  resolveRegisteredResourceName,
} from "@/lib/resolveRegisteredResourceName";
import { cn } from "@/lib/utils";
import { ReadonlyValueBox } from "./ReadonlyValueBox";

const PICKER_RESOURCE_TYPES: BlockType[] = [
  "background",
  "character",
  "bgm",
  "sfx",
  "gallery",
  "video",
  "event",
];

const DEFAULT_CHARACTER_EXPRESSION = "기본";

function getCharacterExpressionLabel(block: ScriptBlock, displayName: string): string {
  const target = initialCharacters.find((c) => c.name === displayName);
  const labels = (target?.expressions ?? [])
    .map((slot) => slot.expressionLabel?.trim() ?? "")
    .filter((label): label is string => label.length > 0 && label !== "untitle");
  const options = labels.length > 0 ? Array.from(new Set(labels)) : [DEFAULT_CHARACTER_EXPRESSION];
  const raw = (block.data?.expression as string | undefined)?.trim() ?? "";
  if (options.includes(raw) && raw.length > 0) return raw;
  return options[0] ?? DEFAULT_CHARACTER_EXPRESSION;
}

function ResourceLeadingIcon({
  blockType,
  displayName,
  thumbnailUrl,
}: {
  blockType: BlockType;
  displayName: string;
  thumbnailUrl: string | null;
}) {
  if (thumbnailUrl) {
    return (
      <NextImage
        src={thumbnailUrl}
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 shrink-0 rounded-full object-cover"
      />
    );
  }
  if (blockType === "bgm" || blockType === "sfx") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-20 text-on-surface-30">
        <Music className="h-3 w-3" />
      </span>
    );
  }
  if (blockType === "video") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-20 text-on-surface-30">
        <Film className="h-3 w-3" />
      </span>
    );
  }
  return null;
}

export function isReadonlyPickerResourceBlock(type: BlockType): boolean {
  return PICKER_RESOURCE_TYPES.includes(type);
}

export function ReadonlyResourceValues({
  block,
  className,
}: {
  block: ScriptBlock;
  className?: string;
}) {
  const displayName =
    block.type === "event"
      ? block.content?.trim() || ""
      : resolveRegisteredResourceName(block.type, block.content);
  const isEmpty = isResourceValueEmpty(displayName);
  const isCharacter = block.type === "character";
  const isVideo = block.type === "video";

  const characterItem = isCharacter ? CHARACTERS.find((c) => c.name === displayName) : null;
  const backgroundItem =
    block.type === "background" ? BACKGROUNDS.find((b) => b.name === displayName) : null;
  const galleryItem =
    block.type === "gallery" ? GALLERIES.find((g) => g.name === displayName) : null;
  const thumbnailUrl =
    characterItem?.url ?? backgroundItem?.url ?? galleryItem?.url ?? null;

  const videoPlayback = (block.data?.playback as "loop" | "once" | undefined) ?? "loop";
  const videoPlaybackLabel = videoPlayback === "once" ? "한 번만" : "무한루프";

  return (
    <div className={cn("flex min-w-0 flex-1 flex-wrap items-center gap-my-8", className)}>
      <ReadonlyValueBox
        empty={isEmpty}
        label={isEmpty ? "선택 안됨" : displayName}
        leading={
          !isEmpty ? (
            <ResourceLeadingIcon
              blockType={block.type}
              displayName={displayName}
              thumbnailUrl={thumbnailUrl}
            />
          ) : null
        }
      />
      {isCharacter && !isEmpty && (
        <ReadonlyValueBox label={getCharacterExpressionLabel(block, displayName)} />
      )}
      {isVideo && !isEmpty && <ReadonlyValueBox label={videoPlaybackLabel} />}
    </div>
  );
}
