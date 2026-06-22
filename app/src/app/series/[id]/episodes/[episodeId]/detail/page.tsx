"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { EditorBodyReadOnly } from "@/components/editor/EditorBodyReadOnly";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import { SceneNavigation } from "@/components/editor/SceneNavigation";
import { IPhone15ProFrame } from "@/components/preview/IPhone15ProFrame";
import { EditorSceneTabStrip } from "@/components/editor/EditorSceneTabStrip";
import { EditorMobilePreviewPlayer } from "@/components/editor/EditorMobilePreviewPlayer";
import { EditorMobileFloatingActions } from "@/components/editor/EditorMobileFloatingActions";
import {
  EDITOR_MOBILE_PREVIEW_SHELL_CLASS,
  EDITOR_MOBILE_SCROLL_BOTTOM_PAD_FAB_ONLY_CLASS,
  editorMobilePreviewChromeHiddenClass,
  type EditorMobilePanel,
} from "@/components/editor/editor-mobile-floating-layout";
import { EpisodePromptReferenceModal } from "@/components/episode/EpisodePromptReferenceModal";
import { parseScriptToBlocks } from "@/utils/scriptParser";
import { useEditorStore, hydrateSeriesPersonaFromSession } from "@/store/useEditorStore";
import { useEditorMobileKeyboardScrollIntoView } from "@/hooks/useEditorMobileKeyboardScrollIntoView";
import { useEditorMobileSceneHeaderCollapse } from "@/hooks/useEditorMobileSceneHeaderCollapse";
import { useSceneClickHandler } from "@/hooks/useSceneClickHandler";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import {
  EDITOR_MOBILE_EDIT_SHELL_TRAP_CLASS,
  EDITOR_MOBILE_PAGE_ROOT_TRAP_CLASS,
  EDITOR_MOBILE_SCROLL_ROOT_TRAP_CLASS,
  EDITOR_MOBILE_SUB_HEADER_INNER_CLASS,
  EDITOR_SCENE_HEADER_ID,
  EDITOR_SCROLL_ROOT_ATTR,
  EDITOR_SUB_HEADER_SHELL_ID,
  editorMobileSceneHeaderShellClass,
  editorMobileSubHeaderHideVarStyle,
  editorMobileSubHeaderShellClass,
} from "@/lib/editor-scroll";
import { EDITOR_MOBILE_GUTTER_X_CLASS } from "@/lib/editor-block-layout";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import { APP_MAIN_PANEL_CLASS, APP_SHELL_BODY_ROW_CLASS, EDITOR_PAGE_SCROLL_CLASS } from "@/lib/page-layout";
import { INITIAL_SCRIPT } from "@/lib/initialScript";
import { cn } from "@/lib/utils";

function EpisodeReadOnlyWorkspace({
  isDesktop,
  mobilePanel,
  scrollClassName,
}: {
  isDesktop: boolean;
  mobilePanel: EditorMobilePanel;
  scrollClassName: string;
}) {
  if (isDesktop) {
    return (
      <div className="flex min-h-0 w-full flex-1 items-start justify-center overflow-hidden bg-white">
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden border-r border-border-10">
          <div className={scrollClassName} {...{ [EDITOR_SCROLL_ROOT_ATTR]: "" }}>
            <EditorBodyReadOnly />
          </div>
        </div>
        <div className="sticky top-10 ml-auto flex h-full shrink-0 flex-col items-center justify-start p-my-40">
          <IPhone15ProFrame>
            <PreviewScreen />
          </IPhone15ProFrame>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden bg-white", APP_MAIN_PANEL_CLASS)}>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          APP_MAIN_PANEL_CLASS,
          mobilePanel !== "edit" && "hidden",
        )}
      >
        <div className={scrollClassName} {...{ [EDITOR_SCROLL_ROOT_ATTR]: "" }}>
          <EditorBodyReadOnly />
        </div>
      </div>

      <div
        className={cn(
          EDITOR_MOBILE_PREVIEW_SHELL_CLASS,
          APP_MAIN_PANEL_CLASS,
          mobilePanel !== "preview" && "hidden",
        )}
      >
        <EditorMobilePreviewPlayer isActive={mobilePanel === "preview"} />
      </div>
    </div>
  );
}

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
  const mobileSubHeaderHide = useEditorMobileSceneHeaderCollapse(
    !isDesktop && mobilePanel === "edit",
  );
  useEditorMobileKeyboardScrollIntoView(!isDesktop && mobilePanel === "edit");

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
    EDITOR_PAGE_SCROLL_CLASS,
    isDesktop
      ? "px-0 py-my-40"
      : cn(
          EDITOR_MOBILE_GUTTER_X_CLASS,
          EDITOR_MOBILE_SCROLL_ROOT_TRAP_CLASS,
          "max-lg:pt-my-12",
          EDITOR_MOBILE_SCROLL_BOTTOM_PAD_FAB_ONLY_CLASS,
        ),
  );

  const previewChromeHidden = editorMobilePreviewChromeHiddenClass(isDesktop, mobilePanel);

  return (
    <div
      className={cn(
        APP_PAGE_ROOT_CLASS,
        APP_BROWSER_BG_CLASS,
        !isDesktop && mobilePanel === "edit" && EDITOR_MOBILE_PAGE_ROOT_TRAP_CLASS,
      )}
    >
      <div className={cn(previewChromeHidden)}>
        <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      </div>
      <div
        className={cn(
          APP_SHELL_BODY_ROW_CLASS,
          !isDesktop && mobilePanel === "edit" && EDITOR_MOBILE_EDIT_SHELL_TRAP_CLASS,
        )}
      >
        {isDesktop ? (
          <aside
            className={
              isSceneSidebarCollapsed
                ? "w-fit shrink-0 overflow-y-auto border-r border-border-10 bg-white px-my-8"
                : "w-[240px] shrink-0 self-stretch min-h-0 overflow-y-auto border-r border-border-10 bg-white"
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

        <main
          className={cn(
            "flex min-w-0 flex-col",
            APP_MAIN_PANEL_CLASS,
            !isDesktop && mobilePanel === "edit" && EDITOR_MOBILE_EDIT_SHELL_TRAP_CLASS,
          )}
          style={
            !isDesktop && mobilePanel === "edit"
              ? editorMobileSubHeaderHideVarStyle(mobileSubHeaderHide.hiddenPx)
              : undefined
          }
        >
          <div
            id={EDITOR_SUB_HEADER_SHELL_ID}
            className={cn(
              editorMobileSubHeaderShellClass(mobileSubHeaderHide.isFullyHidden),
              previewChromeHidden,
            )}
          >
            <div className={EDITOR_MOBILE_SUB_HEADER_INNER_CLASS}>
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
            </div>
          </div>

          {!isDesktop && mobilePanel === "edit" ? (
            <div
              id={EDITOR_SCENE_HEADER_ID}
              className={cn(editorMobileSceneHeaderShellClass(), "max-lg:block")}
            >
              <EditorSceneTabStrip
                onSceneClick={handleSceneClick}
                className="w-full"
              />
            </div>
          ) : null}

          <EpisodeReadOnlyWorkspace
            isDesktop={isDesktop}
            mobilePanel={mobilePanel}
            scrollClassName={scrollClassName}
          />

          {!isDesktop ? (
            <EditorMobileFloatingActions
              active={mobilePanel}
              onChange={setMobilePanel}
              editTargetLabel="원고"
              hasBlockToolbar={false}
            />
          ) : null}
        </main>

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
