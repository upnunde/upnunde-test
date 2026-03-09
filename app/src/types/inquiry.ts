/**
 * 문의 내역(히스토리) 아이템
 * - 문의 폼과 동일한 category 값 사용
 */
export type InquiryCategory = "account" | "payment" | "bug" | "etc";

export type InquiryStatus = "pending" | "answered";

export interface InquiryHistoryItem {
  id: string;
  category: InquiryCategory;
  title: string;
  content: string;
  email?: string;
  status: InquiryStatus;
  createdAt: string;
  answeredAt?: string;
}

export const INQUIRY_CATEGORY_LABEL: Record<InquiryCategory, string> = {
  account: "계정 / 로그인",
  payment: "결제 / 정산",
  bug: "버그 / 오류 제보",
  etc: "기타 문의",
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  pending: "답변대기",
  answered: "답변완료",
};
