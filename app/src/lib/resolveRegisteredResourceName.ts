import type { BlockType } from "@/types/editor";
import { BACKGROUNDS, BGMS, CHARACTERS, GALLERIES, SFX, VIDEOS } from "@/lib/mockData";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function pickFallbackNameBySeed(
  names: string[],
  seedValue: string | undefined,
  fallbackSeed: string
): string {
  if (names.length === 0) return "";
  const seed = seedValue?.trim() || fallbackSeed;
  const idx = Math.abs(hashString(seed)) % names.length;
  return names[idx] ?? names[0] ?? "";
}

/** 리소스 블록 content → 표시용 이름 (none/빈 값은 빈 문자열) */
export function resolveRegisteredResourceName(
  type: BlockType,
  value: string | undefined
): string {
  const raw = (value ?? "").trim();
  const empty = raw === "" || raw === "none";
  if (empty) return "";

  switch (type) {
    case "background": {
      const names = BACKGROUNDS.map((x) => x.name);
      if (names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__bg_fallback__");
    }
    case "character": {
      const names = CHARACTERS.map((x) => x.name);
      if (names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__char_fallback__");
    }
    case "bgm": {
      const names = BGMS.map((x) => x.name);
      if (names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__bgm_fallback__");
    }
    case "sfx": {
      const names = SFX.map((x) => x.name);
      if (names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__sfx_fallback__");
    }
    case "gallery": {
      const names = GALLERIES.map((x) => x.name);
      if (names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__gallery_fallback__");
    }
    case "video": {
      const names = VIDEOS.map((x) => x.name);
      if (names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__video_fallback__");
    }
    default:
      return raw;
  }
}

export function isResourceValueEmpty(displayName: string): boolean {
  return !displayName || displayName === "none";
}
