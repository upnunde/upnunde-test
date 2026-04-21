"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import NextImage from "next/image";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, RefreshCw } from "lucide-react";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import type { CharacterExpressionSlot } from "@/types/resource";

const MAX_SLOTS = 10;
const EXPRESSION_MAX_LENGTH = 50;

export interface CharacterExpressionModalProps {
  open: boolean;
  onClose: () => void;
  /** 초기 표정 슬롯 (기존 등록 데이터) */
  initialSlots?: CharacterExpressionSlot[];
  /** 저장 시 콜백: 최대 10개 슬롯 배열 */
  onSave: (slots: CharacterExpressionSlot[]) => void;
  /** 우측 썸네일 리스트(멀티 슬롯 관리) 노출 여부. 단일 편집 모달에서는 false. */
  showSlotList?: boolean;
  /** 표정 라벨/설명/인풋 섹션 노출 여부. false면 이미지 크롭만 사용 (시리즈 대표이미지·로고 등). */
  showExpressionSection?: boolean;
  /** 크롭 비율: 기본은 9:16, 캐릭터 정면 등은 square */
  cropAspect?: "square" | "9/16";
  /**
   * 크롭 가이드(좌우 딤드). 9:16에서만 레이아웃이 갈린다.
   * - `true`: 정사각 스테이지 + 좌우 딤 (`flex flex-row … h-[400px] w-[400px]` 등)
   * - `false`: 가이드 없음 — 9:16은 타이트 프레임만, 1:1은 `aspect-square` 정사각 박스만
   * 기본: `showExpressionSection`과 동일(표정 입력이 있으면 가이드 켜짐).
   */
  cropGuide?: boolean;
  /** @deprecated `cropGuide`와 동일. 둘 다 주면 `cropGuide`가 우선 */
  showCropGuide?: boolean;
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

/** 크롭 미리보기(9:16은 세로 고정)와 canvas 내보내기에 동일하게 사용 */
function getCropViewportDimensions(
  layoutShowSlotList: boolean,
  cropAspect: "square" | "9/16",
): { viewportW: number; viewportH: number } {
  if (cropAspect === "square") {
    const side = layoutShowSlotList ? 320 : 400;
    return { viewportW: side, viewportH: side };
  }
  const viewportH = layoutShowSlotList ? 320 : 400;
  const viewportW = Math.round((viewportH * 9) / 16);
  return { viewportW, viewportH };
}

function drawCheckerboard(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const size = 12;
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const even = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
      ctx.fillStyle = even ? "#e2e8f0" : "#f1f5f9";
      ctx.fillRect(x, y, Math.min(size, width - x), Math.min(size, height - y));
    }
  }
}

function drawMappedImageForCropFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  frame: { x: number; y: number; w: number; h: number },
  pan: { x: number; y: number },
  zoom: number,
  alpha = 1,
): void {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const srcX = nw / 2 - (nh * (frame.w / 2 + pan.x)) / (zoom * frame.h);
  const srcY = nh / 2 - (nh * (frame.h / 2 + pan.y)) / (zoom * frame.h);
  const srcH = nh / zoom;
  const scale = frame.h / srcH;
  const dx = frame.x - srcX * scale;
  const dy = frame.y - srcY * scale;
  const dw = nw * scale;
  const dh = nh * scale;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, 0, 0, nw, nh, dx, dy, dw, dh);
  ctx.restore();
}

/**
 * 이미지 URL과 pan/zoom을 이용해 크롭 뷰포트에 해당하는 영역을 캔버스로 렌더링한 뒤 blob URL로 반환.
 * 모달의 크롭 영역과 동일한 좌표계(중앙 기준 pan, scale)를 사용한다.
 */
function cropImageToBlobUrl(
  imageUrl: string,
  pan: { x: number; y: number },
  zoom: number,
  viewportW: number,
  viewportH: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        const srcX = nw / 2 - (nh * (viewportW / 2 + pan.x)) / (zoom * viewportH);
        const srcY = nh / 2 - (nh * (viewportH / 2 + pan.y)) / (zoom * viewportH);
        const srcW = (nh * viewportW) / (zoom * viewportH);
        const srcH = nh / zoom;
        const sx = Math.max(0, Math.min(nw, srcX));
        const sy = Math.max(0, Math.min(nh, srcY));
        const sw = Math.max(1, Math.min(nw - sx, srcW));
        const sh = Math.max(1, Math.min(nh - sy, srcH));

        const canvas = document.createElement("canvas");
        canvas.width = viewportW;
        canvas.height = viewportH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas 2d context not available"));
          return;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, viewportW, viewportH);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("toBlob failed"));
              return;
            }
            resolve(URL.createObjectURL(blob));
          },
          "image/png",
          0.95,
        );
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = imageUrl;
  });
}

export function CharacterExpressionModal({
  open,
  onClose,
  initialSlots = [],
  onSave,
  showSlotList = true,
  showExpressionSection = true,
  cropAspect = "9/16",
  cropGuide: _cropGuideProp,
  showCropGuide: _showCropGuideProp,
}: CharacterExpressionModalProps) {
  // 레이아웃용 showSlotList는 모달이 열린 동안 고정하여,
  // 부모에서 prop이 변경되더라도 폭이 순간적으로 바뀌지 않도록 한다.
  const [layoutShowSlotList] = useState(showSlotList);
  const [slots, setSlots] = useState<CharacterExpressionSlot[]>(() => buildSlotsFromInitial(initialSlots));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(initialSlots.length > 0 ? 0 : null);
  const [zoom, setZoom] = useState(1);
  const [zoomBySlotId, setZoomBySlotId] = useState<Record<string, number>>({});
  const [expressionInput, setExpressionInput] = useState("");
  const [_suggestionOpen, setSuggestionOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [panBySlotId, setPanBySlotId] = useState<Record<string, { x: number; y: number }>>({});
  const [isDragging, setIsDragging] = useState(false);
  const cropStageRef = useRef<HTMLDivElement | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    slotId: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const selectedSlot = selectedIndex !== null ? slots[selectedIndex] ?? null : null;
  /** 왼쪽 미리보기: 선택한 슬롯의 이미지 (썸네일 클릭 → 크기조절·표정 지정) */
  const previewImageUrl = selectedSlot?.imageUrl ?? null;
  const currentPanX = selectedSlot ? (panBySlotId[selectedSlot.id]?.x ?? 0) : 0;
  const currentPanY = selectedSlot ? (panBySlotId[selectedSlot.id]?.y ?? 0) : 0;

  const handleCropPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!selectedSlot?.id || !previewImageUrl) return;
    // 버튼(이전/다음 등) 클릭은 드래그로 가로채지 않기
    if (e.target instanceof Element && e.target.closest("button")) return;
    e.preventDefault();
    dragRef.current = {
      slotId: selectedSlot.id,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      originX: currentPanX,
      originY: currentPanY,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [selectedSlot?.id, previewImageUrl, currentPanX, currentPanY]);

  const handleCropPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || !selectedSlot?.id || drag.slotId !== selectedSlot.id || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startClientX;
    const dy = e.clientY - drag.startClientY;
    setPanBySlotId((prev) => ({
      ...prev,
      [drag.slotId]: { x: drag.originX + dx, y: drag.originY + dy },
    }));
  }, [selectedSlot?.id]);

  const handleCropPointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const handleCropWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!previewImageUrl) return;
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
    const next = Math.min(2, Math.max(0.5, zoom + delta));
    setZoom(next);
    if (selectedSlot?.id) {
      setZoomBySlotId((prev) => ({ ...prev, [selectedSlot.id]: next }));
    }
  }, [previewImageUrl, selectedSlot?.id, zoom]);

  const drawCropCanvas = useCallback(() => {
    const stage = cropStageRef.current;
    const canvas = cropCanvasRef.current;
    if (!stage || !canvas) return;
    const rect = stage.getBoundingClientRect();
    const stageW = Math.max(1, Math.round(rect.width));
    const stageH = Math.max(1, Math.round(rect.height));
    const frameH = stageH;
    const frameW = cropAspect === "9/16" ? Math.round((frameH * 9) / 16) : stageW;
    const frameX = cropAspect === "9/16" ? Math.round((stageW - frameW) / 2) : 0;
    const frameY = 0;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = Math.floor(stageW * dpr);
    canvas.height = Math.floor(stageH * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, stageW, stageH);
    drawCheckerboard(ctx, stageW, stageH);

    const image = loadedImageRef.current;
    if (image && previewImageUrl) {
      // 배경 전체에 먼저 이미지(딤) -> 프레임 영역과 동일 변환으로 그려서 잘릴 영역 체감 제공
      drawMappedImageForCropFrame(
        ctx,
        image,
        { x: frameX, y: frameY, w: frameW, h: frameH },
        { x: currentPanX, y: currentPanY },
        zoom,
        1,
      );
    }

    if (cropAspect === "9/16") {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      if (frameX > 0) ctx.fillRect(0, 0, frameX, stageH);
      const rightX = frameX + frameW;
      if (rightX < stageW) ctx.fillRect(rightX, 0, stageW - rightX, stageH);
      ctx.restore();
    }
  }, [cropAspect, currentPanX, currentPanY, previewImageUrl, zoom]);

  useEffect(() => {
    if (!previewImageUrl) {
      loadedImageRef.current = null;
      drawCropCanvas();
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      loadedImageRef.current = img;
      drawCropCanvas();
    };
    img.onerror = () => {
      loadedImageRef.current = null;
      drawCropCanvas();
    };
    img.src = previewImageUrl;
  }, [previewImageUrl, drawCropCanvas]);

  useEffect(() => {
    drawCropCanvas();
  }, [drawCropCanvas]);

  useEffect(() => {
    // 모달 첫 진입 직후 레이아웃 확정 프레임에서 한 번 더 동기화해
    // 우/하단에 배경색이 비는 현상을 방지한다.
    const raf = requestAnimationFrame(() => drawCropCanvas());
    return () => cancelAnimationFrame(raf);
  }, [drawCropCanvas, open]);

  useEffect(() => {
    const stage = cropStageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      drawCropCanvas();
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, [drawCropCanvas]);

  useEffect(() => {
    if (open) {
      const nextSlots = buildSlotsFromInitial(initialSlots);
      setSlots(nextSlots);
      setSelectedIndex(nextSlots.length > 0 ? 0 : null);
      setZoom(1);
      setZoomBySlotId({});
      setPanBySlotId({});
      const first = initialSlots[0];
      setExpressionInput(first?.expressionLabel ?? "");
    }
    // open 변경 시점에만 initialSlots로 1회 초기화 — 부모가 매 렌더에 다른 배열 참조를 넘겨도 리셋되지 않도록 의도적으로 deps에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = useCallback(async () => {
    let { viewportW, viewportH } = getCropViewportDimensions(layoutShowSlotList, cropAspect);
    const stageRect = cropStageRef.current?.getBoundingClientRect();
    if (stageRect) {
      const stageH = Math.max(1, Math.round(stageRect.height));
      if (cropAspect === "9/16") {
        viewportH = stageH;
        viewportW = Math.round((stageH * 9) / 16);
      } else {
        viewportH = stageH;
        viewportW = Math.round(stageRect.width);
      }
    }

    const baseFilled =
      showExpressionSection
        ? slots
            .filter((s) => Boolean(s.imageUrl))
            .map((s) => ({
              ...s,
              expressionLabel: (s.expressionLabel ?? "").trim(),
            }))
            .filter((s) => s.expressionLabel.length > 0 && s.expressionLabel !== "untitle")
        : slots
            .filter((s) => Boolean(s.imageUrl))
            .map((s) => ({ ...s, expressionLabel: s.expressionLabel ?? "" }));

    setSaving(true);
    try {
      const withCroppedUrls = await Promise.all(
        baseFilled.map(async (s) => {
          if (!s.imageUrl) return s;
          const pan = panBySlotId[s.id] ?? { x: 0, y: 0 };
          const slotZoom = zoomBySlotId[s.id] ?? 1;
          const croppedUrl = await cropImageToBlobUrl(s.imageUrl, pan, slotZoom, viewportW, viewportH);
          return { ...s, imageUrl: croppedUrl };
        }),
      );
      onSave(withCroppedUrls.slice(0, MAX_SLOTS));
      onClose();
    } catch (err) {
      console.error("Crop/save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [
    slots,
    layoutShowSlotList,
    cropAspect,
    showExpressionSection,
    panBySlotId,
    zoomBySlotId,
    onSave,
    onClose,
  ]);

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
    setZoom(slot ? (zoomBySlotId[slot.id] ?? 1) : 1);
  }, [slots, zoomBySlotId]);

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
      }

      return next.slice(0, MAX_SLOTS);
    });

    // 같은 파일을 다시 선택할 수 있게 리셋
    e.target.value = "";
  }, []);

  const handleAddSlot = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /** 저장 버튼 활성화: 등록된(이미지 있는) 슬롯만 검사. 표정 섹션 있을 때는 라벨 필수 */
  const canSave = showExpressionSection
    ? slots.some((s) => Boolean(s.imageUrl)) &&
      slots
        .filter((s) => Boolean(s.imageUrl))
        .every((s) => Boolean(s.expressionLabel?.trim()) && s.expressionLabel.trim() !== "untitle")
    : slots.some((s) => Boolean(s.imageUrl));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className={`${layoutShowSlotList ? "w-auto max-w-[calc(100vw-2rem)]" : "w-[424px] max-w-[calc(100vw-2rem)]"} gap-0 p-0 bg-surface-10 rounded-2xl shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] outline outline-1 outline-offset-[-1px] outline-slate-200 overflow-hidden flex flex-col`}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">이미지 편집</DialogTitle>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleFilesSelected}
        />
        <div
          className="inline-flex justify-start items-start min-h-0 flex-1 w-full"
        >
          {/* 왼쪽: 이미지 크롭 에디터 + 슬라이더 + 표정 입력 */}
          <div
            className={`p-4 sm:p-5 flex-1 min-h-0 overflow-y-auto flex flex-col justify-start items-center gap-5 shrink-0 ${
              layoutShowSlotList ? "border-r border-slate-200" : "w-full"
            }`}
            style={layoutShowSlotList ? { width: "fit-content" } : undefined}
          >
            {/* 정사각 스테이지 + canvas + 좌우 딤 + 9:16 가이드 프레임 */}
            <div
              ref={cropStageRef}
              className="w-full max-w-[24rem] relative rounded-lg overflow-hidden bg-neutral-900 aspect-square"
            >
              <canvas
                ref={cropCanvasRef}
                className={`absolute inset-0 w-full h-full touch-none ${
                  previewImageUrl ? (isDragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing") : "cursor-default"
                }`}
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerUp}
                onPointerCancel={handleCropPointerUp}
                onWheel={handleCropWheel}
              />
              {!previewImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-on-surface-30 text-sm pointer-events-none">
                  썸네일을 클릭하여 선택하세요
                </div>
              )}
              {cropAspect === "9/16" && (
                <>
                  <div className="pointer-events-none absolute left-0 top-0 h-full w-[21.875%] bg-dim-20/50" aria-hidden />
                  <div className="pointer-events-none absolute right-0 top-0 h-full w-[21.875%] bg-dim-20/50" aria-hidden />
                  <div className="pointer-events-none absolute left-[21.875%] top-0 h-full w-[56.25%] border-2 border-primary-primary" aria-hidden />
                </>
              )}
            </div>
            {/* 슬라이더: primary 트랙 + 서피스 썸 (참고: w-14 채움 + w-48 빈 트랙 + thumb) */}
            <div className="h-6 inline-flex justify-start items-center w-full self-stretch gap-4">
              <div className="relative flex-1 h-6 inline-flex items-center gap-0">
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
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setZoom(v);
                    if (selectedSlot?.id) {
                      setZoomBySlotId((prev) => ({ ...prev, [selectedSlot.id]: v }));
                    }
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer z-[1]"
                  aria-label="확대/축소"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 w-8 h-8 bg-transparent hover:bg-transparent active:bg-transparent shadow-none rounded-full border border-slate-200"
                onClick={() => {
                  if (selectedSlot?.id) {
                    setZoom(1);
                    setZoomBySlotId((prev) => ({ ...prev, [selectedSlot.id]: 1 }));
                    setPanBySlotId((prev) => ({
                      ...prev,
                      [selectedSlot.id]: { x: 0, y: 0 },
                    }));
                  } else {
                    setZoom(1);
                  }
                }}
                aria-label="뷰 초기화"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
            {/* 표정: 라벨 + 설명 + 인풋 + 0/50 (showExpressionSection일 때만) */}
            {showExpressionSection && (
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="justify-center text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-5">
                  표정
                </div>
                <div className="justify-center text-on-surface-30 text-xs font-normal font-['Pretendard_JP'] leading-4">
                  표정은 에피소드에서 인물의 감정 표현에 사용됩니다
                </div>
                <div className="self-stretch rounded flex flex-col justify-center items-end gap-2 relative">
                  <div className="self-stretch">
                    <Input
                      value={expressionInput}
                      onChange={(e) => {
                        const v = e.target.value.slice(0, EXPRESSION_MAX_LENGTH);
                        setExpressionInput(v);
                        setSuggestionOpen(true);
                        if (selectedIndex !== null) {
                          setSlots((prev) => {
                            const next = [...prev];
                            if (!next[selectedIndex]) return prev;
                            next[selectedIndex] = {
                              ...next[selectedIndex]!,
                              expressionLabel: v,
                            };
                            return next;
                          });
                        }
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
                </div>
              </div>
            )}
            {layoutShowSlotList && (
              <div className="mt-auto self-stretch flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 rounded-md outline outline-1 outline-offset-[-1px] outline-slate-200 font-['Pretendard_JP'] text-sm font-medium text-secondary-foreground px-4 w-auto"
                  onClick={() => handleNavigateFilledSlots("prev")}
                  disabled={filledSlotIndices.length <= 1}
                >
                  이전
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 rounded-md outline outline-1 outline-offset-[-1px] outline-slate-200 font-['Pretendard_JP'] text-sm font-medium text-secondary-foreground px-4 w-auto"
                  onClick={() => handleNavigateFilledSlots("next")}
                  disabled={filledSlotIndices.length <= 1}
                >
                  다음
                </Button>
              </div>
            )}
          </div>

          {/* 오른쪽: 썸네일 리스트 w-24 h-40, outline-primary 선택 / outline-border 비선택 */}
          {layoutShowSlotList && (
            <div className="self-stretch min-h-0 shrink-0 w-fit min-w-fit p-5 grid grid-cols-3 auto-rows-max gap-x-2 gap-y-4 justify-start items-start overflow-y-auto h-[640px]">
              {slots
                .filter((s) => Boolean(s.imageUrl))
                .map((slot) => {
                  const index = slots.indexOf(slot);
                  const isSelected = selectedIndex === index;
                  const label = slot.expressionLabel?.trim() || "untitle";
                  return (
                    <div key={slot.id} className="inline-flex flex-col justify-start items-start gap-1 group">
                      <div className="relative w-[90px] h-[160px]">
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
                          <NextImage
                            src={slot.imageUrl!}
                            alt=""
                            width={90}
                            height={160}
                            unoptimized
                            className="w-[90px] h-[160px] object-cover object-top"
                          />
                        </button>
                        <button
                          type="button"
                          aria-label="표정 삭제"
                          onClick={() => setSlots((prev) => prev.filter((s) => s.id !== slot.id))}
                          className="hidden group-hover:inline-flex absolute top-1 right-1 w-8 h-8 rounded-full bg-surface-10 text-on-surface-10 hover:bg-slate-100 items-center justify-center cursor-pointer shadow-sm"
                        >
                          <Trash2 className="w-4 h-4 pointer-events-none" />
                        </button>
                      </div>
                      <div className="w-[90px] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                        <div
                          className={`w-[90px] justify-center text-sm font-normal font-['Pretendard_JP'] leading-5 truncate text-left ${
                            label === "untitle" ? "text-on-surface-disabled" : "text-on-surface-20"
                          }`}
                        >
                          {label}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {slots.filter((s) => Boolean(s.imageUrl)).length < MAX_SLOTS && (
                <AddResourceSlot variant="img9:16" ariaLabel="표정 추가하기" onClick={handleAddSlot} />
              )}
            </div>
          )}
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
            disabled={!canSave || saving}
          >
            {saving ? "저장 중…" : "저장"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** 단일 편집용: 좌측 크롭 에디터만 사용하는 싱글 타입 모달 */
export function CharacterExpressionSingleModal(props: Omit<CharacterExpressionModalProps, "showSlotList">) {
  return <CharacterExpressionModal {...props} showSlotList={false} />;
}

/** 멀티 관리용: 좌측 크롭 + 우측 썸네일 리스트를 모두 사용하는 멀티 타입 모달 */
export function CharacterExpressionMultiModal(props: Omit<CharacterExpressionModalProps, "showSlotList">) {
  return <CharacterExpressionModal {...props} showSlotList />;
}

/** 이미지 크롭 전용 (1:1): 표정 라벨/인풋 없이 크롭·줌만 – 캐릭터 정면 등 */
export function ImageCropSquareModal(
  props: Omit<CharacterExpressionModalProps, "showSlotList" | "showExpressionSection" | "cropAspect" | "cropGuide" | "showCropGuide">,
) {
  return (
    <CharacterExpressionModal
      {...props}
      showSlotList={false}
      showExpressionSection={false}
      cropAspect="square"
      cropGuide={false}
    />
  );
}

/** 이미지 크롭 전용 (9:16): 표정 라벨/인풋 없이 크롭·줌만 – 썸네일/연출장면 등 */
export function ImageCropPosterModal(
  props: Omit<CharacterExpressionModalProps, "showSlotList" | "showExpressionSection" | "cropAspect" | "cropGuide" | "showCropGuide">,
) {
  return (
    <CharacterExpressionModal
      {...props}
      showSlotList={false}
      showExpressionSection={false}
      cropAspect="9/16"
      cropGuide
    />
  );
}

/** 기존 이름 유지: 기본은 9:16 포스터용으로 동작 */
export function ImageCropOnlyModal(
  props: Omit<CharacterExpressionModalProps, "showSlotList" | "showExpressionSection" | "cropAspect" | "cropGuide" | "showCropGuide">,
) {
  return <ImageCropPosterModal {...props} />;
}
