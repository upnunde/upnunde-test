"use client";

import React, { useState, useCallback, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { SeriesList } from "@/components/series/SeriesList";
import { SeriesDeleteModal } from "@/components/series/SeriesDeleteModal";
import { SeriesDetailPreviewModal } from "@/components/series/SeriesDetailPreviewModal";
import { PolicyAgreementModal } from "@/components/series/PolicyAgreementModal";
import { Snackbar } from "@/components/episode/Snackbar";
import {
  WorksVisibilityConfirmDialog,
  type WorksVisibilityAction,
} from "@/components/works/WorksVisibilityConfirmDialog";
import type { SeriesData } from "@/types/series";
import { useSeriesCatalogStore } from "@/store/useSeriesCatalogStore";

/**
 * 내 작품 — 시리즈 목록 (`/series`)
 */
export default function SeriesListPage() {
  const router = useRouter();
  const ensureDemoSeries = useSeriesCatalogStore((s) => s.ensureDemoSeries);
  const listSeries = useSeriesCatalogStore((s) => s.listSeries);
  const deleteSeries = useSeriesCatalogStore((s) => s.deleteSeries);
  const setSeriesStatus = useSeriesCatalogStore((s) => s.setSeriesStatus);

  const [seriesList, setSeriesList] = useState<SeriesData[]>([]);
  const [seriesToDelete, setSeriesToDelete] = useState<SeriesData | null>(null);
  const [detailSeries, setDetailSeries] = useState<SeriesData | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [visibilityTarget, setVisibilityTarget] = useState<SeriesData | null>(null);
  const [visibilityAction, setVisibilityAction] = useState<WorksVisibilityAction | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    const syncList = () => {
      ensureDemoSeries();
      startTransition(() => setSeriesList(listSeries()));
    };

    syncList();

    const unsubHydrate = useSeriesCatalogStore.persist.onFinishHydration(syncList);
    const unsubStore = useSeriesCatalogStore.subscribe(syncList);

    return () => {
      unsubHydrate();
      unsubStore();
    };
  }, [ensureDemoSeries, listSeries]);

  useEffect(() => {
    for (const series of seriesList) {
      router.prefetch(`/series/${series.id}/episodes`);
      router.prefetch(`/series/${series.id}/resources`);
      router.prefetch(`/series/${series.id}/edit`);
    }
  }, [router, seriesList]);

  const showSnackbar = useCallback((message: string) => {
    setSnackbar({ open: true, message });
  }, []);

  const handleEpisodeManage = useCallback(
    (series: SeriesData) => {
      router.push(`/series/${series.id}/episodes`);
    },
    [router],
  );

  const handleResourceManage = useCallback(
    (series: SeriesData) => {
      router.push(`/series/${series.id}/resources`);
    },
    [router],
  );

  const handleSeriesManage = useCallback(
    (series: SeriesData) => {
      router.push(`/series/${series.id}/edit`);
    },
    [router],
  );

  const handleCreateSeries = useCallback(() => {
    router.push("/series/new");
  }, [router]);

  const handleOpenCreateSeries = useCallback(() => {
    setPolicyModalOpen(true);
  }, []);

  const handleDeleteSeries = useCallback(
    (target: SeriesData) => {
      if (detailSeries?.id === target.id) setDetailSeries(null);
      deleteSeries(target.id);
      showSnackbar("시리즈를 삭제했습니다");
    },
    [deleteSeries, detailSeries?.id, showSnackbar],
  );

  const requestVisibility = useCallback((target: SeriesData, action: WorksVisibilityAction) => {
    setVisibilityTarget(target);
    setVisibilityAction(action);
  }, []);

  const handleConfirmVisibility = useCallback(() => {
    if (!visibilityTarget || !visibilityAction) return;
    if (visibilityAction === "private") {
      setSeriesStatus(visibilityTarget.id, "PRIVATE");
      showSnackbar("시리즈를 비공개로 전환했습니다");
    } else {
      setSeriesStatus(visibilityTarget.id, "PUBLIC");
      showSnackbar("시리즈를 공개했습니다");
    }
    setVisibilityTarget(null);
    setVisibilityAction(null);
  }, [setSeriesStatus, showSnackbar, visibilityAction, visibilityTarget]);

  return (
    <>
      <SeriesList
        seriesList={seriesList.filter((s) => s.status !== "BANNED")}
        onViewDetail={setDetailSeries}
        onResourceManage={handleResourceManage}
        onEpisodeManage={handleEpisodeManage}
        onSeriesManage={handleSeriesManage}
        onSetPrivate={(series) => requestVisibility(series, "private")}
        onSetPublic={(series) => requestVisibility(series, "public")}
        onDelete={setSeriesToDelete}
        onCreateSeries={handleOpenCreateSeries}
      />

      <SeriesDetailPreviewModal
        open={!!detailSeries}
        series={detailSeries}
        onOpenChange={(open) => {
          if (!open) setDetailSeries(null);
        }}
        onOpenEpisodes={handleEpisodeManage}
        onOpenResources={handleResourceManage}
        onContinueEdit={handleSeriesManage}
      />

      <SeriesDeleteModal
        open={!!seriesToDelete}
        series={seriesToDelete}
        onClose={() => setSeriesToDelete(null)}
        onConfirm={(s) => {
          handleDeleteSeries(s);
          setSeriesToDelete(null);
        }}
      />

      <WorksVisibilityConfirmDialog
        open={!!visibilityTarget && !!visibilityAction}
        action={visibilityAction}
        entityLabel="시리즈"
        onOpenChange={(open) => {
          if (!open) {
            setVisibilityTarget(null);
            setVisibilityAction(null);
          }
        }}
        onConfirm={handleConfirmVisibility}
      />

      <PolicyAgreementModal
        open={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        onConfirm={handleCreateSeries}
      />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </>
  );
}
