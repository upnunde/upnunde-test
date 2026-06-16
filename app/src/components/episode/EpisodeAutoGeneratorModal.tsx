"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Title1 } from "@/components/ui/title1";
import { Title2 } from "@/components/ui/title2";
import { AiFieldLoadingMessage } from "@/components/episode/EpisodeAiFieldLoading";
import { EpisodeScriptTextarea } from "@/components/episode/EpisodeScriptTextarea";
import { Snackbar } from "@/components/episode/Snackbar";
import { AiConvertLoadingOverlay } from "@/components/episode/AiConvertLoadingOverlay";
import { FloatingComposerBar } from "@/components/ui/floating-composer-bar";
import {
  EPISODE_APPLY_TO_EDITOR_DELAY_MS,
  EPISODE_APPLY_TO_EDITOR_LOADING_STEPS,
} from "@/lib/apply-initial-script-to-editor";
import { generateEpisodeDraftFromBrief } from "@/lib/episode-ai-draft";
import { EPISODE_FORM_FIELD_COPY } from "@/lib/episode-form-copy";
import {
  canLoadPreviousEpisodeHistory,
  generatePreviousEpisodeHistory,
} from "@/lib/episode-previous-history";
import {
  formDialogShellClassName,
  formDialogSheetBodyWrapperClassName,
  formDialogSheetEpisodeFormClassName,
  formDialogSheetScrollBodyClassName,
  formDialogSheetStickyFooterClassName,
} from "@/components/ui/modal";
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

const MAX_HISTORY = 5000;

/** AI 제작 버튼·플로팅 입력 바 */
const EPISODE_AUTO_GENERATOR_AI_COMPOSER_ENABLED = true;

export interface EpisodeAutoGeneratorPayload {
  history: string;
  script: string;
}

interface EpisodeAutoGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** URL 등에서 전달된 현재 회차 — 직전 회차 히스토리 자동 입력에 사용 */
  episodeNo?: number | null;
  initialValues?: EpisodeAutoGeneratorPayload;
  onSave?: (payload: EpisodeAutoGeneratorPayload) => void;
}

export function EpisodeAutoGeneratorModal({
  open,
  onOpenChange,
  episodeNo = null,
  initialValues,
  onSave,
}: EpisodeAutoGeneratorModalProps) {
  const [history, setHistory] = useState(initialValues?.history ?? "");
  const [script, setScript] = useState(initialValues?.script ?? "");
  const [briefPrompt, setBriefPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isHistoryAutoFilling, setIsHistoryAutoFilling] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const canAutoFillPreviousHistory = canLoadPreviousEpisodeHistory(episodeNo);

  useEffect(() => {
    if (!open) {
      setBriefPrompt("");
      return;
    }
    setHistory(initialValues?.history ?? "");
    setScript(initialValues?.script ?? "");
  }, [initialValues?.history, initialValues?.script, open]);

  const handleSave = useCallback(async () => {
    if (isApplying || isGenerating) return;
    setIsApplying(true);
    try {
      await new Promise<void>((resolve) =>
        window.setTimeout(resolve, EPISODE_APPLY_TO_EDITOR_DELAY_MS),
      );
      onSave?.({
        history: history.trim(),
        script: script.trim(),
      });
      onOpenChange(false);
    } finally {
      setIsApplying(false);
    }
  }, [history, isApplying, isGenerating, onOpenChange, onSave, script]);

  const handleGenerateFromBrief = useCallback(async () => {
    const prompt = briefPrompt.trim();
    if (!prompt || isGenerating) return;
    setIsGenerating(true);
    try {
      const draft = await generateEpisodeDraftFromBrief(prompt);
      setHistory(draft.history);
      setScript(draft.script);
      setBriefPrompt("");
    } finally {
      setIsGenerating(false);
    }
  }, [briefPrompt, isGenerating]);

  const handleAutoFillHistoryFromPrevious = useCallback(async () => {
    if (!canAutoFillPreviousHistory || isHistoryAutoFilling || episodeNo == null) {
      return;
    }
    setIsHistoryAutoFilling(true);
    try {
      const text = await generatePreviousEpisodeHistory(episodeNo);
      if (!text) {
        setSnackbar({
          open: true,
          message: EPISODE_FORM_FIELD_COPY.history.autoFillUnavailable,
        });
        return;
      }
      setHistory(text);
      setSnackbar({
        open: true,
        message: EPISODE_FORM_FIELD_COPY.history.autoFillDone,
      });
    } finally {
      setIsHistoryAutoFilling(false);
    }
  }, [canAutoFillPreviousHistory, episodeNo, isHistoryAutoFilling]);

  const applyOverlay =
    isApplying && typeof document !== "undefined" ? (
      <AiConvertLoadingOverlay
        messageSteps={[...EPISODE_APPLY_TO_EDITOR_LOADING_STEPS]}
      />
    ) : null;

  const composerPortal =
    EPISODE_AUTO_GENERATOR_AI_COMPOSER_ENABLED &&
    open &&
    typeof document !== "undefined" &&
    !isApplying
      ? createPortal(
          <div data-ai-auto-composer="true">
            <FloatingComposerBar
              value={briefPrompt}
              onChange={setBriefPrompt}
              onSubmit={handleGenerateFromBrief}
              placeholder="핵심 장면·감정·전개를 입력해 주세요"
              isLoading={isGenerating}
              submitDisabled={isGenerating || briefPrompt.trim().length === 0}
              placement="fixed"
              className="!z-[80] !pointer-events-auto"
              ariaLabel="에피소드 자동 입력기"
            />
          </div>,
          document.body,
        )
      : null;
  const dimPortal =
    EPISODE_AUTO_GENERATOR_AI_COMPOSER_ENABLED &&
    open &&
    typeof document !== "undefined"
      ? createPortal(<div className="fixed inset-0 z-[49] bg-black/50" aria-hidden />, document.body)
      : null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      modal={EPISODE_AUTO_GENERATOR_AI_COMPOSER_ENABLED ? false : undefined}
    >
      <DialogContent
        className={formDialogShellClassName}
        aria-describedby={undefined}
        onPointerDownOutside={(event) => {
          // 하단 자동 입력기 및 외부 클릭으로 모달이 자동 닫히지 않도록 유지
          event.preventDefault();
        }}
        onFocusOutside={(event) => {
          // 포커스가 하단 자동 입력기로 이동할 때 모달이 닫히지 않도록 유지
          event.preventDefault();
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>에피소드 생성기 입력</DialogTitle>
        </DialogHeader>
        <div
          className={cn(
            formDialogSheetBodyWrapperClassName,
            formDialogSheetEpisodeFormClassName,
            "flex min-h-0 w-full flex-1 flex-col",
          )}
        >
            <Title2 text="에피소드 생성기" asSectionHeader className="shrink-0" />
            <div
              className={cn(
                formDialogSheetScrollBodyClassName,
                PAGE_GUTTER_X_CLASS,
                "flex flex-col gap-my-24 pt-my-20",
              )}
            >
              <div className="flex flex-col gap-my-12">
                <div className="flex items-start justify-between gap-my-12">
                  <Title1
                    text="지난 사건 히스토리"
                    variant="title-subtitle-dot"
                    subtitleText={EPISODE_FORM_FIELD_COPY.history.subtitle}
                    className="min-w-0 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 gap-my-8 shadow-none bg-white px-my-12"
                    disabled={
                      !canAutoFillPreviousHistory ||
                      isHistoryAutoFilling ||
                      isGenerating ||
                      isApplying
                    }
                    title={
                      canAutoFillPreviousHistory
                        ? `${Math.max(1, Math.floor(episodeNo ?? 1) - 1)}화 정보를 바탕으로 채웁니다`
                        : EPISODE_FORM_FIELD_COPY.history.autoFillUnavailable
                    }
                    onClick={() => void handleAutoFillHistoryFromPrevious()}
                  >
                    {EPISODE_FORM_FIELD_COPY.history.autoFillFromPrevious}
                  </Button>
                </div>
                {isHistoryAutoFilling ? (
                  <div
                    className="flex min-h-[120px] max-h-[280px] w-full items-start rounded-md border border-border-10 bg-white px-my-12 py-my-12"
                    aria-busy="true"
                    aria-label="지난 사건 히스토리"
                  >
                    <AiFieldLoadingMessage
                      message={EPISODE_FORM_FIELD_COPY.history.autoFillLoading}
                    />
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    maxLength={MAX_HISTORY}
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    placeholder={EPISODE_FORM_FIELD_COPY.history.placeholder}
                    aria-label="지난 사건 히스토리"
                    className="min-h-[120px] max-h-[280px] w-full resize-y overflow-y-auto rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
                <div className="flex justify-end text-caption1_400 text-on-surface-30">
                  {isHistoryAutoFilling ? "—" : `${history.length}/${MAX_HISTORY}`}
                </div>
              </div>

              <div className="flex flex-col gap-my-12">
                <Title1
                  text="에피소드 대본"
                  variant="title-subtitle-dot"
                  subtitleText={EPISODE_FORM_FIELD_COPY.script.subtitle}
                />
                <EpisodeScriptTextarea
                  value={script}
                  onChange={setScript}
                  rows={6}
                  textareaClassName="h-auto min-h-[160px] max-h-[280px] resize-y"
                />
              </div>
            </div>
            <div className={formDialogSheetStickyFooterClassName}>
              <div className="flex justify-end gap-my-8">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isApplying || isGenerating || isHistoryAutoFilling}
                  onClick={() => onOpenChange(false)}
                >
                  취소
                </Button>
                <Button
                  type="button"
                  disabled={isApplying || isGenerating || isHistoryAutoFilling}
                  onClick={() => void handleSave()}
                >
                  생성하기
                </Button>
              </div>
            </div>
        </div>
      </DialogContent>
      {dimPortal}
      {composerPortal}
      {applyOverlay}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Dialog>
  );
}
