"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { Title2 } from "@/components/ui/title2";
import { AiFieldLoadingMessage } from "@/components/episode/EpisodeAiFieldLoading";
import { InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EpisodeScriptTextarea } from "@/components/episode/EpisodeScriptTextarea";
import { Snackbar } from "@/components/episode/Snackbar";
import { AiConvertLoadingOverlay } from "@/components/episode/AiConvertLoadingOverlay";
import { FloatingComposerBar } from "@/components/ui/floating-composer-bar";
import {
  DIALOG_OVERLAY_Z_CLASS,
  TOAST_STACK_Z_CLASS,
} from "@/components/ui/modal/modal-styles";
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
  MODAL_ACTION_BUTTON_SIZE,
} from "@/components/ui/modal";
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

const MAX_HISTORY = 5000;
const EPISODE_AUTO_HISTORY_ID = "episode-auto-generator-history";

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
              className={`!${TOAST_STACK_Z_CLASS} !pointer-events-auto`}
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
      ? createPortal(
          <div
            className={`fixed inset-x-0 bottom-0 top-0 ${DIALOG_OVERLAY_Z_CLASS} bg-dim-20 max-lg:bottom-auto max-lg:top-[var(--app-vv-live-top,0px)] max-lg:h-[var(--app-vv-live-height,100dvh)]`}
            aria-hidden
          />,
          document.body,
        )
      : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, details) => {
        /* 하단 자동 입력기·외부 클릭·포커스 이탈 시 자동 닫힘 방지 */
        if (
          details?.reason === "outside-press" ||
          details?.reason === "focus-out"
        ) {
          return;
        }
        onOpenChange(nextOpen);
      }}
      modal={EPISODE_AUTO_GENERATOR_AI_COMPOSER_ENABLED ? false : undefined}
    >
      <DialogContent
        className={formDialogShellClassName}
        aria-describedby={undefined}
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
                "flex flex-col gap-6 pt-5",
              )}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <FormFieldLabel
                    title="지난 사건 히스토리"
                    subtitle={EPISODE_FORM_FIELD_COPY.history.subtitle}
                    inputId={EPISODE_AUTO_HISTORY_ID}
                    className="min-w-0 flex-1"
                  />
                <Button
                  type="button"
                  variant="outline"
                  size={MODAL_ACTION_BUTTON_SIZE}
                  className="shrink-0 gap-2 shadow-none bg-background px-3"
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
                    className="flex min-h-[120px] max-h-[280px] w-full items-start rounded-md border border-border bg-background px-3 py-3"
                    aria-busy="true"
                    aria-label="지난 사건 히스토리"
                  >
                    <AiFieldLoadingMessage
                      message={EPISODE_FORM_FIELD_COPY.history.autoFillLoading}
                    />
                  </div>
                ) : (
                  <InputGroup>
                    <Textarea
                      id={EPISODE_AUTO_HISTORY_ID}
                      aria-describedby={formFieldAriaDescribedBy(EPISODE_AUTO_HISTORY_ID)}
                      rows={3}
                      maxLength={MAX_HISTORY}
                      value={history}
                      onChange={(e) => setHistory(e.target.value)}
                      placeholder={EPISODE_FORM_FIELD_COPY.history.placeholder}
                      aria-label="지난 사건 히스토리"
                      className="min-h-[120px] max-h-[280px] resize-y overflow-y-auto"
                    />
                    <InputHypertext count={history.length} max={MAX_HISTORY} />
                  </InputGroup>
                )}
                {isHistoryAutoFilling ? (
                  <div className="flex justify-end text-body4_400 tabular-nums text-foreground-muted">
                    —/{MAX_HISTORY}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3">
                <FormFieldLabel
                  title="에피소드 대본"
                  subtitle={EPISODE_FORM_FIELD_COPY.script.subtitle}
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
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size={MODAL_ACTION_BUTTON_SIZE}
                  disabled={isApplying || isGenerating || isHistoryAutoFilling}
                  onClick={() => onOpenChange(false)}
                >
                  취소
                </Button>
                <Button
                  type="button"
                  size={MODAL_ACTION_BUTTON_SIZE}
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
