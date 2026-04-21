"use client";

import { useSyncExternalStore } from "react";

/** 토스트 유형: A(기본), B(닫기), C(액션) */
export type ToastVariant = "default" | "withClose" | "withAction";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  /** 자동 숨김 시간(ms). 기본 4000 (4초). 3~5초 권장 */
  duration?: number;
}

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 4000;

type Listener = () => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

const EMPTY_TOASTS: ToastItem[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

const timers = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleAutoDismiss(item: ToastItem) {
  const duration = item.duration ?? DEFAULT_DURATION;
  if (duration <= 0) return;
  const id = item.id;
  const t = setTimeout(() => {
    timers.delete(id);
    remove(id);
  }, duration);
  timers.set(id, t);
}

export function addToast(options: Omit<ToastItem, "id">): string {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  if (toasts.length >= MAX_TOASTS) {
    const removed = toasts.shift()!;
    const t = timers.get(removed.id);
    if (t) clearTimeout(t);
    timers.delete(removed.id);
  }
  const item: ToastItem = { ...options, id };
  toasts = [...toasts, item];
  scheduleAutoDismiss(item);
  notify();
  return id;
}

export function removeToast(id: string) {
  remove(id);
}

function remove(id: string) {
  const t = timers.get(id);
  if (t) clearTimeout(t);
  timers.delete(id);
  toasts = toasts.filter((item) => item.id !== id);
  notify();
}

function subscribe(callback: Listener) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return toasts;
}

function getServerSnapshot() {
  return EMPTY_TOASTS;
}

export function useToastStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    toasts: snapshot,
    add: addToast,
    remove: removeToast,
  };
}

/** 토스트 발동 훅. 3~5초 자동 닫힘, 최대 3개 유지 */
export function useToast() {
  return {
    toast: (options: Omit<ToastItem, "id">) => addToast(options),
    dismiss: removeToast,
  };
}
