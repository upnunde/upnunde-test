/**
 * 알림 데이터 인터페이스
 * - category: 공지(NOTICE) | 작품알림(WORK_ALERT) | 이벤트(EVENT) | 업데이트(UPDATE)
 * - content: 본문 내용은 선택적
 * - date: 포맷팅된 날짜 문자열 (예: "2025.12.05", "15분 전")
 */
export interface NotificationData {
  id: string | number;
  category: "NOTICE" | "WORK_ALERT" | "EVENT" | "UPDATE";
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
  if (category === "UPDATE") return "업데이트";
  return "작품알림";
}

/**
 * 카테고리 배지 색 — 상태가 아니라 시각적 구분이므로 DS 상태 variant(`success`·`warning` 등)를
 * 쓰지 않고, DS 색 토큰만으로 구분한다. 카테고리 전용 팔레트가 DS에 추가되면 이 함수만 교체한다.
 * 네 종류 모두 같은 낮은 surface 단계(15~20%)를 쓰고 hue로만 구분한다.
 */
export function notificationCategoryBadgeClass(category: NotificationData["category"]): string {
  if (category === "NOTICE") return "bg-success/15 text-success dark:bg-success/20";
  if (category === "UPDATE") return "bg-primary/15 text-primary dark:bg-primary/20";
  if (category === "EVENT") return "bg-warning/15 text-warning dark:bg-warning/20";
  return "bg-info/15 text-info dark:bg-info/20";
}
