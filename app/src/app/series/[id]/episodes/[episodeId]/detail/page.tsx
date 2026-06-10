"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { EditorBodyReadOnly } from "@/components/editor/EditorBodyReadOnly";
import { SceneNavigation } from "@/components/editor/SceneNavigation";
import { EditorSceneTabStrip } from "@/components/editor/EditorSceneTabStrip";
import { EditorMobilePreviewPlayer } from "@/components/editor/EditorMobilePreviewPlayer";
import {
  EditorMobileTabBar,
  type EditorMobilePanel,
} from "@/components/editor/EditorMobileTabBar";
import { EpisodePromptReferenceModal } from "@/components/episode/EpisodePromptReferenceModal";
import { parseScriptToBlocks } from "@/utils/scriptParser";
import { useEditorStore, hydrateSeriesPersonaFromSession } from "@/store/useEditorStore";
import { useSceneClickHandler } from "@/hooks/useSceneClickHandler";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { EDITOR_SCENE_HEADER_ID, EDITOR_SCROLL_ROOT_ATTR } from "@/lib/editor-scroll";
import { INITIAL_SCRIPT } from "@/lib/initialScript";
import { cn } from "@/lib/utils";

/** 에피소드 상세(수정 불가 잉크 에디터 미리보기) */
export default function EpisodeDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useIsLgUp();
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
  const [mobilePanel, setMobilePanel] = useState<EditorMobilePanel>("edit");
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

  const scrollClassName = cn(
    "relative z-0 min-h-0 flex-1 overflow-y-auto overscroll-none",
    isDesktop ? "px-0 py-my-40" : "pb-my-8 pl-my-16 pr-my-12 pt-0",
  );

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {isDesktop ? (
          <aside
            className={
              isSceneSidebarCollapsed
                ? "w-fit shrink-0 overflow-y-auto border-r border-border-10 bg-white px-my-8"
                : "w-[240px] shrink-0 overflow-y-auto border-r border-border-10 bg-white"
            }
          >
            <SceneNavigation
              onSceneClick={handleSceneClick}
              collapsed={isSceneSidebarCollapsed}
              onToggleCollapsed={() => setIsSceneSidebarCollapsed((prev) => !prev)}
              showIssues={false}
            />
          </aside>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="w-full shrink-0 border-b border-border-10 bg-white">
              <header className="flex h-my-56 shrink-0 items-center justify-start py-0 pl-my-16 pr-my-12 lg:h-my-64 lg:px-my-24">
                <div className="flex w-full min-w-0 items-center justify-between gap-my-12">
                  <div className="flex min-w-0 items-center justify-start gap-my-8 lg:gap-my-12">
                    <HeaderBackButton onClick={handleBack} aria-label="에피소드 목록으로" />
                    <h1 className="min-w-0 truncate text-body1_700 text-on-surface-10 lg:text-heading2_700">
                      {episodeHeaderTitle}
                    </h1>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPromptModalOpen(true)}
                    className="h-8 w-8 shrink-0 rounded-full shadow-none disabled:border-border-20"
                    aria-label="에피소드 기준 프롬프트 보기"
                  >
                    <FileText className="h-4 w-4 text-on-surface-30" aria-hidden />
                  </Button>
                </div>
              </header>

              {!isDesktop && mobilePanel === "edit" ? (
                <div
                  id={EDITOR_SCENE_HEADER_ID}
                  className="relative w-full shrink-0 border-t border-border-10 bg-white"
                >
                  <EditorSceneTabStrip
                    onSceneClick={handleSceneClick}
                    className="w-full pl-my-16 pr-my-12"
                  />
                </div>
              ) : null}
            </div>

            {isDesktop ? (
              <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-white">
                <div className={scrollClassName} {...{ [EDITOR_SCROLL_ROOT_ATTR]: "" }}>
                  <EditorBodyReadOnly />
                </div>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "flex min-h-0 flex-1 flex-col overflow-hidden bg-white",
                    mobilePanel !== "edit" && "hidden",
                  )}
                >
                  <div className={scrollClassName} {...{ [EDITOR_SCROLL_ROOT_ATTR]: "" }}>
                    <EditorBodyReadOnly />
                  </div>
                </div>

                <div
                  className={cn(
                    "flex min-h-0 flex-1 flex-col overflow-hidden bg-black",
                    mobilePanel !== "preview" && "hidden",
                  )}
                >
                  <EditorMobilePreviewPlayer isActive={mobilePanel === "preview"} />
                </div>
              </>
            )}

            {!isDesktop ? (
              <EditorMobileTabBar
                active={mobilePanel}
                onChange={setMobilePanel}
                editTabLabel="원고"
                ariaLabel="에피소드 패널"
              />
            ) : null}
          </main>
        </div>

        <div
          id="profile-modal-portal"
          className="absolute left-0 top-0 h-0 w-0 overflow-visible"
          aria-hidden
        />
      </div>

      <EpisodePromptReferenceModal
        open={isPromptModalOpen}
        onOpenChange={setIsPromptModalOpen}
      />
    </div>
  );
}
