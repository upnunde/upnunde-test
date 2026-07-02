import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { INQUIRY_NOTIFICATION_LIST_ITEM_SURFACE_CLASS, INQUIRY_NOTIFICATION_ROW_CLASS } from "@/lib/inquiry-list-styles";
import { Button } from "@/components/ui/button";
import { cn } from "design-system/utils";
import { ICONS } from "@/lib/icons";
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
      className={cn(
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        INQUIRY_NOTIFICATION_LIST_ITEM_SURFACE_CLASS,
        isOpen && "bg-background-muted",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="w-full cursor-pointer self-stretch min-h-[80px] rounded-lg inline-flex justify-start items-center gap-3 py-3 lg:gap-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`inquiry-content-${id}`}
        id={`inquiry-trigger-${id}`}
      >
        <div
          className={`w-[72px] h-8 shrink-0 p-2 rounded flex justify-center items-center gap-2 ${
            status === "answered"
              ? "bg-muted text-foreground-muted"
              : "bg-primary-container text-primary"
          }`}
        >
          <div className="justify-start text-body3_500 font-['Pretendard_JP']">
            {INQUIRY_STATUS_LABEL[status]}
          </div>
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-center items-start gap-1">
          <div className="w-full min-w-0 text-left text-body1_700 text-foreground lg:text-body2_500">
            {title}
          </div>
          <div className="justify-start text-body4_400 text-foreground-placeholder lg:text-caption1_400">
            {createdAt}
          </div>
        </div>
        <div className="w-8 h-8 shrink-0 px-3 rounded-[999px] flex justify-center items-center overflow-hidden bg-transparent text-foreground-placeholder">
          <ICONS.chevronDown
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
          className={INQUIRY_NOTIFICATION_ROW_CLASS}
        >
          <div
            className="hidden w-px shrink-0 self-stretch min-h-0 rounded-full bg-muted lg:block"
            aria-hidden
          />
          <div className="min-w-0 flex-1 flex flex-col gap-5 py-1 lg:gap-3">
            <div>
              <p className="mb-1 text-body4_700 text-foreground-placeholder">문의 유형</p>
              <p className="text-body3_400 text-foreground-muted">{INQUIRY_CATEGORY_LABEL[category]}</p>
            </div>
            <div>
              <p className="mb-1 text-body4_700 text-foreground-placeholder">상세내용</p>
              <p className="text-body3_400 text-foreground-muted whitespace-pre-wrap">{content}</p>
            </div>
            {email && (
              <div>
                <p className="mb-1 text-body4_700 text-foreground-placeholder">연락 이메일</p>
                <p className="text-body3_400 text-foreground-muted">{email}</p>
              </div>
            )}
            {status === "answered" && (
              <div className="rounded-lg bg-muted/50 px-4 py-3 text-foreground-placeholder">
                <p className="mb-1 text-body4_700 text-foreground-placeholder">답변</p>
                <p className="text-body3_400 text-foreground-muted">
                  문의해 주셔서 감사합니다. 검토 후 연락드리겠습니다.
                </p>
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCollapse}
                className="text-foreground-muted"
              >
                접기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
