"use client";

import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import { PageCard } from "@/components/layout/PageCard";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { SeriesFormTabs } from "@/components/series/SeriesFormTabs";
import { SeriesPreviewPanel } from "@/components/series/SeriesPreviewPanel";
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
  contentPaddingClassName = "px-my-20",
  contentGapClassName = "gap-my-40",
}: SeriesFormPageScaffoldProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={onProfileImageChange} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <header className="flex h-16 shrink-0 items-center justify-center border-b border-border-10 bg-white px-my-20 py-0">
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

            <div
              className={cn(
                "flex flex-1 flex-col items-center gap-my-12 overflow-y-auto py-my-32",
                contentPaddingClassName
              )}
            >
              <div className={cn("mx-auto flex w-full max-w-[1200px]", contentGapClassName)}>
                <div className="flex-1 min-w-0">
                  <PageCard
                    fullWidth
                    className="h-fit rounded-[4px] flex flex-col shrink-0 overflow-hidden px-0 pt-0 pb-0"
                  >
                    <SeriesFormTabs activeTab={activeTab} onChange={onTabChange} />
                    <div className="self-stretch px-my-20 pt-my-8 pb-my-20">{children}</div>
                  </PageCard>
                </div>

                <SeriesPreviewPanel
                  coverPreviewUrl={coverPreviewUrl}
                  logoPreviewUrl={logoPreviewUrl}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
