import type { CharacterData } from "@/types/character";

export const MY_WORKS_PENDING_CHARACTER_STORAGE_KEY = "my-works-pending-character";

export function buildMyWorksCharacterFromForm(input: {
  name: string;
  summary: string;
  thumbnailUrl: string | null;
}): CharacterData {
  const trimmedName = input.name.trim();
  const trimmedSummary = input.summary.trim();

  return {
    id: `c-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    title: trimmedName || "제목 없음",
    tagline: trimmedSummary,
    thumbnailUrl: input.thumbnailUrl ?? undefined,
    status: "PRIVATE",
    createdAt: new Date().toISOString(),
    viewCount: 0,
    stat1: 0,
    stat2: 0,
  };
}

export function stageMyWorksPendingCharacter(character: CharacterData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MY_WORKS_PENDING_CHARACTER_STORAGE_KEY, JSON.stringify(character));
}

export function consumeMyWorksPendingCharacter(): CharacterData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(MY_WORKS_PENDING_CHARACTER_STORAGE_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(MY_WORKS_PENDING_CHARACTER_STORAGE_KEY);
  try {
    return JSON.parse(raw) as CharacterData;
  } catch {
    return null;
  }
}
