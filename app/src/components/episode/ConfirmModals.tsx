"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ModalConfirmPhraseField,
  ModalFooterButtons,
  ModalHeader,
} from "@/components/ui/modal";
import { ScheduledPublishDateTimeFields } from "@/components/episode/ScheduledPublishDateTimeFields";
import { CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";
import { formatScheduledPublishSummary } from "@/lib/formatEpisode";
import {
  buildScheduledPublishIso,
  getDefaultScheduleInputValues,
  isScheduledPublishValid,
  SCHEDULE_MIN_LEAD_MINUTES,
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

    // episode 참조가 바뀌어도 id·예약시각이 같으면 폼을 리셋하지 않음(캘린더 조작 중 리셋 방지)
    if (episode?.status === "SCHEDULED" && episode.scheduledPublishAt) {
      const scheduledAt = new Date(episode.scheduledPublishAt);
      const defaults = getDefaultScheduleInputValues();
      const isFutureEnough =
        !Number.isNaN(scheduledAt.getTime()) &&
        scheduledAt.getTime() - Date.now() >= SCHEDULE_MIN_LEAD_MINUTES * 60 * 1000;

      setStep("setup");
      setPublishMode("scheduled");
      setConfirmationText("");
      setScheduledDate(isFutureEnough ? toInputDateValue(scheduledAt) : defaults.date);
      setScheduledTime(isFutureEnough ? toInputTimeValue(scheduledAt) : defaults.time);
      return;
    }

    const defaults = resetPublishFormState();
    setStep(defaults.step);
    setPublishMode(defaults.publishMode);
    setConfirmationText(defaults.confirmationText);
    setScheduledDate(defaults.scheduledDate);
    setScheduledTime(defaults.scheduledTime);
  }, [open, episode?.id, episode?.status, episode?.scheduledPublishAt]);

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
      // 예약 날짜 Popover·시간 Select는 body 포털이라 modal=true InternalBackdrop에
      // 포인터가 막힌다. trap-focus면 포커스만 가두고 포털 상호작용은 허용한다.
      modal="trap-focus"
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="outline-none focus:outline-none">
        {step === "setup" ? (
          <>
            <ModalHeader
              title="공개 방식"
              subtitle="에피소드를 언제 공개할지 선택해 주세요."
            />
            <div className="w-full space-y-4">
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
                <ScheduledPublishDateTimeFields
                  date={scheduledDate}
                  time={scheduledTime}
                  onDateChange={setScheduledDate}
                  onTimeChange={setScheduledTime}
                />
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
            <ModalHeader title="공개 전 유의사항" />
            <div className="flex w-full flex-col items-center gap-5">
              <div className="w-full space-y-3 text-body1_500 text-foreground-muted">
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
                <div className="inline-flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-background-muted p-5">
                  <div className="inline-flex w-full items-start justify-start gap-2">
                    <div className="w-4 text-body3_500 text-foreground-muted">1</div>
                    <div className="flex-1 text-body3_400 text-foreground-muted">
                      결제 보안 및 데이터 신뢰성 보호를 위해 공개 이후에는 창작자가 직접 에피소드를 수정하거나
                      삭제할 수 없습니다.
                    </div>
                  </div>
                  <div className="inline-flex w-full items-start justify-start gap-2">
                    <div className="w-4 text-body3_500 text-foreground-muted">2</div>
                    <div className="flex-1 text-body3_400 text-foreground-muted">
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
      <DialogContent>
        <ModalHeader
          title="에피소드를 삭제하시겠어요?"
          subtitle="정말 삭제하시겠어요? 삭제 후에는 복구할 수 없어요."
        />
        {episode ? (
          <p className="text-center text-body1_500 text-foreground">
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
