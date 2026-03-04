/**
 * 알림 데이터 인터페이스
 * - category: 공지(NOTICE) | 작품알림(WORK_ALERT)
 * - content: 본문 내용은 선택적
 * - date: 포맷팅된 날짜 문자열 (예: "2025.12.05", "15분 전")
 */
export interface NotificationData {
  id: string | number;
  category: "NOTICE" | "WORK_ALERT";
  title: string;
  content?: string;
  date: string;
  isRead: boolean;
}

/** @deprecated NotificationData 사용 권장 */
export type Notification = NotificationData;
