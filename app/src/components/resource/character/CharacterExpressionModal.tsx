"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import type { CharacterExpressionSlot } from "@/types/resource";

const MAX_SLOTS = 10;
const EXPRESSION_MAX_LENGTH = 50;

/** 표정 추천 목록 (유저가 선택하거나 직접 입력) */
const EXPRESSION_SUGGESTIONS = [
  "무표정",
  "화",
  "화난",
  "화들짝 놀란",
  "화사한",
  "화기애애",
  "화색이 도는",
  "기쁨",
  "슬픔",
  "놀람",
  "당황",
  "웃음",
  "걱정",
  "설렘",
  "부끄러움",
];

export interface CharacterExpressionModalProps {
  open: boolean;
  onClose: () => void;
  /** 초기 표정 슬롯 (기존 등록 데이터) */
  initialSlots?: CharacterExpressionSlot[];
  /** 저장 시 콜백: 최대 10개 슬롯 배열 */
  onSave: (slots: CharacterExpressionSlot[]) => void;
}

function createEmptySlot(index: number): CharacterExpressionSlot {
  return {
    id: `expr-${index}-${Date.now()}`,
    expressionLabel: "",
    imageUrl: undefined,
  };
}

function buildSlotsFromInitial(initial: CharacterExpressionSlot[]): CharacterExpressionSlot[] {
  return initial.slice(0, MAX_SLOTS);
}

export function CharacterExpressionModal({
  open,
  onClose,
  initialSlots = [],
  onSave,
}: CharacterExpressionModalProps) {
  const [slots, setSlots] = useState<CharacterExpressionSlot[]>(() => buildSlotsFromInitial(initialSlots));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(initialSlots.length > 0 ? 0 : null);
  const [zoom, setZoom] = useState(1);
  const [expressionInput, setExpressionInput] = useState("");
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [panBySlotId, setPanBySlotId] = useState<Record<string, { x: number; y: number }>>({});
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    slotId: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [applyBaseline, setApplyBaseline] = useState<{ slotId: string | null; expression: string; zoom: number }>(() => ({
    slotId: initialSlots[0]?.id ?? null,
    expression: initialSlots[0]?.expressionLabel ?? "",
    zoom: 1,
  }));

  const selectedSlot = selectedIndex !== null ? slots[selectedIndex] ?? null : null;
  /** 왼쪽 미리보기: 선택한 슬롯의 이미지 (썸네일 클릭 → 크기조절·표정 지정) */
  const previewImageUrl = selectedSlot?.imageUrl ?? null;
  const currentPan = selectedSlot ? (panBySlotId[selectedSlot.id] ?? { x: 0, y: 0 }) : { x: 0, y: 0 };

  const canApply =
    selectedIndex !== null &&
    Boolean(selectedSlot?.imageUrl) &&
    applyBaseline.slotId === selectedSlot?.id &&
    (expressionInput !== applyBaseline.expression || zoom !== applyBaseline.zoom);

  const handleCropPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!selectedSlot?.id || !previewImageUrl) return;
    e.preventDefault();
    dragRef.current = {
      slotId: selectedSlot.id,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      originX: currentPan.x,
      originY: currentPan.y,
    };
    setIsDragging(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, [selectedSlot?.id, previewImageUrl, currentPan.x, currentPan.y]);

  const handleCropPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || !selectedSlot?.id || drag.slotId !== selectedSlot.id || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startClientX;
    const dy = e.clientY - drag.startClientY;
    setPanBySlotId((prev) => ({
      ...prev,
      [drag.slotId]: { x: drag.originX + dx, y: drag.originY + dy },
    }));
  }, [selectedSlot?.id]);

  const handleCropPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (open) {
      const nextSlots = buildSlotsFromInitial(initialSlots);
      setSlots(nextSlots);
      setSelectedIndex(nextSlots.length > 0 ? 0 : null);
      setZoom(1);
      const first = initialSlots[0];
      setExpressionInput(first?.expressionLabel ?? "");
      setApplyBaseline({
        slotId: first?.id ?? null,
        expression: first?.expressionLabel ?? "",
        zoom: 1,
      });
    }
  }, [open]);

  /** 선택한 슬롯에 현재 표정 라벨만 적용 (이미지는 이미 첨부된 상태) */
  const handleApplyToSlot = useCallback(() => {
    if (selectedIndex === null) return;
    const label = expressionInput.trim().slice(0, EXPRESSION_MAX_LENGTH) || "untitle";
    setSlots((prev) => {
      const next = [...prev];
      next[selectedIndex] = {
        ...next[selectedIndex]!,
        id: next[selectedIndex]!.id,
        expressionLabel: label,
        imageUrl: next[selectedIndex]!.imageUrl,
      };
      return next;
    });
    setApplyBaseline({
      slotId: selectedSlot?.id ?? null,
      expression: label,
      zoom,
    });
  }, [selectedIndex, expressionInput, selectedSlot?.id, zoom]);

  const handleSave = useCallback(() => {
    const filled = slots
      .filter((s) => Boolean(s.imageUrl))
      .map((s) => ({
        ...s,
        expressionLabel: (s.expressionLabel ?? "").trim(),
      }))
      .filter((s) => s.expressionLabel.length > 0 && s.expressionLabel !== "untitle");
    onSave(filled.slice(0, MAX_SLOTS));
    onClose();
  }, [slots, onSave, onClose]);

  const handleClose = useCallback(() => {
    setExpressionInput("");
    setSuggestionOpen(false);
    onClose();
  }, [onClose]);

  /** 썸네일 클릭 → 해당 슬롯 선택, 왼쪽에서 크기조절·표정 입력 */
  const handleSelectSlot = useCallback((index: number) => {
    setSelectedIndex(index);
    const slot = slots[index];
    setExpressionInput(slot?.expressionLabel ?? "");
    setZoom(1);
    setApplyBaseline({
      slotId: slot?.id ?? null,
      expression: slot?.expressionLabel ?? "",
      zoom: 1,
    });
  }, [slots]);

  const filledSlotIndices = slots
    .map((s, i) => (s.imageUrl ? i : null))
    .filter((i): i is number => i !== null);

  const handleNavigateFilledSlots = useCallback((direction: "prev" | "next") => {
    if (filledSlotIndices.length === 0) return;

    const currentIndex = selectedIndex;
    const currentPos = currentIndex === null ? -1 : filledSlotIndices.indexOf(currentIndex);
    const startPos = currentPos >= 0 ? currentPos : 0;

    const nextPos = direction === "next"
      ? (startPos + 1) % filledSlotIndices.length
      : (startPos - 1 + filledSlotIndices.length) % filledSlotIndices.length;

    handleSelectSlot(filledSlotIndices[nextPos]!);
  }, [filledSlotIndices, selectedIndex, handleSelectSlot]);

  const handleFilesSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setSlots((prev) => {
      const currentImageCount = prev.filter((s) => Boolean(s.imageUrl)).length;
      const remaining = Math.max(0, MAX_SLOTS - currentImageCount);
      if (remaining === 0) return prev;

      const filesToAdd = files.slice(0, remaining);
      const next = [...prev];
      let firstAddedIndex: number | null = null;

      for (const file of filesToAdd) {
        const objectUrl = URL.createObjectURL(file);
        next.push({
          ...createEmptySlot(next.length),
          imageUrl: objectUrl,
          expressionLabel: "",
        });
        if (firstAddedIndex === null) firstAddedIndex = next.length - 1;
      }

      if (firstAddedIndex !== null) {
        const firstSlot = next[firstAddedIndex];
        setSelectedIndex(firstAddedIndex);
        setExpressionInput(firstSlot?.expressionLabel ?? "");
        setZoom(1);
        setApplyBaseline({
          slotId: firstSlot?.id ?? null,
          expression: firstSlot?.expressionLabel ?? "",
          zoom: 1,
        });
      }

      return next.slice(0, MAX_SLOTS);
    });

    // 같은 파일을 다시 선택할 수 있게 리셋
    e.target.value = "";
  }, []);

  const handleAddSlot = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /** 저장 버튼 활성화: 등록된(이미지 있는) 슬롯들만 검사 */
  const canSave = slots.some((s) => Boolean(s.imageUrl)) &&
    slots
      .filter((s) => Boolean(s.imageUrl))
      .every((s) => Boolean(s.expressionLabel?.trim()) && s.expressionLabel.trim() !== "untitle");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="w-[min(750px,calc(100vw-2rem))] max-w-none gap-0 p-0 bg-surface-10 rounded-2xl shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] outline outline-1 outline-offset-[-1px] outline-slate-200 overflow-hidden flex flex-col"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleFilesSelected}
        />
        <div
          className="inline-flex justify-start items-start min-h-0 flex-1 overflow-hidden w-full"
          style={{ width: "100%" }}
        >
          {/* 왼쪽: 이미지 크롭 에디터 + 슬라이더 + 표정 입력 */}
          <div className="p-5 border-r border-slate-200 inline-flex flex-col justify-start items-center gap-5 shrink-0">
            {/* 크롭 영역 w-96 h-96 */}
            <div
              className="w-96 h-96 relative rounded-md overflow-hidden bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f1f5f9_0%_50%)] bg-[length:12px_12px] flex items-center justify-center"
              onPointerDownCapture={handleCropPointerDown}
              onPointerMove={handleCropPointerMove}
              onPointerUp={handleCropPointerUp}
              onPointerCancel={handleCropPointerUp}
              style={{
                touchAction: "none",
                cursor: previewImageUrl ? (isDragging ? "grabbing" : "grab") : "default",
                userSelect: "none",
              }}
            >
              {previewImageUrl ? (
                <>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `translate(${currentPan.x}px, ${currentPan.y}px) scale(${zoom})` }}
                  >
                    <img
                      src={previewImageUrl}
                      alt="크롭 미리보기"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      className="max-w-none max-h-full w-auto h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
                    {/* 9:16 crop guide: inside is transparent, outside is dimmed via huge box-shadow */}
                    <div className="h-full aspect-[9/16] rounded-sm relative shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] outline outline-1 outline-offset-[-1px] outline-slate-200/85">
                      <div className="absolute left-0 top-0 w-3 h-3 border-l border-t border-slate-200/85" />
                      <div className="absolute right-0 top-0 w-3 h-3 border-r border-t border-slate-200/85" />
                      <div className="absolute left-0 bottom-0 w-3 h-3 border-l border-b border-slate-200/85" />
                      <div className="absolute right-0 bottom-0 w-3 h-3 border-r border-b border-slate-200/85" />
                    </div>
                  </div>
                  <div className="absolute inset-0 outline outline-[1.54px] outline-offset-[-1.54px] outline-slate-200 pointer-events-none rounded-md" aria-hidden />
                </>
              ) : (
                <span className="text-on-surface-30 text-sm">썸네일을 클릭하여 선택하세요</span>
              )}
              <button
                type="button"
                onClick={() => handleNavigateFilledSlots("prev")}
                disabled={filledSlotIndices.length <= 1}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 p-2 bg-surface-10 rounded-[999px] shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)] inline-flex justify-center items-center overflow-hidden hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="이전"
              >
                <ChevronLeft className="w-5 h-5 text-on-surface-10" />
              </button>
              <button
                type="button"
                onClick={() => handleNavigateFilledSlots("next")}
                disabled={filledSlotIndices.length <= 1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 p-2 bg-surface-10 rounded-[999px] shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)] inline-flex justify-center items-center overflow-hidden hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="다음"
              >
                <ChevronRight className="w-5 h-5 text-on-surface-10" />
              </button>
            </div>
            {/* 슬라이더: primary 트랙 + 서피스 썸 (참고: w-14 채움 + w-48 빈 트랙 + thumb) */}
            <div className="h-6 relative inline-flex justify-start items-center w-full self-stretch">
              <div className="flex-1 flex h-2 rounded-[999px] overflow-hidden bg-surface-disabled">
                <div className="h-full bg-primary rounded-[999px] transition-[width]" style={{ width: `${((zoom - 0.5) / 1.5) * 100}%` }} />
              </div>
              <div
                className="w-8 h-8 top-1/2 -translate-y-1/2 absolute bg-surface-10 rounded-full shadow-[0px_1px_2px_1px_rgba(0,0,0,0.16)] border border-border-20/10 -translate-x-1/2 pointer-events-none"
                style={{ left: `${((zoom - 0.5) / 1.5) * 100}%` }}
                aria-hidden
              />
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-[1]"
                aria-label="확대/축소"
              />
            </div>
            {/* 표정: 라벨 + 설명 + 인풋 + 0/50 (참고 스타일) */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="justify-center text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-5">표정</div>
              <div className="justify-center text-on-surface-30 text-xs font-normal font-['Pretendard_JP'] leading-4">표정은 에피소드에서 인물의 감정 표현에 사용됩니다</div>
              <div className="self-stretch rounded flex flex-col justify-center items-end gap-2 relative">
                <div className="self-stretch">
                  <Input
                    value={expressionInput}
                    onChange={(e) => {
                      const v = e.target.value.slice(0, EXPRESSION_MAX_LENGTH);
                      setExpressionInput(v);
                      setSuggestionOpen(true);
                    }}
                    onFocus={() => setSuggestionOpen(true)}
                    onBlur={() => setTimeout(() => setSuggestionOpen(false), 150)}
                    placeholder="인물의 표정을 입력하세요"
                    maxLength={EXPRESSION_MAX_LENGTH}
                    className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary shadow-none font-['Pretendard_JP']"
                  />
                </div>
                <div className="self-stretch inline-flex justify-end items-center gap-2">
                  <span className="text-right justify-center text-on-surface-30 text-xs font-normal font-['Pretendard_JP'] leading-4 tabular-nums">
                    {expressionInput.length}/{EXPRESSION_MAX_LENGTH}
                  </span>
                </div>
              {suggestionOpen && (
                <ul
                  className="absolute z-10 top-full left-0 right-0 mt-1 py-1 bg-surface-10 border border-slate-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto"
                  role="listbox"
                >
                  {EXPRESSION_SUGGESTIONS.filter((s) =>
                    s.toLowerCase().includes(expressionInput.trim().toLowerCase())
                  ).map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        role="option"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 font-['Pretendard_JP']"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setExpressionInput(s.slice(0, EXPRESSION_MAX_LENGTH));
                          setSuggestionOpen(false);
                        }}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                  {expressionInput.trim() && !EXPRESSION_SUGGESTIONS.includes(expressionInput.trim()) && (
                    <li>
                      <button
                        type="button"
                        role="option"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 text-on-surface-30 font-['Pretendard_JP']"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSuggestionOpen(false);
                        }}
                      >
                        &quot;{expressionInput.trim()}&quot; (직접 사용)
                      </button>
                    </li>
                  )}
                </ul>
              )}
              <Button
                type="button"
                size="sm"
                className="h-8 w-fit font-['Pretendard_JP'] bg-black text-white hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-black/30"
                onClick={handleApplyToSlot}
                disabled={!canApply}
              >
                슬롯에 적용
              </Button>
            </div>
          </div>
          </div>

          {/* 오른쪽: 썸네일 리스트 w-24 h-40, outline-primary 선택 / outline-border 비선택 */}
          <div className="self-stretch min-h-0 shrink-0 w-fit min-w-fit p-5 grid grid-cols-3 auto-rows-max gap-x-2 gap-y-4 justify-start items-start overflow-y-auto h-full">
            {slots.filter((s) => Boolean(s.imageUrl)).map((slot) => {
              const index = slots.indexOf(slot);
              const isSelected = selectedIndex === index;
              const label = slot.expressionLabel?.trim() || "untitle";
              return (
                <div key={slot.id} className="inline-flex flex-col justify-start items-start gap-1">
                  <button
                    type="button"
                    onClick={() => handleSelectSlot(index)}
                    className={`w-[90px] h-[160px] bg-surface-disabled/0 rounded-lg flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected
                        ? "outline outline-2 outline-offset-[-2px] outline-primary"
                        : "outline outline-1 outline-offset-[-1px] outline-border-10/5 hover:outline-border-20"
                    }`}
                    aria-label={`표정 ${index + 1}: ${label}`}
                  >
                    <img src={slot.imageUrl!} alt="" className="w-[90px] h-[160px] object-cover object-top" />
                  </button>
                  <div className="w-[90px] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="w-[90px] justify-center text-on-surface-20 text-sm font-normal font-['Pretendard_JP'] leading-5 truncate text-left">
                      {label}
                    </div>
                  </div>
                </div>
              );
            })}

            {slots.filter((s) => Boolean(s.imageUrl)).length < MAX_SLOTS && (
              <AddResourceSlot
                variant="img9:16"
                ariaLabel="표정 추가하기"
                onClick={handleAddSlot}
              />
            )}
          </div>
        </div>

        {/* 푸터: border-t, 취소(아웃라인) / 저장 */}
        <div className="self-stretch w-full p-5 border-t border-slate-200 inline-flex justify-end items-center gap-2 shrink-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="min-w-20 h-10 rounded-md outline outline-1 outline-offset-[-1px] outline-slate-200 font-['Pretendard_JP'] text-base font-medium text-secondary-foreground"
              onClick={handleClose}
            >
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="min-w-20 h-10 rounded-md font-['Pretendard_JP'] text-base font-medium"
            onClick={handleSave}
            disabled={!canSave}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
