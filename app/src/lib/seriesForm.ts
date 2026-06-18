import { parseTagList } from "@/lib/parse-tag-list";
import type { SeriesFormRecord } from "@/types/series";

export type SeriesFormTab = "image" | "info" | "worldview";

export interface SeriesFormSubmitPayload {
  seriesTitle: string;
  seriesSummary: string;
  seriesKeywords: string;
  keywordList: string[];
  worldviewDescription: string;
  worldviewPrompt: string;
  persona: string;
  coverPreviewUrl: string | null;
  logoPreviewUrl: string | null;
}

export interface SeriesFormInitialSnapshot extends SeriesFormSubmitPayload {
  hasCoverImage: boolean;
  hasLogoImage: boolean;
}

export function seriesRecordToFormSnapshot(record: SeriesFormRecord): SeriesFormInitialSnapshot {
  return {
    seriesTitle: record.title,
    seriesSummary: record.summary,
    seriesKeywords: record.keywords.join(", "),
    keywordList: [...record.keywords],
    worldviewDescription: record.worldviewDescription,
    worldviewPrompt: record.worldviewPrompt,
    persona: record.persona,
    coverPreviewUrl: record.coverImageUrl || null,
    logoPreviewUrl: record.logoImageUrl || null,
    hasCoverImage: Boolean(record.coverImageUrl),
    hasLogoImage: Boolean(record.logoImageUrl),
  };
}

export type SeriesFormField =
  | "cover"
  | "logo"
  | "title"
  | "summary"
  | "keywords"
  | "worldview"
  | "prompt"
  | "persona";

export type SeriesFormErrors = Record<SeriesFormField, boolean>;

export const EMPTY_SERIES_FORM_ERRORS: SeriesFormErrors = {
  cover: false,
  logo: false,
  title: false,
  summary: false,
  keywords: false,
  worldview: false,
  prompt: false,
  persona: false,
};

export interface SeriesFormValidationInput {
  hasCoverImage: boolean;
  hasLogoImage: boolean;
  seriesTitle: string;
  seriesSummary: string;
  seriesKeywords: string;
  worldviewDescription: string;
  worldviewPrompt: string;
  persona: string;
}

export const SERIES_FORM_ERROR_FOCUS_ORDER: Array<{
  field: SeriesFormField;
  tab: SeriesFormTab;
}> = [
  { field: "cover", tab: "image" },
  { field: "logo", tab: "image" },
  { field: "title", tab: "info" },
  { field: "summary", tab: "info" },
  { field: "keywords", tab: "info" },
  { field: "worldview", tab: "info" },
  { field: "prompt", tab: "worldview" },
  { field: "persona", tab: "worldview" },
];

export function getSeriesFormErrors(input: SeriesFormValidationInput): SeriesFormErrors {
  return {
    cover: !input.hasCoverImage,
    logo: !input.hasLogoImage,
    title: input.seriesTitle.trim().length === 0,
    summary: input.seriesSummary.trim().length === 0,
    keywords: parseTagList(input.seriesKeywords).length === 0,
    worldview: input.worldviewDescription.trim().length === 0,
    prompt: input.worldviewPrompt.trim().length === 0,
    persona: input.persona.trim().length === 0,
  };
}

export function isSeriesFormValid(errors: SeriesFormErrors): boolean {
  return !Object.values(errors).some(Boolean);
}
