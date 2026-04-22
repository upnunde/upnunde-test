"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header/Header";
import { PageCard } from "@/components/layout/PageCard";
import { Button } from "@/components/ui/button";
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
  contentPaddingClassName = "px-5",
  contentGapClassName = "gap-10",
}: SeriesFormPageScaffoldProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={onProfileImageChange} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            <header className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200 bg-white px-5 py-0">
              <div className="flex w-full max-w-[1200px] items-center justify-between gap-4">
                <div className="flex items-center justify-start gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onBack}
                    className="h-9 w-9 shrink-0 rounded-full border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="시리즈 목록으로"
                  >
                    <ChevronLeft className="h-5 w-5 text-slate-600" strokeWidth={2} />
                  </Button>
                  <h1 className="text-2xl font-extrabold text-on-surface-10">{title}</h1>
                </div>
                <div className="flex items-center gap-3">
                  {showDraftButton ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onDraftClick}
                      className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      임시저장
                    </Button>
                  ) : null}
                  <Button
                    type="button"
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
                "flex flex-1 flex-col items-center gap-3 overflow-y-auto py-8",
                contentPaddingClassName
              )}
            >
              <div className={cn("mx-auto flex w-full max-w-[1200px]", contentGapClassName)}>
                <div className="flex-1 min-w-0">
                  <PageCard
                    fullWidth
                    className="h-fit rounded-2xl flex flex-col shrink-0 overflow-hidden px-0 pt-0 pb-0"
                  >
                    <SeriesFormTabs activeTab={activeTab} onChange={onTabChange} />
                    <div className="self-stretch px-5 pt-2 pb-5">{children}</div>
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
