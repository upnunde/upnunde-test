"use client";

import { useMemo, useSyncExternalStore } from "react";
import { MOCK_NOTIFICATIONS } from "@/lib/notification-data";
import type { NotificationData } from "@/types/notification";

const READ_IDS_STORAGE_KEY = "renovel.notifications.readIds";

/** 새소식(dot) 노출 — 발생 후 7일 */
export const NEW_NOTIFICATION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/** 데모용 새소식 예시 개수 (목록 상한이 아님) */
export const EXAMPLE_NEW_NOTIFICATION_COUNT = 2;

const RELATIVE_RECENCY: Record<string, number> = {
  "5분 전": 0,
  "15분 전": 1,
  "1시간 전": 2,
  "3시간 전": 3,
  "어제": 4,
};

/** 상대 시각 → 대략적인 경과 ms (새소식 윈도우 판별용) */
const RELATIVE_AGE_MS: Record<string, number> = {
  "5분 전": 5 * 60 * 1000,
  "15분 전": 15 * 60 * 1000,
  "1시간 전": 60 * 60 * 1000,
  "3시간 전": 3 * 60 * 60 * 1000,
  "어제": 24 * 60 * 60 * 1000,
};

const TODAY_DATES = new Set(["5분 전", "15분 전", "1시간 전", "3시간 전"]);

/** 알림 `date` 문자열을 epoch ms로 해석. 파싱 실패 시 null */
export function parseNotificationDateMs(date: string, nowMs = Date.now()): number | null {
  const relativeAge = RELATIVE_AGE_MS[date];
  if (relativeAge != null) return nowMs - relativeAge;

  const match = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(date);
  if (match == null) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  const parsed = new Date(year, month - 1, day).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

/** 발생 후 7일 이내인지 (읽음 여부와 무관) */
export function isNotificationWithinNewWindow(date: string, nowMs = Date.now()): boolean {
  const occurredAt = parseNotificationDateMs(date, nowMs);
  if (occurredAt == null) return false;
  return nowMs - occurredAt <= NEW_NOTIFICATION_WINDOW_MS;
}

/** 새소식 — 미읽음이면서 7일 이내 */
export function isNewNotification(
  notification: Pick<NotificationData, "isRead" | "date">,
  nowMs = Date.now(),
): boolean {
  return !notification.isRead && isNotificationWithinNewWindow(notification.date, nowMs);
}

/** 작을수록 최신 */
export function notificationRecencyKey(date: string): number {
  const relative = RELATIVE_RECENCY[date];
  if (relative != null) return relative;
  const numeric = Number(date.replaceAll(".", ""));
  if (Number.isFinite(numeric)) return 100 + (99_999_999 - numeric);
  return Number.MAX_SAFE_INTEGER;
}

export function isTodayNotificationDate(date: string): boolean {
  return TODAY_DATES.has(date);
}

export function compareNotificationsByRecency(a: NotificationData, b: NotificationData): number {
  return notificationRecencyKey(a.date) - notificationRecencyKey(b.date);
}

/** 새소식 전체 (상한 없음 — 예시 개수는 시드 데이터에서 제한) */
export function selectNewNotifications(
  items: NotificationData[],
  nowMs = Date.now(),
): NotificationData[] {
  return items
    .filter((notification) => isNewNotification(notification, nowMs))
    .sort(compareNotificationsByRecency);
}

function notificationIdKey(id: NotificationData["id"]): string {
  return String(id);
}

function sameNotificationId(a: NotificationData["id"], b: NotificationData["id"]): boolean {
  return notificationIdKey(a) === notificationIdKey(b);
}

/**
 * 데모: 7일 이내 알림 중 최신 N개만 미읽음(새소식)으로 두고 나머지는 읽음 처리.
 */
function withExampleNewNotifications(
  items: NotificationData[],
  exampleCount = EXAMPLE_NEW_NOTIFICATION_COUNT,
): NotificationData[] {
  const freshSorted = [...items]
    .filter((notification) => isNotificationWithinNewWindow(notification.date))
    .sort(compareNotificationsByRecency);
  const exampleIds = new Set(
    freshSorted.slice(0, exampleCount).map((notification) => notificationIdKey(notification.id)),
  );

  return items.map((notification) => {
    if (!isNotificationWithinNewWindow(notification.date)) return notification;
    const shouldBeNew = exampleIds.has(notificationIdKey(notification.id));
    if (notification.isRead === !shouldBeNew) return notification;
    return { ...notification, isRead: !shouldBeNew };
  });
}

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(READ_IDS_STORAGE_KEY);
    if (raw == null || raw === "") return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map((id) => String(id)));
  } catch {
    return new Set();
  }
}

function persistReadIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(READ_IDS_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore quota / private mode */
  }
}

function applyReadIds(
  items: NotificationData[],
  readIds: Set<string>,
): NotificationData[] {
  if (readIds.size === 0) return items;
  let changed = false;
  const next = items.map((notification) => {
    if (notification.isRead || !readIds.has(notificationIdKey(notification.id))) {
      return notification;
    }
    changed = true;
    return { ...notification, isRead: true };
  });
  return changed ? next : items;
}

const SEEDED_NOTIFICATIONS = withExampleNewNotifications(MOCK_NOTIFICATIONS);
const readIds = loadReadIds();
let notifications: NotificationData[] = applyReadIds(SEEDED_NOTIFICATIONS, readIds);
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return notifications;
}

function getServerSnapshot() {
  return SEEDED_NOTIFICATIONS;
}

export function markNotificationAsRead(id: NotificationData["id"]) {
  const key = notificationIdKey(id);
  let changed = false;
  const next = notifications.map((notification) => {
    if (!sameNotificationId(notification.id, id) || notification.isRead) {
      return notification;
    }
    changed = true;
    return { ...notification, isRead: true };
  });
  if (!changed) return;

  readIds.add(key);
  persistReadIds(readIds);
  notifications = next;
  emit();
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useUnreadNotifications() {
  const items = useNotifications();
  return useMemo(() => selectNewNotifications(items), [items]);
}

/** 현재 새소식(dot) 대상 id 집합 */
export function useNewNotificationIdSet() {
  const newItems = useUnreadNotifications();
  return useMemo(
    () => new Set(newItems.map((notification) => notificationIdKey(notification.id))),
    [newItems],
  );
}
