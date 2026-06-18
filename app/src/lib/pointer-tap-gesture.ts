import * as React from "react";

/** 스크롤·드래그와 탭을 구분하는 이동 임계값(px) */
export const POINTER_TAP_MOVE_THRESHOLD_PX = 10;

export type PointerTapGestureTracker = {
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: (event: React.PointerEvent) => void;
  onPointerCancel: (event: React.PointerEvent) => void;
  shouldSuppressActivation: () => boolean;
  reset: () => void;
};

export function createPointerTapGestureTracker(
  threshold = POINTER_TAP_MOVE_THRESHOLD_PX,
): PointerTapGestureTracker {
  let x = 0;
  let y = 0;
  let moved = false;
  let pointerId: number | null = null;

  return {
    onPointerDown(event) {
      x = event.clientX;
      y = event.clientY;
      moved = false;
      pointerId = event.pointerId;
    },
    onPointerMove(event) {
      if (pointerId !== event.pointerId || moved) return;
      const dx = Math.abs(event.clientX - x);
      const dy = Math.abs(event.clientY - y);
      if (dx > threshold || dy > threshold) moved = true;
    },
    onPointerUp(event) {
      if (pointerId === event.pointerId) pointerId = null;
    },
    onPointerCancel(event) {
      if (pointerId === event.pointerId) {
        pointerId = null;
        moved = true;
      }
    },
    shouldSuppressActivation() {
      return moved;
    },
    reset() {
      moved = false;
      pointerId = null;
    },
  };
}

export function usePointerTapGestureTracker(
  threshold = POINTER_TAP_MOVE_THRESHOLD_PX,
): PointerTapGestureTracker {
  const [tracker] = React.useState(() => createPointerTapGestureTracker(threshold));
  return tracker;
}

/** 가로 스크롤 영역 안 드롭다운 트리거 — 터치 드래그를 스크롤로 넘기기 */
export const POINTER_TAP_TRIGGER_TOUCH_ACTION_CLASS = "touch-pan-x";
