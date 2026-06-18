import type { SeriesFormSubmitPayload } from "@/lib/seriesForm";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { persistableImageUrl } from "@/lib/persistable-image-url";
import { createMockSeriesRecords } from "@/lib/series-mock-seed";
import {
  seriesFormRecordToListItem,
  type SeriesData,
  type SeriesFormRecord,
  type SeriesStatus,
} from "@/types/series";

interface SeriesCatalogState {
  seriesById: Record<string, SeriesFormRecord>;
  orderedIds: string[];
  /** 데모 시리즈(1·2·4)가 목록에 포함되도록 보충 — 사용자 작품은 유지 */
  ensureDemoSeries: () => void;
  addSeries: (payload: SeriesFormSubmitPayload) => Promise<string>;
  updateSeries: (id: string, payload: SeriesFormSubmitPayload) => Promise<void>;
  deleteSeries: (id: string) => void;
  setSeriesStatus: (id: string, status: SeriesStatus) => void;
  getSeries: (id: string) => SeriesFormRecord | undefined;
  listSeries: () => SeriesData[];
}

function generateSeriesId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `series-${Date.now()}`;
}

async function payloadToRecord(
  payload: SeriesFormSubmitPayload,
  base: Pick<SeriesFormRecord, "id" | "status" | "createdAt" | "episodeCount" | "viewCount" | "commentCount">,
): Promise<SeriesFormRecord> {
  const [coverImageUrl, logoImageUrl] = await Promise.all([
    persistableImageUrl(payload.coverPreviewUrl),
    persistableImageUrl(payload.logoPreviewUrl),
  ]);

  return {
    ...base,
    title: payload.seriesTitle.trim(),
    summary: payload.seriesSummary.trim(),
    keywords: [...payload.keywordList],
    worldviewDescription: payload.worldviewDescription.trim(),
    worldviewPrompt: payload.worldviewPrompt.trim(),
    persona: payload.persona.trim(),
    coverImageUrl,
    logoImageUrl,
  };
}

export const useSeriesCatalogStore = create<SeriesCatalogState>()(
  persist(
    (set, get) => ({
      seriesById: {},
      orderedIds: [],

      ensureDemoSeries: () => {
        const state = get();
        const mocks = createMockSeriesRecords();
        const seriesById = { ...state.seriesById };
        const orderedIds = [...state.orderedIds];
        let changed = false;

        for (const mock of mocks) {
          if (!seriesById[mock.id]) {
            seriesById[mock.id] = mock;
            orderedIds.push(mock.id);
            changed = true;
          }
        }

        if (changed) {
          set({ seriesById, orderedIds });
        }
      },

      addSeries: async (payload) => {
        const id = generateSeriesId();
        const record = await payloadToRecord(payload, {
          id,
          status: "PRIVATE",
          createdAt: new Date().toISOString(),
          episodeCount: 0,
          viewCount: 0,
          commentCount: 0,
        });

        set((state) => ({
          seriesById: { ...state.seriesById, [id]: record },
          orderedIds: [id, ...state.orderedIds],
        }));

        return id;
      },

      updateSeries: async (id, payload) => {
        const existing = get().seriesById[id];
        if (!existing) return;

        const record = await payloadToRecord(payload, {
          id: existing.id,
          status: existing.status,
          createdAt: existing.createdAt,
          episodeCount: existing.episodeCount,
          viewCount: existing.viewCount,
          commentCount: existing.commentCount,
        });

        set((state) => ({
          seriesById: { ...state.seriesById, [id]: record },
        }));
      },

      deleteSeries: (id) => {
        set((state) => {
          const { [id]: _removed, ...seriesById } = state.seriesById;
          return {
            seriesById,
            orderedIds: state.orderedIds.filter((itemId) => itemId !== id),
          };
        });
      },

      setSeriesStatus: (id, status) => {
        set((state) => {
          const existing = state.seriesById[id];
          if (!existing) return state;
          return {
            seriesById: {
              ...state.seriesById,
              [id]: { ...existing, status },
            },
          };
        });
      },

      getSeries: (id) => get().seriesById[id],

      listSeries: () =>
        get()
          .orderedIds.map((id) => get().seriesById[id])
          .filter((record): record is SeriesFormRecord => Boolean(record))
          .map(seriesFormRecordToListItem),
    }),
    {
      name: "upnunde-series-catalog",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        seriesById: state.seriesById,
        orderedIds: state.orderedIds,
      }),
    },
  ),
);
