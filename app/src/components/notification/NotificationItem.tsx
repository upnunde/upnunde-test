import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { INQUIRY_NOTIFICATION_ROW_CLASS } from "@/lib/inquiry-list-styles";
import { Button } from "@/components/ui/button";
import { cn } from "design-system/utils";
import { ICONS } from "@/lib/icons";
import type { NotificationData } from "@/types/notification";

export interface NotificationItemProps {
  notification: NotificationData;
  /** 문의하기 클릭 시 실행할 핸들러 (부모에서 전달) */
  onContactClick?: (notification: NotificationData) => void;
  /** 펼침 여부 (부모에서 제어, 한 번에 하나만 펼쳐짐) */
  isOpen?: boolean;
  /** 펼치기/접기 토글 시 호출 */
  onToggle?: () => void;
}

export function NotificationItem({
  notification,
  onContactClick,
  isOpen = false,
  onToggle,
}: NotificationItemProps) {
  const { id, category, title, content, date } = notification;

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContactClick?.(notification);
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <div
      className={cn(PAGE_FLUSH_CONTENT_PAD_X_CLASS, "transition-colors hover:bg-muted", isOpen && "bg-muted")}
    >
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="w-full cursor-pointer self-stretch min-h-[80px] rounded-lg inline-flex justify-start items-center gap-3 py-3 lg:gap-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`notification-content-${id}`}
        id={`notification-trigger-${id}`}
      >
        <div
          className={`w-[72px] h-8 shrink-0 p-2 rounded flex justify-center items-center gap-2 ${
            category === "NOTICE"
              ? "bg-info/15 text-info"
              : "bg-success/15 text-success"
          }`}
        >
          <div className="justify-start text-body3_500 font-['Pretendard_JP']">
            {category === "NOTICE" ? "공지" : "작품알림"}
          </div>
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-center items-start gap-1">
          <div className="w-full min-w-0 text-left text-body1_700 text-foreground lg:text-body2_500">
            {title}
          </div>
          <div className="justify-start text-body4_400 text-foreground-placeholder lg:text-caption1_400">
            {date}
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
          id={`notification-content-${id}`}
          role="region"
          aria-labelledby={`notification-trigger-${id}`}
          className={INQUIRY_NOTIFICATION_ROW_CLASS}
        >
          <div
            className="hidden w-px shrink-0 self-stretch min-h-0 rounded-full bg-muted lg:block"
            aria-hidden
          />
          <div className="min-w-0 flex-1 flex flex-col gap-5 py-1 lg:gap-3">
            {content != null && content !== "" ? (
              <p className="text-body3_400 text-foreground-muted whitespace-pre-wrap">{content}</p>
            ) : (
              <p className="text-body3_400 text-foreground-placeholder">내용 없음</p>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleContactClick}
                className="text-foreground-muted"
              >
                문의하기
              </Button>
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

