import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { InquiryHistoryItem as InquiryHistoryItemType } from "@/types/inquiry";
import { INQUIRY_STATUS_LABEL, INQUIRY_CATEGORY_LABEL } from "@/types/inquiry";

export interface InquiryHistoryItemProps {
  item: InquiryHistoryItemType;
  /** 펼침 여부 (부모에서 제어, 한 번에 하나만 펼쳐짐) */
  isOpen?: boolean;
  /** 펼치기/접기 토글 시 호출 */
  onToggle?: () => void;
}

export function InquiryHistoryItem({
  item,
  isOpen = false,
  onToggle,
}: InquiryHistoryItemProps) {
  const { id, category, title, content, email, status, createdAt } = item;

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <div
      className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "transition-colors hover:bg-surface-20", isOpen && "bg-surface-20")}
    >
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="w-full cursor-pointer self-stretch min-h-[80px] rounded-lg inline-flex justify-start items-center gap-my-12 py-my-12 lg:gap-my-20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`inquiry-content-${id}`}
        id={`inquiry-trigger-${id}`}
      >
        <div
          className={`w-[72px] h-8 shrink-0 p-my-8 rounded flex justify-center items-center gap-my-8 ${
            status === "answered"
              ? "bg-surface-20 text-on-surface-20"
              : "bg-primary-primary-container text-primary"
          }`}
        >
          <div className="justify-start text-body3_500 font-['Pretendard_JP']">
            {INQUIRY_STATUS_LABEL[status]}
          </div>
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-center items-start gap-my-4">
          <div className="w-full min-w-0 text-left text-body1_700 text-on-surface-10 lg:text-body2_500">
            {title}
          </div>
          <div className="justify-start text-body4_400 text-on-surface-30 lg:text-caption1_400">
            {createdAt}
          </div>
        </div>
        <div className="w-8 h-8 shrink-0 px-my-12 rounded-[999px] flex justify-center items-center overflow-hidden bg-transparent text-on-surface-30">
          <ChevronDown
            className={`h-4 w-4 shrink-0 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </div>
      </button>

      {isOpen && (
        <div
          id={`inquiry-content-${id}`}
          role="region"
          aria-labelledby={`inquiry-trigger-${id}`}
          className="flex items-stretch gap-my-20 pb-my-16 pt-0 lg:gap-my-20 lg:pl-[90px] lg:pr-my-20 lg:pb-my-20"
        >
          <div
            className="hidden w-px shrink-0 self-stretch min-h-0 rounded-full bg-surface-20 lg:block"
            aria-hidden
          />
          <div className="min-w-0 flex-1 flex flex-col gap-my-20 py-my-4 lg:gap-my-12">
            <div>
              <p className="mb-1 text-body4_700 text-on-surface-30">문의 유형</p>
              <p className="text-body3_400 text-on-surface-20">{INQUIRY_CATEGORY_LABEL[category]}</p>
            </div>
            <div>
              <p className="mb-1 text-body4_700 text-on-surface-30">상세내용</p>
              <p className="text-body3_400 text-on-surface-20 whitespace-pre-wrap">{content}</p>
            </div>
            {email && (
              <div>
                <p className="mb-1 text-body4_700 text-on-surface-30">연락 이메일</p>
                <p className="text-body3_400 text-on-surface-20">{email}</p>
              </div>
            )}
            {status === "answered" && (
              <div className="rounded-lg bg-surface-20/50 px-my-16 py-my-12 text-on-surface-30">
                <p className="mb-1 text-body4_700 text-on-surface-30">답변</p>
                <p className="text-body3_400 text-on-surface-20">
                  문의해 주셔서 감사합니다. 검토 후 연락드리겠습니다.
                </p>
              </div>
            )}
            <div className="flex items-center justify-end gap-my-8">
              <button
                type="button"
                onClick={handleCollapse}
                className="h-8 cursor-pointer rounded-md border border-border-20 bg-white px-my-12 text-body3_500 text-on-surface-20 transition-colors hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20"
              >
                접기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
