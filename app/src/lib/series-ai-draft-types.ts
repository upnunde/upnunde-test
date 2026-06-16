export interface SeriesAiDraft {
  title: string;
  summary: string;
  keywords: string[];
  worldview: string;
  prompt: string;
  persona: string;
}

export const SERIES_TITLE_MAX = 50;
export const SERIES_SUMMARY_MAX = 100;
export const SERIES_KEYWORD_MAX_COUNT = 8;
export const SERIES_KEYWORD_MAX_LEN = 12;
export const SERIES_WORLDVIEW_MAX = 500;
export const SERIES_PROMPT_MAX = 1500;
export const SERIES_PERSONA_MAX = 50;
export const SERIES_BRIEF_MAX = 5000;
