"use client";

import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import { EditorScriptBootstrap } from "@/components/editor/EditorScriptBootstrap";
import { EditorSubHeader } from "@/components/editor/EditorSubHeader";
import EditorBody from "@/components/editor/EditorBody";
import { SceneNavigation } from "@/components/editor/SceneNavigation";
import { EditorSceneTabStrip } from "@/components/editor/EditorSceneTabStrip";
import { EditorMobileBlockToolbar } from "@/components/editor/EditorMobileBlockToolbar";
import { EditorMobileFloatingActions } from "@/components/editor/EditorMobileFloatingActions";
import { EditorMobilePreviewPlayer } from "@/components/editor/EditorMobilePreviewPlayer";
import type { EditorMobilePanel } from "@/components/editor/editor-mobile-floating-layout";
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
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { useEditorMobileKeyboardScrollIntoView } from "@/hooks/useEditorMobileKeyboardScrollIntoView";
import { useEditorMobileSceneHeaderCollapse } from "@/hooks/useEditorMobileSceneHeaderCollapse";
import { EditorAutoGeneratorFloatingButton } from "@/components/editor/EditorAutoGeneratorFloatingButton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formDialogShellClassName, formDialogSheetBodyWrapperClassName, formDialogSheetEpisodeFormClassName } from "@/components/ui/modal";
import {
  EDITOR_MOBILE_SUB_HEADER_INNER_CLASS,
  EDITOR_SCENE_HEADER_ID,
  EDITOR_SCROLL_ROOT_ATTR,
  EDITOR_SUB_HEADER_SHELL_ID,
  editorMobileSceneHeaderShellClass,
  editorMobileSubHeaderHideVarStyle,
  editorMobileSubHeaderShellClass,
} from "@/lib/editor-scroll";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import {
  APP_MAIN_PANEL_CLASS,
  APP_SHELL_BODY_ROW_CLASS,
  EDITOR_PAGE_SCROLL_CLASS,
} from "@/lib/page-layout";
import { useVisualKeyboardInset } from "@/hooks/useVisualKeyboardInset";
import { useClientMounted } from "@/hooks/useClientMounted";
import { useEditorStore } from "@/store/useEditorStore";
import {
  EDITOR_MOBILE_PREVIEW_SHELL_CLASS,
  EDITOR_MOBILE_SCROLL_BOTTOM_PAD_FAB_ONLY_CLASS,
  EDITOR_MOBILE_SCROLL_BOTTOM_PAD_WITH_TOOLBAR_CLASS,
  editorMobilePreviewChromeHiddenClass,
  isEditorMobileBlockToolbarVisible,
} from "@/components/editor/editor-mobile-floating-layout";
import { EDITOR_MOBILE_GUTTER_X_CLASS } from "@/lib/editor-block-layout";
import { cn } from "@/lib/utils";

function EditorWorkspace({
  isDesktop,
  mobilePanel,
  onOpenAutoGenerator,
}: {
  isDesktop: boolean;
  mobilePanel: EditorMobilePanel;
  onOpenAutoGenerator: () => void;
}) {
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const mobileKeyboardEditBlockId = useEditorStore((s) => s.mobileKeyboardEditBlockId);
  const { isKeyboardOpen } = useVisualKeyboardInset();
  const mounted = useClientMounted();
  const mobileToolbarVisible =
    mounted &&
    !isDesktop &&
    mobilePanel === "edit" &&
    isEditorMobileBlockToolbarVisible({
      focusBlockId,
      isKeyboardOpen,
      mobileKeyboardEditBlockId,
    });

  const editorScrollClass = cn(
    EDITOR_PAGE_SCROLL_CLASS,
    isDesktop
      ? "py-my-40 px-0"
      : cn(
          EDITOR_MOBILE_GUTTER_X_CLASS,
          "max-lg:pt-my-12",
          mobileToolbarVisible
            ? EDITOR_MOBILE_SCROLL_BOTTOM_PAD_WITH_TOOLBAR_CLASS
            : EDITOR_MOBILE_SCROLL_BOTTOM_PAD_FAB_ONLY_CLASS,
        ),
  );

  if (isDesktop) {
    return (
      <div className="flex min-h-0 w-full flex-1 items-start justify-center overflow-hidden bg-white">
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden border-r border-border-10">
          <EditorAutoGeneratorFloatingButton onClick={onOpenAutoGenerator} />
          <div className={editorScrollClass} {...{ [EDITOR_SCROLL_ROOT_ATTR]: "" }}>
            <EditorBody />
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
    <div className={cn("flex flex-col bg-white", APP_MAIN_PANEL_CLASS)}>
      <div
        className={cn(
          "flex flex-col",
          APP_MAIN_PANEL_CLASS,
          mobilePanel !== "edit" && "hidden",
        )}
      >
        <div className={editorScrollClass} {...{ [EDITOR_SCROLL_ROOT_ATTR]: "" }}>
          <EditorBody />
        </div>
        {!isDesktop && mobilePanel === "edit" ? <EditorMobileBlockToolbar /> : null}
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

function EditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSceneClick = useSceneClickHandler();
  const isDesktop = useIsLgUp();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isSceneSidebarCollapsed, setIsSceneSidebarCollapsed] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<EditorMobilePanel>("edit");
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

  const handleSceneNavigate = useCallback(
    (blockId: string) => {
      handleSceneClick(blockId);
      setMobilePanel("edit");
    },
    [handleSceneClick],
  );

  const mobileSubHeaderHide = useEditorMobileSceneHeaderCollapse(
    !isDesktop && mobilePanel === "edit",
  );
  useEditorMobileKeyboardScrollIntoView(!isDesktop && mobilePanel === "edit");

  const previewChromeHidden = editorMobilePreviewChromeHiddenClass(isDesktop, mobilePanel);

  return (
    <div className={cn(APP_PAGE_ROOT_CLASS, APP_BROWSER_BG_CLASS)}>
      <div className={cn(previewChromeHidden)}>
        <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      </div>

      <div className={APP_SHELL_BODY_ROW_CLASS}>
        {isDesktop ? (
          <aside
            className={
              isSceneSidebarCollapsed
                ? "relative z-20 w-fit shrink-0 overflow-visible border-r border-border-10 bg-white px-my-8"
                : "w-[240px] shrink-0 self-stretch min-h-0 overflow-y-auto overscroll-none border-r border-border-10 bg-white"
            }
          >
            <SceneNavigation
              onSceneClick={handleSceneClick}
              collapsed={isSceneSidebarCollapsed}
              onToggleCollapsed={() => setIsSceneSidebarCollapsed((prev) => !prev)}
            />
          </aside>
        ) : null}

        <main
          className={cn("flex min-w-0 flex-col", APP_MAIN_PANEL_CLASS)}
          style={
            !isDesktop && mobilePanel === "edit"
              ? editorMobileSubHeaderHideVarStyle(mobileSubHeaderHide.hiddenPx)
              : undefined
          }
        >
          <EditorScriptBootstrap routeKey={searchParams.toString()} startEmpty={shouldStartEmpty} />

          <div
            id={EDITOR_SUB_HEADER_SHELL_ID}
            className={cn(
              editorMobileSubHeaderShellClass(mobileSubHeaderHide.isFullyHidden),
              previewChromeHidden,
            )}
          >
            <div className={EDITOR_MOBILE_SUB_HEADER_INNER_CLASS}>
              <EditorSubHeader
                key={searchParams.size === 0 ? "editor" : searchParams.toString()}
                title={editorHeaderTitle}
                onEditEpisodeInfo={() => setIsEpisodeInfoModalOpen(true)}
              />
            </div>
          </div>

          {!isDesktop && mobilePanel === "edit" ? (
            <div
              id={EDITOR_SCENE_HEADER_ID}
              className={cn(editorMobileSceneHeaderShellClass(), "max-lg:block")}
            >
              <EditorSceneTabStrip
                onSceneClick={handleSceneNavigate}
                className="w-full"
              />
              <EditorAutoGeneratorFloatingButton
                placement="below-tabs"
                compact={mobileSubHeaderHide.isFullyHidden}
                onClick={() => setIsAutoGeneratorModalOpen(true)}
              />
            </div>
          ) : null}

          <EditorWorkspace
            isDesktop={isDesktop}
            mobilePanel={mobilePanel}
            onOpenAutoGenerator={() => setIsAutoGeneratorModalOpen(true)}
          />

          {!isDesktop ? (
            <EditorMobileFloatingActions
              active={mobilePanel}
              onChange={setMobilePanel}
              showIssueFab
            />
          ) : null}
        </main>

        <div
          id="profile-modal-portal"
          className="absolute left-0 top-0 h-0 w-0 overflow-visible"
          aria-hidden
        />
      </div>

      <Dialog open={isEpisodeInfoModalOpen} onOpenChange={setIsEpisodeInfoModalOpen}>
        <DialogContent
          presentation="auto"
          className={formDialogShellClassName}
          aria-describedby={undefined}
        >
          <div className={formDialogSheetBodyWrapperClassName}>
            <header className="shrink-0 border-b border-border-10 px-my-12 py-my-16 lg:sr-only lg:border-0 lg:p-0">
              <DialogTitle className="text-body1_700 text-on-surface-10">
                에피소드 정보 수정
              </DialogTitle>
            </header>
            <EpisodeForm
              onConverted={handleEpisodeInfoUpdate}
              onCancel={() => setIsEpisodeInfoModalOpen(false)}
              containerClassName={formDialogSheetEpisodeFormClassName}
              stickyFooter
              sectionTitle={episodeHeaderSubtitle ?? "에피소드"}
              submitLabel="수정하기"
              initialValues={episodeFormValues}
            />
          </div>
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
