"use client";

import { useState, type ReactNode } from "react";
import { APP_VIEWPORT_SHELL_CLASS } from "@/lib/mobile-viewport";
import Header from "@/components/Header/Header";
import { PageCard } from "@/components/layout/PageCard";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { SeriesFormTabs } from "@/components/series/SeriesFormTabs";
import { EditorMobileFloatingActions } from "@/components/editor/EditorMobileFloatingActions";
import {
  EDITOR_MOBILE_FAB_BOTTOM_ABOVE_BLOCK_TOOLBAR_CLASS,
  EDITOR_MOBILE_SCROLL_BOTTOM_PAD_WITH_TOOLBAR_CLASS,
  type EditorMobilePanel,
} from "@/components/editor/editor-mobile-floating-layout";
import { SeriesPreviewPanel } from "@/components/series/SeriesPreviewPanel";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import {
  PAGE_GUTTER_X_CLASS,
  PAGE_SCROLL_BOTTOM_CLASS,
  PAGE_SCROLL_TOP_CLASS,
  PAGE_SUBHEADER_CLASS,
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

  return (
    <div className={cn(APP_VIEWPORT_SHELL_CLASS, "bg-white")}>
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={onProfileImageChange} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <header className={PAGE_SUBHEADER_CLASS}>
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

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {showFormPanel ? (
                <div
                  className={cn(
                    "flex min-h-0 flex-1 flex-col items-center overflow-y-auto",
                    PAGE_SCROLL_TOP_CLASS,
                    isLgUp ? PAGE_SCROLL_BOTTOM_CLASS : EDITOR_MOBILE_SCROLL_BOTTOM_PAD_WITH_TOOLBAR_CLASS,
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
                        className="flex h-fit shrink-0 flex-col overflow-hidden rounded-[4px] px-0 pt-0 pb-0 max-lg:rounded-none max-lg:border-0"
                      >
                        <SeriesFormTabs activeTab={activeTab} onChange={onTabChange} />
                        <div className={cn("self-stretch pt-my-8 pb-my-20", PAGE_GUTTER_X_CLASS)}>{children}</div>
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
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-black">
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
                  fabBottomClassName={EDITOR_MOBILE_FAB_BOTTOM_ABOVE_BLOCK_TOOLBAR_CLASS}
                />
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
