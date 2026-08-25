/**
 * 알림 데이터 인터페이스
 * - category: 공지(NOTICE) | 작품알림(WORK_ALERT) | 이벤트(EVENT)
 * - content: 본문 내용은 선택적
 * - date: 포맷팅된 날짜 문자열 (예: "2025.12.05", "15분 전")
 */
export interface NotificationData {
  id: string | number;
  category: "NOTICE" | "WORK_ALERT" | "EVENT";
  title: string;
  content?: string;
  date: string;
  isRead: boolean;
  /** 펼침 본문 상단 배너 (이벤트 등) */
  bannerSrc?: string;
  bannerAlt?: string;
}

/** @deprecated NotificationData 사용 권장 */
export type Notification = NotificationData;

export function notificationCategoryLabel(category: NotificationData["category"]): string {
  if (category === "NOTICE") return "공지";
  if (category === "EVENT") return "이벤트";
  return "작품알림";
}

export function notificationCategoryToneClass(category: NotificationData["category"]): string {
  if (category === "NOTICE") return "bg-info/15 text-info";
  if (category === "EVENT") return "bg-warning/15 text-warning";
  return "bg-success/15 text-success";
}
