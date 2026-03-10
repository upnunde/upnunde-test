"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const base = initial.length > 0 ? [...initial] : [];
  while (base.length < MAX_SLOTS) {
    base.push(createEmptySlot(base.length));
  }
  return base.slice(0, MAX_SLOTS);
}

export function CharacterExpressionModal({
  open,
  onClose,
  initialSlots = [],
  onSave,
}: CharacterExpressionModalProps) {
  const [slots, setSlots] = useState<CharacterExpressionSlot[]>(() => buildSlotsFromInitial(initialSlots));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [zoom, setZoom] = useState(1);
  const [expressionInput, setExpressionInput] = useState("");
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  const selectedSlot = selectedIndex !== null ? slots[selectedIndex] ?? null : null;
  /** 왼쪽 미리보기: 선택한 슬롯의 이미지 (썸네일 클릭 → 크기조절·표정 지정) */
  const previewImageUrl = selectedSlot?.imageUrl ?? null;

  useEffect(() => {
    if (open) {
      setSlots(buildSlotsFromInitial(initialSlots));
      setSelectedIndex(0);
      setZoom(1);
      const first = initialSlots[0];
      setExpressionInput(first?.expressionLabel ?? "");
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
  }, [selectedIndex, expressionInput]);

  const handleSave = useCallback(() => {
    onSave(slots);
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
  }, [slots]);

  /** 저장 버튼 활성화: 모든 슬롯에 썸네일 이미지 + 인풋으로 넣은 표정 이름이 있을 때만 */
  const canSave = slots.every(
    (slot) =>
      Boolean(slot.imageUrl) &&
      Boolean(slot.expressionLabel?.trim()) &&
      slot.expressionLabel?.trim() !== "untitle"
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="w-[900px] max-w-[calc(100vw-2rem)] gap-0 p-0 bg-surface-10 rounded-2xl shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] outline outline-1 outline-offset-[-1px] outline-slate-200 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">표정 이미지 등록</DialogTitle>
        <div className="inline-flex justify-center items-start min-h-0 flex-1 overflow-hidden">
          {/* 왼쪽: 이미지 크롭 에디터 + 슬라이더 + 표정 입력 */}
          <div className="p-5 border-r border-border-10/5 inline-flex flex-col justify-start items-center gap-5 shrink-0">
            {/* 크롭 영역 w-96 h-96 */}
            <div className="w-96 h-96 relative rounded-md overflow-hidden bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f1f5f9_0%_50%)] bg-[length:12px_12px] flex items-center justify-center">
              {previewImageUrl ? (
                <>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <img
                      src={previewImageUrl}
                      alt="크롭 미리보기"
                      className="max-w-none max-h-full w-auto h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-dim-20/50 pointer-events-none rounded-md" aria-hidden />
                  <div className="absolute inset-0 outline outline-[1.54px] outline-offset-[-1.54px] outline-primary pointer-events-none rounded-md" aria-hidden />
                </>
              ) : (
                <span className="text-on-surface-30 text-sm">썸네일을 클릭하여 선택하세요</span>
              )}
              <button type="button" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 px-5 bg-surface-10 rounded-[999px] shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)] inline-flex justify-center items-center overflow-hidden hover:bg-slate-100" aria-label="이전">
                <ChevronLeft className="w-5 h-5 text-on-surface-10" />
              </button>
              <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 px-5 bg-surface-10 rounded-[999px] shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)] inline-flex justify-center items-center overflow-hidden hover:bg-slate-100" aria-label="다음">
                <ChevronRight className="w-5 h-5 text-on-surface-10" />
              </button>
            </div>
            {/* 슬라이더: primary 트랙 + 서피스 썸 (참고: w-14 채움 + w-48 빈 트랙 + thumb) */}
            <div className="h-6 relative inline-flex justify-start items-center w-56">
              <div className="flex-1 flex h-2 rounded-[999px] overflow-hidden bg-surface-disabled/0">
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
              <div className="self-stretch rounded flex flex-col justify-center items-start gap-2 relative">
                <div className="self-stretch h-12 px-4 bg-surface-10 rounded outline outline-1 outline-border-20/10 inline-flex justify-start items-center gap-1 overflow-hidden">
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
                    className="flex-1 h-full min-w-0 border-0 bg-transparent outline-none font-['Pretendard_JP'] text-base font-normal leading-6 placeholder:text-on-surface-disabled/20 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                className="h-8 w-fit font-['Pretendard_JP']"
                onClick={handleApplyToSlot}
                disabled={selectedIndex === null}
              >
                선택한 슬롯에 적용
              </Button>
            </div>
          </div>
          </div>

          {/* 오른쪽: 썸네일 리스트 w-24 h-40, outline-primary 선택 / outline-border 비선택 */}
          <div className="self-stretch p-5 inline-flex flex-col justify-start items-start overflow-y-auto min-w-0">
            {slots.map((slot, index) => {
              const isSelected = selectedIndex === index;
              const label = slot.expressionLabel?.trim() || "untitle";
              return (
                <div key={slot.id} className="inline-flex flex-col justify-start items-start gap-1">
                  <button
                    type="button"
                    onClick={() => handleSelectSlot(index)}
                    className={`w-24 h-40 bg-surface-disabled/0 rounded-lg flex flex-col justify-center items-center gap-2 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected
                        ? "outline outline-2 outline-offset-[-2px] outline-primary"
                        : "outline outline-1 outline-offset-[-1px] outline-border-10/5 hover:outline-border-20"
                    }`}
                    aria-label={`표정 ${index + 1}: ${label}`}
                  >
                    {slot.imageUrl ? (
                      <img src={slot.imageUrl} alt="" className="w-24 h-40 object-cover object-top" />
                    ) : (
                      <span className="text-on-surface-30 text-xs">비어 있음</span>
                    )}
                  </button>
                  <div className="self-stretch inline-flex justify-start items-center gap-2.5 overflow-hidden">
                    <div className="flex-1 justify-center text-on-surface-30 text-base font-normal font-['Pretendard_JP'] leading-5 truncate text-center">
                      {label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 푸터: border-t, 취소(아웃라인) / 저장 */}
        <div className="self-stretch p-5 border-t border-slate-200 inline-flex justify-end items-center gap-2 shrink-0">
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
