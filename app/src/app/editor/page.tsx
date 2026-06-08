"use client";

import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import { EditorScriptBootstrap } from "@/components/editor/EditorScriptBootstrap";
import { EditorSubHeader } from "@/components/editor/EditorSubHeader";
import EditorBody from "@/components/editor/EditorBody";
import { SceneNavigation } from "@/components/editor/SceneNavigation";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import { IPhone15ProFrame } from "@/components/preview/IPhone15ProFrame";
import { EpisodeForm } from "@/components/episode/EpisodeForm";
import type { EpisodeFormSubmitPayload } from "@/components/episode/EpisodeForm";
import {
  EpisodeAutoGeneratorModal,
  type EpisodeAutoGeneratorPayload,
} from "@/components/episode/EpisodeAutoGeneratorModal";
import { applyInitialScriptToEditor } from "@/lib/apply-initial-script-to-editor";
import { useSceneClickHandler } from "@/hooks/useSceneClickHandler";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function EditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSceneClick = useSceneClickHandler();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isSceneSidebarCollapsed, setIsSceneSidebarCollapsed] = useState(false);
  const [isEpisodeInfoModalOpen, setIsEpisodeInfoModalOpen] = useState(false);
  const [isAutoGeneratorModalOpen, setIsAutoGeneratorModalOpen] = useState(false);
  const [autoGeneratorValues, setAutoGeneratorValues] = useState<EpisodeAutoGeneratorPayload>({
    history: "",
    script: "",
  });
  const episodeNo = useMemo(() => {
    const raw = searchParams.get("episodeNo");
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null;
  }, [searchParams]);
  const episodeTitle = useMemo(() => {
    const raw = searchParams.get("episodeTitle");
    return raw?.trim() || null;
  }, [searchParams]);
  const episodeSummary = useMemo(() => {
    const raw = searchParams.get("episodeSummary");
    return raw?.trim() || "";
  }, [searchParams]);
  const episodeThumbnail = useMemo(() => {
    const raw = searchParams.get("episodeThumbnail");
    return raw?.trim() || "";
  }, [searchParams]);
  const [episodeFormValues, setEpisodeFormValues] = useState({
    title: episodeTitle ?? "에피소드 제목",
    summary: episodeSummary,
    thumbnailUrl: episodeThumbnail,
  });
  const editorHeaderTitle =
    episodeNo != null
      ? `${episodeNo}화 ${episodeFormValues.title || "에피소드 제목"}`
      : "에피소드 에디터";
  const shouldStartEmpty = searchParams.get("startEmpty") === "1";
  const episodeHeaderSubtitle = episodeNo ? `${episodeNo}화 에피소드` : undefined;

  useEffect(() => {
    setEpisodeFormValues({
      title: episodeTitle ?? "에피소드 제목",
      summary: episodeSummary,
      thumbnailUrl: episodeThumbnail,
    });
  }, [episodeSummary, episodeThumbnail, episodeTitle]);

  const handleEpisodeInfoUpdate = useCallback(
    (payload: EpisodeFormSubmitPayload) => {
      setEpisodeFormValues(payload);
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("episodeTitle", payload.title);
      nextParams.set("episodeSummary", payload.summary);
      nextParams.set("episodeThumbnail", payload.thumbnailUrl);
      router.replace(`/editor?${nextParams.toString()}`);
      setIsEpisodeInfoModalOpen(false);
    },
    [router, searchParams],
  );
  const handleAutoGeneratorSave = useCallback((payload: EpisodeAutoGeneratorPayload) => {
    setAutoGeneratorValues(payload);
    applyInitialScriptToEditor();
    setIsAutoGeneratorModalOpen(false);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* 1. Global Top Header (Logo, User Avatar) - Full Width */}
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />

      {/* 2. Main Flex Container */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* 2-1. Left Sidebar (Scene List) - Fixed Width, Full Height */}
        <aside
          className={
            isSceneSidebarCollapsed
              ? "relative z-20 w-fit shrink-0 border-r border-border-10 bg-white overflow-visible px-2"
              : "w-[240px] shrink-0 border-r border-border-10 bg-white overflow-y-auto overscroll-none"
          }
        >
          <SceneNavigation
            onSceneClick={handleSceneClick}
            collapsed={isSceneSidebarCollapsed}
            onToggleCollapsed={() =>
              setIsSceneSidebarCollapsed((prev) => !prev)
            }
          />
        </aside>

        {/* 2-2. Right Content Area (Sub-header + Editor + Preview) */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <EditorScriptBootstrap routeKey={searchParams.toString()} startEmpty={shouldStartEmpty} />
          {/* 2-2-a. Sub Header (Back, Title, Actions) */}
          <div className="w-full border-b border-border-10">
            <EditorSubHeader
              key={searchParams.size === 0 ? "editor" : searchParams.toString()}
              title={editorHeaderTitle}
              onEditEpisodeInfo={() => setIsEpisodeInfoModalOpen(true)}
            />
          </div>

          {/* Container: fixed height, no scroll — only inner content scrolls */}
          <div className="flex flex-1 w-full min-h-0 overflow-hidden bg-white justify-center items-start">
            {/* Left Area: bordered panel fixed in view, only inner content scrolls */}
            <div className="relative flex flex-1 min-h-0 h-full w-full flex-col border-r border-border-10 overflow-hidden">
              <Button
                type="button"
                variant="ghost"
                size="form"
                className="absolute top-3 right-3 z-30 rounded-full bg-slate-800 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-700 hover:text-white"
                onClick={() => setIsAutoGeneratorModalOpen(true)}
              >
                에피소드 생성기
              </Button>
              <div className="relative z-0 flex-1 min-h-0 overflow-y-auto overscroll-none py-10 px-0">
                <EditorBody />
              </div>
            </div>

            {/* Right Area: Phone Preview (Fixed size, sticky to stay visible when scrolling) */}
            <div className="shrink-0 sticky top-10 h-full ml-auto p-10 flex flex-col justify-start items-center">
              <IPhone15ProFrame>
                <PreviewScreen />
              </IPhone15ProFrame>
            </div>
          </div>
        </main>

        {/* 2-3. Profile modal portal target (DOM order: 프로필 아이콘 바로 아래 위치용) */}
        <div id="profile-modal-portal" className="absolute left-0 top-0 w-0 h-0 overflow-visible" aria-hidden />
      </div>
      <Dialog open={isEpisodeInfoModalOpen} onOpenChange={setIsEpisodeInfoModalOpen}>
        <DialogContent
          className="flex h-[min(90vh,calc(100vh-80px))] w-[min(92vw,760px)] max-w-[760px] min-w-[560px] flex-col overflow-hidden border-0 bg-transparent p-0 shadow-none"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">에피소드 정보 수정</DialogTitle>
          <EpisodeForm
            onConverted={handleEpisodeInfoUpdate}
            onCancel={() => setIsEpisodeInfoModalOpen(false)}
            containerClassName="max-w-[760px] min-w-[560px]"
            stickyFooter
            sectionTitle={episodeHeaderSubtitle ?? "에피소드"}
            submitLabel="수정하기"
            initialValues={episodeFormValues}
          />
        </DialogContent>
      </Dialog>
      <EpisodeAutoGeneratorModal
        open={isAutoGeneratorModalOpen}
        onOpenChange={setIsAutoGeneratorModalOpen}
        episodeNo={episodeNo}
        initialValues={autoGeneratorValues}
        onSave={handleAutoGeneratorSave}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={null}>
      <EditorInner />
    </Suspense>
  );
}
