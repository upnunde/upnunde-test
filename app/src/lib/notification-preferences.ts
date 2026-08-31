/** 설정 > 알림 설정 — 목업 단계라 localStorage에만 보관한다. */

const STORAGE_KEY = "upnunde:notification-preferences";

export type NotificationPreferenceId =
  | "workAlert"
  | "commentReaction"
  | "settlement"
  | "noticeEvent"
  | "marketing";

export type NotificationPreferences = Record<NotificationPreferenceId, boolean>;

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  workAlert: true,
  commentReaction: true,
  settlement: true,
  noticeEvent: true,
  marketing: false,
};

export const NOTIFICATION_PREFERENCE_ITEMS: readonly {
  id: NotificationPreferenceId;
  label: string;
  description: string;
}[] = [
  {
    id: "workAlert",
    label: "작품 알림",
    description: "에피소드 공개, 구독자 증가 등 내 작품 소식을 받아요.",
  },
  {
    id: "commentReaction",
    label: "댓글·반응 알림",
    description: "독자가 남긴 댓글과 반응을 알려드려요.",
  },
  {
    id: "settlement",
    label: "정산 알림",
    description: "정산 확정, 출금 처리 결과를 알려드려요.",
  },
  {
    id: "noticeEvent",
    label: "공지·이벤트 알림",
    description: "서비스 공지와 작가 대상 이벤트 소식을 받아요.",
  },
  {
    id: "marketing",
    label: "마케팅 정보 수신",
    description: "혜택·프로모션 정보를 이메일로 받아요. (선택)",
  },
];

export function loadNotificationPreferences(): NotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_PREFERENCES;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }
    const stored = parsed as Partial<Record<NotificationPreferenceId, unknown>>;
    const entries = Object.keys(DEFAULT_NOTIFICATION_PREFERENCES).map((key) => {
      const id = key as NotificationPreferenceId;
      const value = stored[id];
      return [id, typeof value === "boolean" ? value : DEFAULT_NOTIFICATION_PREFERENCES[id]];
    });
    return Object.fromEntries(entries) as NotificationPreferences;
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

export function saveNotificationPreferences(preferences: NotificationPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    /* quota / private mode */
  }
}
