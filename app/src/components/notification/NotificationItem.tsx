import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import {
  INQUIRY_NOTIFICATION_LIST_ITEM_SURFACE_CLASS,
  INQUIRY_NOTIFICATION_ROW_CLASS,
} from "@/lib/inquiry-list-styles";
import { Button } from "design-system/ui/button";
import { cn } from "design-system/utils";
import Image from "next/image";
import { ICONS } from "@/lib/icons";
import { Badge } from "design-system/ui/badge";
import {
  notificationCategoryBadgeClass,
  notificationCategoryLabel,
  type NotificationData,
} from "@/types/notification";

export interface NotificationItemProps {
  notification: NotificationData;
  /** 문의하기 클릭 시 실행할 핸들러 (부모에서 전달) */
  onContactClick?: (notification: NotificationData) => void;
  /** 새소식 dot 노출 (최대 2개 정책은 부모가 판별) */
  showNewDot?: boolean;
  /** 펼침 여부 (부모에서 제어, 한 번에 하나만 펼쳐짐) */
  isOpen?: boolean;
  /** 펼치기/접기 토글 시 호출 */
  onToggle?: () => void;
}

export function NotificationItem({
  notification,
  onContactClick,
  showNewDot = false,
  isOpen = false,
  onToggle,
}: NotificationItemProps) {
  const { id, category, title, content, date, bannerSrc, bannerAlt } = notification;

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
      className={cn(
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        INQUIRY_NOTIFICATION_LIST_ITEM_SURFACE_CLASS,
        isOpen && "bg-background border-y border-border",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="w-full cursor-pointer self-stretch min-h-[80px] rounded-lg inline-flex justify-start items-center gap-3 py-3 lg:gap-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`notification-content-${id}`}
        id={`notification-trigger-${id}`}
      >
        <Badge
          variant="secondary"
          size="lg"
          shape="square"
          className={cn("w-[72px]", notificationCategoryBadgeClass(category))}
        >
          {notificationCategoryLabel(category)}
        </Badge>
        <div className="min-w-0 flex-1 flex flex-col justify-center items-start gap-1">
          <div className="w-full min-w-0 text-left text-body1_700 text-foreground lg:text-body2_500">
            {title}
          </div>
          <div className="inline-flex items-start gap-1 text-body4_400 leading-[18px] text-foreground-placeholder lg:text-caption1_400 lg:leading-4">
            <span>{date}</span>
            {showNewDot && (
              <span
                className="mt-0.5 size-1 shrink-0 rounded-full bg-destructive"
                aria-hidden
              />
            )}
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
          <div className="min-w-0 flex-1 flex flex-col gap-5 py-1 lg:gap-3">
            {bannerSrc ? (
              <div className="relative w-full max-w-[720px] overflow-hidden rounded-md bg-muted">
                <Image
                  src={bannerSrc}
                  alt={bannerAlt ?? title}
                  width={720}
                  height={240}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}
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
              >
                문의하기
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCollapse}
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

