"use client";

import { useState, type ReactNode } from "react";
import { APP_BROWSER_BG_CLASS, APP_PAGE_ROOT_CLASS } from "@/lib/mobile-viewport";
import { APP_MAIN_CLASS, APP_MAIN_PANEL_CLASS } from "@/lib/page-layout";
import Header from "@/components/Header/Header";
import { PageCard } from "@/components/layout/PageCard";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { SeriesFormTabs } from "@/components/series/SeriesFormTabs";
import { EditorMobileFloatingActions } from "@/components/editor/EditorMobileFloatingActions";
import {
  editorMobilePreviewChromeHiddenClass,
  type EditorMobilePanel,
} from "@/components/editor/editor-mobile-floating-layout";
import { SeriesPreviewPanel } from "@/components/series/SeriesPreviewPanel";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import {
  PAGE_GUTTER_X_CLASS,
  PAGE_SCROLL_BOTTOM_CLASS,
  PAGE_SCROLL_TOP_CLASS,
  PAGE_SUBHEADER_WITH_STICKY_CLASS,
} from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import type { SeriesFormTab } from "@/lib/seriesForm";

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
  children: ReactNode;
  showDraftButton?: boolean;
  onDraftClick?: () => void;
  contentPaddingClassName?: string;
  contentGapClassName?: string;
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
  children,
  showDraftButton = false,
  onDraftClick,
  contentPaddingClassName = PAGE_GUTTER_X_CLASS,
  contentGapClassName = "gap-my-40",
}: SeriesFormPageScaffoldProps) {
  const isLgUp = useIsLgUp();
  const [mobilePanel, setMobilePanel] = useState<EditorMobilePanel>("edit");
  const showFormPanel = isLgUp || mobilePanel === "edit";
  const showPreviewPanel = !isLgUp && mobilePanel === "preview";
  const previewChromeHidden = editorMobilePreviewChromeHiddenClass(isLgUp, mobilePanel);

  return (
    <div className={cn(APP_PAGE_ROOT_CLASS, APP_BROWSER_BG_CLASS)}>
      <div className={cn(previewChromeHidden)}>
        <Header profileImageUrl={profileImageUrl} onProfileImageChange={onProfileImageChange} />
      </div>
      <main className={cn(APP_MAIN_CLASS, "bg-surface-20")}>
            <header className={cn(PAGE_SUBHEADER_WITH_STICKY_CLASS, previewChromeHidden)}>
              <div className="flex w-full max-w-[1200px] items-center justify-between gap-my-16">
                <div className="flex items-center justify-start gap-my-12">
                  <HeaderBackButton onClick={onBack} aria-label="시리즈 목록으로" />
                  <h1 className="text-heading2_700 text-on-surface-10">{title}</h1>
                </div>
                <div className="flex items-center gap-my-12">
                  {showDraftButton ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={onDraftClick}
                      className="bg-white text-on-surface-20 hover:bg-surface-20 disabled:border-border-20"
                    >
                      임시저장
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="lg"
                    onClick={onSubmit}
                    className={cn(
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      submitDisabled && "bg-primary/40 hover:bg-primary/40 cursor-not-allowed"
                    )}
                  >
                    등록하기
                  </Button>
                </div>
              </div>
            </header>

            <div className={APP_MAIN_PANEL_CLASS}>
              {showFormPanel ? (
                <div
                  className={cn(
                    "flex flex-col items-center max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-y-auto",
                    PAGE_SCROLL_TOP_CLASS,
                    isLgUp && PAGE_SCROLL_BOTTOM_CLASS,
                    contentPaddingClassName,
                    "max-lg:px-0 max-lg:pt-0",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto flex w-full max-w-[1200px]",
                      isLgUp ? contentGapClassName : "",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <PageCard
                        fullWidth
                        className="flex h-fit shrink-0 flex-col gap-my-20 overflow-hidden rounded-[4px] px-0 lg:px-0 pt-my-8 pb-my-20 max-lg:rounded-none max-lg:border-0"
                      >
                        <SeriesFormTabs activeTab={activeTab} onChange={onTabChange} />
                        <div className="self-stretch px-my-20 pt-0 pb-0">{children}</div>
                      </PageCard>
                    </div>

                    {isLgUp ? (
                      <SeriesPreviewPanel
                        coverPreviewUrl={coverPreviewUrl}
                        logoPreviewUrl={logoPreviewUrl}
                        layout="sidebar"
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

              {showPreviewPanel ? (
                <div className={cn("flex flex-col bg-black max-lg:min-h-dvh", APP_MAIN_PANEL_CLASS)}>
                  <SeriesPreviewPanel
                    coverPreviewUrl={coverPreviewUrl}
                    logoPreviewUrl={logoPreviewUrl}
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
                />
              ) : null}
            </div>
      </main>
    </div>
  );
}
