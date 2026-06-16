import {
  RESOURCE_DESCRIPTION_MAX,
  RESOURCE_NAME_MAX,
  type ResourceAiDraft,
} from "@/lib/resource-ai-draft-types";

function clampText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen - 1)}…` : trimmed;
}

export function normalizeResourceAiDraft(input: unknown): ResourceAiDraft {
  const record =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    name: clampText(record.name, RESOURCE_NAME_MAX),
    description: clampText(record.description, RESOURCE_DESCRIPTION_MAX),
  };
}

export function isResourceAiDraftUsable(draft: ResourceAiDraft): boolean {
  return draft.name.length > 0 && draft.description.length > 0;
}
