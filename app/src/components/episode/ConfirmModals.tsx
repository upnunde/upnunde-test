"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ModalConfirmPhraseField,
  ModalFooterButtons,
  ModalHeader,
  modalDialogContentClassName,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";
import { formatScheduledPublishSummary } from "@/lib/formatEpisode";
import {
  buildScheduledPublishIso,
  getDefaultScheduleInputValues,
  isScheduledPublishValid,
  toInputDateValue,
  toInputTimeValue,
} from "@/lib/scheduled-publish";
import { cn } from "design-system/utils";
import type { Episode } from "@/types/episode";

export type PublishMode = "immediate" | "scheduled";

export interface PublishConfirmPayload {
  episode: Episode;
  mode: PublishMode;
  scheduledPublishAt?: string;
}

/** 안내팝업: 공개 전 유의사항 (정책 6) — 1단계 설정 → 2단계 최종 확인 */
export interface PublishConfirmModalProps {
  open: boolean;
  episode: Episode | null;
  onClose: () => void;
  onConfirm: (payload: PublishConfirmPayload) => void;
  onCancelSchedule?: (episode: Episode) => void;
}

type PublishFlowStep = "setup" | "confirm";
type PublishModeSelection = PublishMode | null;

function resetPublishFormState() {
  return {
    step: "setup" as PublishFlowStep,
    publishMode: null as PublishModeSelection,
    confirmationText: "",
    scheduledDate: "",
    scheduledTime: "",
  };
}

const publishModeToggleClassName = cn(
  "flex-1 h-10 rounded-md border text-body3_500 transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);

export function PublishConfirmModal({
  open,
  episode,
  onClose,
  onConfirm,
  onCancelSchedule,
}: PublishConfirmModalProps) {
  const [step, setStep] = useState<PublishFlowStep>("setup");
  const [publishMode, setPublishMode] = useState<PublishModeSelection>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const isConfirmKeywordMatched = confirmationText.trim() === CONFIRM_INPUT_PHRASE;
  const isScheduledInputValid =
    publishMode !== "scheduled" ||
    isScheduledPublishValid(scheduledDate, scheduledTime);

  const canProceedFromSetup =
    !!episode && publishMode !== null && isScheduledInputValid;

  const canSubmit =
    !!episode && publishMode !== null && isConfirmKeywordMatched && isScheduledInputValid;

  const submitLabel = publishMode === "scheduled" ? "예약하기" : "공개";

  const isEditingSchedule = episode?.status === "SCHEDULED";

  const scheduledSummary =
    publishMode === "scheduled" && scheduledDate && scheduledTime
      ? formatScheduledPublishSummary(buildScheduledPublishIso(scheduledDate, scheduledTime))
      : null;

  useEffect(() => {
    if (!open) return;

    if (episode?.status === "SCHEDULED" && episode.scheduledPublishAt) {
      const scheduledAt = new Date(episode.scheduledPublishAt);
      setStep("setup");
      setPublishMode("scheduled");
      setConfirmationText("");
      setScheduledDate(toInputDateValue(scheduledAt));
      setScheduledTime(toInputTimeValue(scheduledAt));
      return;
    }

    const defaults = resetPublishFormState();
    setStep(defaults.step);
    setPublishMode(defaults.publishMode);
    setConfirmationText(defaults.confirmationText);
    setScheduledDate(defaults.scheduledDate);
    setScheduledTime(defaults.scheduledTime);
  }, [open, episode]);

  const resetState = () => {
    const defaults = resetPublishFormState();
    setStep(defaults.step);
    setPublishMode(defaults.publishMode);
    setConfirmationText(defaults.confirmationText);
    setScheduledDate(defaults.scheduledDate);
    setScheduledTime(defaults.scheduledTime);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleModeSelect = (mode: PublishMode) => {
    setPublishMode(mode);
    if (mode === "scheduled" && !scheduledDate) {
      const defaults = getDefaultScheduleInputValues();
      setScheduledDate(defaults.date);
      setScheduledTime(defaults.time);
    }
  };

  const handleSetupNext = () => {
    if (!canProceedFromSetup) return;
    setConfirmationText("");
    setStep("confirm");
  };

  const handleBackToSetup = () => {
    setConfirmationText("");
    setStep("setup");
  };

  const handleCancelScheduleClick = () => {
    if (!episode || !onCancelSchedule) return;
    onCancelSchedule(episode);
    resetState();
    onClose();
  };

  const handleConfirm = () => {
    if (!episode || !canSubmit || publishMode === null) return;

    const payload: PublishConfirmPayload = {
      episode,
      mode: publishMode,
    };

    if (publishMode === "scheduled") {
      payload.scheduledPublishAt = buildScheduledPublishIso(scheduledDate, scheduledTime);
    }

    resetState();
    onConfirm(payload);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent
        presentation="center"
        className={cn(modalDialogContentClassName, "outline-none focus:outline-none")}
      >
        {step === "setup" ? (
          <>
            <ModalHeader
              title="공개 방식"
              subtitle="에피소드를 언제 공개할지 선택해 주세요."
            />
            <div className="self-stretch px-5 pb-5 space-y-2">
              <div className="flex w-full gap-2" role="group" aria-label="공개 방식">
                <button
                  type="button"
                  onClick={() => handleModeSelect("immediate")}
                  aria-pressed={publishMode === "immediate"}
                  className={cn(
                    publishModeToggleClassName,
                    publishMode === "immediate"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground-muted hover:bg-muted",
                  )}
                >
                  즉시 공개
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSelect("scheduled")}
                  aria-pressed={publishMode === "scheduled"}
                  className={cn(
                    publishModeToggleClassName,
                    publishMode === "scheduled"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground-muted hover:bg-muted",
                  )}
                >
                  예약 공개
                </button>
              </div>

              {publishMode === "scheduled" ? (
                <div className="flex gap-2">
                  <Input
                    type="date"
                    size="sm"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="min-w-0 flex-1"
                    aria-label="공개 날짜"
                  />
                  <Input
                    type="time"
                    size="sm"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-[8.75rem] shrink-0"
                    aria-label="공개 시간"
                  />
                </div>
              ) : null}
            </div>

            <ModalFooterButtons
              layout={isEditingSchedule ? "split" : "end"}
              leadingButton={
                isEditingSchedule
                  ? { label: "예약 취소", tone: "ghost", onClick: handleCancelScheduleClick }
                  : undefined
              }
              trailingButtons={[
                { label: "취소", closeOnSelect: true },
                {
                  label: "다음",
                  tone: "primary",
                  onClick: handleSetupNext,
                  disabled: !canProceedFromSetup,
                },
              ]}
            />
          </>
        ) : (
          <>
            <div className="self-stretch px-5 pt-10 pb-4 bg-background max-lg:rounded-t-xl lg:rounded-t-sm flex flex-col justify-start items-center gap-5">
              <div className="self-stretch flex flex-col justify-center items-center gap-2">
                <DialogTitle asChild>
                  <h2 className="text-center text-foreground text-heading2_700 font-['Pretendard_JP']">
                    공개 전 유의사항
                  </h2>
                </DialogTitle>
              </div>
              <div className="self-stretch text-foreground-muted text-body1_500 font-['Pretendard_JP'] space-y-3">
                <p className="text-center">
                  에피소드를 공개하기 전, 아래 내용을 꼭 확인해 주세요!
                </p>
                {publishMode === "scheduled" && scheduledSummary ? (
                  <p className="text-center text-body3_500 text-primary">
                    {scheduledSummary} 예약
                  </p>
                ) : (
                  <p className="text-center text-body3_500 text-primary">즉시 공개</p>
                )}
                <div className="self-stretch p-5 bg-muted rounded-lg inline-flex flex-col justify-center items-center gap-2">
                  <div className="self-stretch inline-flex justify-start items-start gap-2">
                    <div className="w-4 justify-center text-foreground-muted text-body3_500 font-['Pretendard_JP']">
                      1
                    </div>
                    <div className="flex-1 justify-center text-foreground-muted text-body3_400 font-['Pretendard_JP']">
                      결제 보안 및 데이터 신뢰성 보호를 위해 공개 이후에는 창작자가 직접 에피소드를 수정하거나
                      삭제할 수 없습니다.
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-start gap-2">
                    <div className="w-4 justify-center text-foreground-muted text-body3_500 font-['Pretendard_JP']">
                      2
                    </div>
                    <div className="flex-1 justify-center text-foreground-muted text-body3_400 font-['Pretendard_JP']">
                      내용의 변경 또는 삭제가 반드시 필요한 경우, 고객센터 이메일을 통한 별도의 요청 및 승인
                      절차를 거쳐야 합니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ModalFooterButtons
              layout="split"
              leadingButton={{ label: "이전", onClick: handleBackToSetup }}
              body={
                <ModalConfirmPhraseField
                  inputId="episode-publish-confirm-input"
                  value={confirmationText}
                  onChange={setConfirmationText}
                />
              }
              trailingButtons={[
                {
                  label: submitLabel,
                  tone: "primary",
                  onClick: handleConfirm,
                  disabled: !canSubmit,
                },
              ]}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** 안내팝업 케이스: 에피소드를 삭제하시겠어요? (정책 8) */
export interface DeleteConfirmModalProps {
  open: boolean;
  episode: Episode | null;
  onClose: () => void;
  onConfirm: (episode: Episode) => void;
}

export function DeleteConfirmModal({
  open,
  episode,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    if (episode) {
      onConfirm(episode);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent presentation="center" className={modalDialogContentClassName}>
        <ModalHeader
          title="에피소드를 삭제하시겠어요?"
          subtitle="정말 삭제하시겠어요? 삭제 후에는 복구할 수 없어요."
        />
        {episode ? (
          <p className="-mt-3 px-6 pb-2 text-center font-['Pretendard_JP'] text-body1_500 text-foreground">
            「{episode.title}」
          </p>
        ) : null}
        <ModalFooterButtons
          layout="end"
          trailingButtons={[
            { label: "취소", closeOnSelect: true },
            { label: "삭제", tone: "destructive", onClick: handleConfirm },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
