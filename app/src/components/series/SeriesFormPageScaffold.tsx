"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import { APP_MAIN_CLASS, APP_MAIN_PANEL_CLASS } from "@/lib/page-layout";
import Header from "@/components/Header/Header";
import {
  deriveSidebarActiveId,
  MobileAppSidebarDrawer,
} from "@/components/layout/MobileAppSidebarDrawer";
import { PageCard } from "@/components/layout/PageCard";
import { Button } from "design-system/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { SeriesFormTabs } from "@/components/series/SeriesFormTabs";
import { EditorMobileFloatingActions } from "@/components/editor/EditorMobileFloatingActions";
import { FloatingAiComposerPortal } from "@/components/ui/FloatingAiComposerPortal";
import { SeriesFormMobileChromeProvider } from "@/components/series/SeriesFormMobileChromeContext";
import { SeriesFormMobileSubmitBar } from "@/components/series/SeriesFormMobileSubmitBar";
import {
  SERIES_FORM_MOBILE_FLOATING_ROW_BOTTOM_CLASS,
  SERIES_FORM_MOBILE_SCROLL_PAD_CLASS,
  SERIES_FORM_MOBILE_SCROLL_PAD_WITH_COMPOSER_CLASS,
} from "@/lib/series-form-mobile-layout";
import {
  editorMobilePreviewChromeHiddenClass,
  type EditorMobilePanel,
} from "@/components/editor/editor-mobile-floating-layout";
import { SeriesPreviewPanel } from "@/components/series/SeriesPreviewPanel";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import {
  PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  PAGE_SCROLL_COLUMN_CLASS,
  PAGE_SUBHEADER_WITH_STICKY_CLASS,
} from "@/lib/page-layout";
import { cn } from "design-system/utils";
import { space } from "@/lib/spacing";
import type { SeriesFormTab } from "@/lib/seriesForm";

export interface SeriesFormAiComposerConfig {
  briefPrompt: string;
  onBriefChange: (value: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  placeholder?: string;
  loadingMessage?: string;
  ariaLabel?: string;
}

interface SeriesFormPageScaffoldProps {
  profileImageUrl: string | null;
  onProfileImageChange: (value: string | null) => void;
  title: string;
  activeTab: SeriesFormTab;
  onTabChange: (tab: SeriesFormTab) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  coverPreviewUrl: string | null;
  logoPreviewUrl: string | null;
  seriesTitle?: string;
  seriesSummary?: string;
  keywordList?: readonly string[];
  worldviewDescription?: string;
  children: ReactNode;
  showDraftButton?: boolean;
  onDraftClick?: () => void;
  draftDisabled?: boolean;
  submitLabel?: string;
  contentGapClassName?: string;
  aiComposer?: SeriesFormAiComposerConfig;
}

export function SeriesFormPageScaffold({
  profileImageUrl,
  onProfileImageChange,
  title,
  activeTab,
  onTabChange,
  onBack,
  onSubmit,
  submitDisabled,
  coverPreviewUrl,
  logoPreviewUrl,
  seriesTitle = "",
  seriesSummary = "",
  keywordList = [],
  worldviewDescription = "",
  children,
  showDraftButton = false,
  onDraftClick,
  draftDisabled = false,
  submitLabel = "등록하기",
  contentGapClassName = space.form.formGroupGapRelaxed.className,
  aiComposer,
}: SeriesFormPageScaffoldProps) {
  const isLgUp = useIsLgUp();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<EditorMobilePanel>("edit");
  const showFormPanel = isLgUp || mobilePanel === "edit";
  const showPreviewPanel = !isLgUp && mobilePanel === "preview";
  const previewChromeHidden = editorMobilePreviewChromeHiddenClass(isLgUp, mobilePanel);
  /** 모바일 하단 제출 바 — 입력·미리보기 공통 (FAB·컴포저 행 높이 고정) */
  const showMobileSubmitBar = !isLgUp;
  /** AI 컴포저 — 입력 패널에서만, FAB과 한 행으로 정렬 */
  const showMobileComposer = Boolean(aiComposer) && showFormPanel && !isLgUp;
  const mobileScrollPadClass = showMobileComposer
    ? SERIES_FORM_MOBILE_SCROLL_PAD_WITH_COMPOSER_CLASS
    : SERIES_FORM_MOBILE_SCROLL_PAD_CLASS;

  return (
    <SeriesFormMobileChromeProvider enabled={showMobileSubmitBar}>
      <div className={cn(APP_PAGE_ROOT_CLASS, APP_BROWSER_BG_CLASS)}>
        <div className={cn(previewChromeHidden)}>
          <Header
            profileImageUrl={profileImageUrl}
            onProfileImageChange={onProfileImageChange}
            onMenuClick={() => setSidebarOpen(true)}
            hideOnMobile
          />
        </div>
        <div className={cn("lg:hidden", previewChromeHidden)}>
          <MobileAppSidebarDrawer
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            defaultActiveId={deriveSidebarActiveId(pathname, "series")}
          />
        </div>
        <main className={APP_MAIN_CLASS}>
          <header className={cn(PAGE_SUBHEADER_WITH_STICKY_CLASS, previewChromeHidden)}>
            <div className="flex w-full max-w-[1200px] items-center justify-between gap-4">
              <div className="flex items-center justify-start gap-3">
                <HeaderBackButton onClick={onBack} aria-label="시리즈 목록으로" />
                <h1 className="text-heading2_700 text-foreground">{title}</h1>
              </div>
              <div className="hidden items-center gap-1 lg:flex">
                {showDraftButton ? (
                  <Button
                    type="button"
                    variant="outline"
                    shape="square"
                    size="xl"
                    disabled={draftDisabled}
                    onClick={onDraftClick}
                  >
                    임시저장
                  </Button>
                ) : null}
                <Button
                  type="button"
                  tone="brand"
                  shape="square"
                  size="xl"
                  disabled={submitDisabled}
                  onClick={onSubmit}
                >
                  {submitLabel}
                </Button>
              </div>
            </div>
          </header>

          <div className={APP_MAIN_PANEL_CLASS}>
            {showFormPanel ? (
              <div
                className={cn(
                  PAGE_SCROLL_COLUMN_CLASS,
                  showMobileSubmitBar && mobileScrollPadClass,
                  "max-lg:px-0 max-lg:pt-0 max-lg:gap-0",
                )}
              >
                <div
                  className={cn(
                    "mx-auto flex w-full min-w-0 max-w-[1200px]",
                    isLgUp ? contentGapClassName : "",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <PageCard
                      fullWidth
                      className={cn(
                        "flex h-fit shrink-0 flex-col gap-5 overflow-hidden rounded-sm px-0 shadow-none",
                        PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
                        "max-lg:rounded-none max-lg:border-0",
                      )}
                    >
                      <SeriesFormTabs activeTab={activeTab} onChange={onTabChange} />
                      <div className={cn("self-stretch pt-0 pb-0", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
                        {children}
                      </div>
                    </PageCard>
                  </div>

                  {isLgUp ? (
                    <SeriesPreviewPanel
                      activeTab={activeTab}
                      coverPreviewUrl={coverPreviewUrl}
                      logoPreviewUrl={logoPreviewUrl}
                      title={seriesTitle}
                      summary={seriesSummary}
                      keywords={keywordList}
                      worldviewDescription={worldviewDescription}
                      layout="sidebar"
                    />
                  ) : null}
                </div>
              </div>
            ) : null}

            {showPreviewPanel ? (
              <div
                className={cn(
                  "flex flex-col bg-inverse max-lg:min-h-dvh",
                  APP_MAIN_PANEL_CLASS,
                  SERIES_FORM_MOBILE_SCROLL_PAD_CLASS,
                )}
              >
                <SeriesPreviewPanel
                  activeTab={activeTab}
                  coverPreviewUrl={coverPreviewUrl}
                  logoPreviewUrl={logoPreviewUrl}
                  title={seriesTitle}
                  summary={seriesSummary}
                  keywords={keywordList}
                  worldviewDescription={worldviewDescription}
                  layout="centered"
                />
              </div>
            ) : null}

            {!isLgUp ? (
              <EditorMobileFloatingActions
                active={mobilePanel}
                onChange={setMobilePanel}
                editTargetLabel="입력"
                hasBlockToolbar={false}
                fabBottomClassName={SERIES_FORM_MOBILE_FLOATING_ROW_BOTTOM_CLASS}
              />
            ) : null}
          </div>
        </main>
        {showMobileSubmitBar ? (
          <SeriesFormMobileSubmitBar
            showDraftButton={showDraftButton}
            onDraftClick={onDraftClick}
            draftDisabled={draftDisabled}
            onSubmit={onSubmit}
            submitDisabled={submitDisabled}
            submitLabel={submitLabel}
          />
        ) : null}
        {aiComposer ? (
          <FloatingAiComposerPortal
            enabled={isLgUp || showFormPanel}
            stackAboveMobileSubmitBar={showMobileComposer}
            reserveMobileFabLane={showMobileComposer}
            value={aiComposer.briefPrompt}
            onChange={aiComposer.onBriefChange}
            onSubmit={aiComposer.onSubmit}
            placeholder={
              aiComposer.placeholder ??
              (isLgUp
                ? "시리즈 컨셉·세계관·분위기를 서술형으로 입력해 주세요."
                : "시리즈 컨셉을 입력해 주세요.")
            }
            isLoading={aiComposer.isGenerating}
            submitDisabled={
              aiComposer.isGenerating || aiComposer.briefPrompt.trim().length === 0
            }
            loadingMessage={aiComposer.loadingMessage ?? "시리즈 정보를 생성하고 있어요"}
            ariaLabel={aiComposer.ariaLabel ?? "시리즈 AI 초안 입력"}
          />
        ) : null}
      </div>
    </SeriesFormMobileChromeProvider>
  );
}
