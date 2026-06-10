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
import { useEditorMobileSceneHeaderCollapse } from "@/hooks/useEditorMobileSceneHeaderCollapse";
import { EditorAutoGeneratorFloatingButton } from "@/components/editor/EditorAutoGeneratorFloatingButton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formDialogShellClassName, formDialogSheetBodyWrapperClassName, formDialogSheetEpisodeFormClassName } from "@/components/ui/modal";
import { EDITOR_SCENE_HEADER_ID, EDITOR_SCROLL_ROOT_ATTR } from "@/lib/editor-scroll";
import { APP_VIEWPORT_SHELL_CLASS } from "@/lib/mobile-viewport";
import { useVisualKeyboardInset } from "@/hooks/useVisualKeyboardInset";
import { useClientMounted } from "@/hooks/useClientMounted";
import { useEditorStore } from "@/store/useEditorStore";
import {
  EDITOR_MOBILE_SCROLL_BOTTOM_PAD_FAB_ONLY_CLASS,
  EDITOR_MOBILE_SCROLL_BOTTOM_PAD_WITH_TOOLBAR_CLASS,
  isEditorMobileBlockToolbarVisible,
} from "@/components/editor/editor-mobile-floating-layout";
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
    "relative z-0 min-h-0 flex-1 overflow-y-auto overscroll-none",
    isDesktop
      ? "py-my-40 px-0"
      : cn(
          "px-my-12 pt-0",
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden",
          mobilePanel !== "edit" && "hidden",
        )}
      >
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className={editorScrollClass} {...{ [EDITOR_SCROLL_ROOT_ATTR]: "" }}>
            <EditorBody />
          </div>
        </div>
        {!isDesktop && mobilePanel === "edit" ? <EditorMobileBlockToolbar /> : null}
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden bg-black",
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

  const mobileSubHeaderCollapsed = useEditorMobileSceneHeaderCollapse(
    !isDesktop && mobilePanel === "edit",
  );

  return (
    <div className={cn(APP_VIEWPORT_SHELL_CLASS, "bg-white")}>
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {isDesktop ? (
          <aside
            className={
              isSceneSidebarCollapsed
                ? "relative z-20 w-fit shrink-0 overflow-visible border-r border-border-10 bg-white px-my-8"
                : "w-[240px] shrink-0 overflow-y-auto overscroll-none border-r border-border-10 bg-white"
            }
          >
            <SceneNavigation
              onSceneClick={handleSceneClick}
              collapsed={isSceneSidebarCollapsed}
              onToggleCollapsed={() => setIsSceneSidebarCollapsed((prev) => !prev)}
            />
          </aside>
        ) : null}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <EditorScriptBootstrap routeKey={searchParams.toString()} startEmpty={shouldStartEmpty} />

          <div className="w-full shrink-0 border-b border-border-10 bg-white">
            <div
              className={cn(
                "overflow-hidden max-lg:transition-[max-height] max-lg:duration-200 max-lg:ease-out max-lg:max-h-14",
                mobileSubHeaderCollapsed && "max-lg:max-h-0",
              )}
            >
              <div
                className={cn(
                  "max-lg:transition-transform max-lg:duration-200 max-lg:ease-out",
                  mobileSubHeaderCollapsed && "max-lg:-translate-y-full",
                )}
              >
                <EditorSubHeader
                  key={searchParams.size === 0 ? "editor" : searchParams.toString()}
                  title={editorHeaderTitle}
                  onEditEpisodeInfo={() => setIsEpisodeInfoModalOpen(true)}
                />
              </div>
            </div>

            <div
              id={EDITOR_SCENE_HEADER_ID}
              className={cn(
                "relative hidden w-full shrink-0 overflow-visible border-t border-border-10 bg-white",
                mobilePanel === "edit" && "max-lg:block",
              )}
            >
              <EditorSceneTabStrip
                onSceneClick={handleSceneNavigate}
                className="w-full px-my-12"
              />
              <EditorAutoGeneratorFloatingButton
                placement="below-tabs"
                compact={mobileSubHeaderCollapsed}
                onClick={() => setIsAutoGeneratorModalOpen(true)}
              />
            </div>
          </div>

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
