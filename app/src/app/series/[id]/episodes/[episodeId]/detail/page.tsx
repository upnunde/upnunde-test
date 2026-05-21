"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { EditorBodyReadOnly } from "@/components/editor/EditorBodyReadOnly";
import { SceneNavigation } from "@/components/editor/SceneNavigation";
import { EpisodePromptReferenceModal } from "@/components/episode/EpisodePromptReferenceModal";
import { parseScriptToBlocks } from "@/utils/scriptParser";
import { useEditorStore, hydrateSeriesPersonaFromSession } from "@/store/useEditorStore";
import { useSceneClickHandler } from "@/hooks/useSceneClickHandler";
import { INITIAL_SCRIPT } from "@/lib/initialScript";

/** 에피소드 상세(수정 불가 잉크 에디터 미리보기) */
export default function EpisodeDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const seriesId = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] ?? "";
  }, [pathname]);
  const episodeHeaderTitle = useMemo(() => {
    const rawNo = searchParams.get("episodeNo");
    const parsedNo = rawNo ? Number(rawNo) : NaN;
    const episodeNo = Number.isFinite(parsedNo) && parsedNo > 0 ? Math.floor(parsedNo) : null;
    const episodeTitle = searchParams.get("episodeTitle")?.trim() || "에피소드 제목";
    return episodeNo ? `${episodeNo}화 ${episodeTitle}` : "에피소드 상세";
  }, [searchParams]);
  const setBlocks = useEditorStore((s) => s.setBlocks);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isSceneSidebarCollapsed, setIsSceneSidebarCollapsed] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const handleSceneClick = useSceneClickHandler();

  useEffect(() => {
    hydrateSeriesPersonaFromSession();
  }, []);

  useEffect(() => {
    const parsed = parseScriptToBlocks(INITIAL_SCRIPT);
    setBlocks(parsed.length > 0 ? parsed : []);
  }, [pathname, setBlocks]);

  const handleBack = () => {
    router.push(`/series/${seriesId}/episodes`);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* 장면 위치 찾아가는 사이드바 (잉크 에디터와 동일) */}
        <aside
          className={
            isSceneSidebarCollapsed
              ? "w-fit shrink-0 border-r border-border-10 bg-white overflow-y-auto px-2"
              : "w-[240px] shrink-0 border-r border-border-10 bg-white overflow-y-auto"
          }
        >
          <SceneNavigation
            onSceneClick={handleSceneClick}
            collapsed={isSceneSidebarCollapsed}
            onToggleCollapsed={() => setIsSceneSidebarCollapsed((prev) => !prev)}
            showIssues={false}
          />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center justify-start border-b border-border-10 bg-white px-6 py-0">
              <div className="flex w-full min-w-[800px] items-center justify-between gap-3">
                <div className="flex items-center justify-start gap-3">
                  <HeaderBackButton onClick={handleBack} aria-label="에피소드 목록으로" />
                  <h1 className="text-2xl font-bold text-on-surface-10">{episodeHeaderTitle}</h1>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPromptModalOpen(true)}
                  className="h-8 w-8 shrink-0 rounded-full border-border-10 shadow-none"
                  aria-label="에피소드 기준 프롬프트 보기"
                >
                  <FileText className="h-4 w-4 text-on-surface-30" aria-hidden />
                </Button>
              </div>
            </header>

            <div className="flex flex-1 w-full min-h-0 overflow-hidden bg-white justify-center items-start">
              <div className="flex flex-1 min-h-0 h-full w-full flex-col overflow-hidden">
                <div className="py-10 px-0 flex-1 min-h-0 overflow-y-auto overscroll-none">
                  <EditorBodyReadOnly />
                </div>
              </div>
            </div>
          </main>
        </div>
        <div id="profile-modal-portal" className="absolute left-0 top-0 w-0 h-0 overflow-visible" aria-hidden />
      </div>
      <EpisodePromptReferenceModal
        open={isPromptModalOpen}
        onOpenChange={setIsPromptModalOpen}
      />
    </div>
  );
}
