"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICONS } from "@/lib/icons";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "design-system/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  isTodayNotificationDate,
  markNotificationAsRead,
  useUnreadNotifications,
} from "@/lib/notification-store";
import { Badge } from "design-system/ui/badge";
import { cn } from "design-system/utils";
import {
  notificationCategoryBadgeClass,
  notificationCategoryLabel,
  type NotificationData,
} from "@/types/notification";

function HeaderNotificationRow({
  notification,
  onSelect,
}: {
  notification: NotificationData;
  onSelect: (notification: NotificationData) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className="flex w-full cursor-pointer items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
    >
      <Badge
        variant="secondary"
        size="md"
        shape="square"
        className={cn("mt-0.5 w-[58px]", notificationCategoryBadgeClass(notification.category))}
      >
        {notificationCategoryLabel(notification.category)}
      </Badge>
      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 text-body3_500 text-foreground">{notification.title}</div>
        <div className="mt-1 text-caption1_400 text-foreground-placeholder">{notification.date}</div>
      </div>
    </button>
  );
}

function NotificationGroup({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: NotificationData[];
  onSelect: (notification: NotificationData) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <h3 className="px-5 pb-1 pt-3 text-caption1_500 text-foreground-muted">{title}</h3>
      <ul>
        {items.map((notification) => (
          <li key={notification.id}>
            <HeaderNotificationRow notification={notification} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 헤더 알림 벨 — 안읽은 최신 항목 팝오버 */
export function HeaderNotificationMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const unread = useUnreadNotifications();
  const hasUnread = unread.length > 0;

  const todayItems = unread.filter((item) => isTodayNotificationDate(item.date));
  const earlierItems = unread.filter((item) => !isTodayNotificationDate(item.date));

  const handleSelect = (notification: NotificationData) => {
    markNotificationAsRead(notification.id);
    setOpen(false);
    router.push(`/notifications?open=${notification.id}`);
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push("/notifications");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton
          type="button"
          variant="ghost"
          shape="circle"
          size="icon-xl"
          icon={ICONS.bell}
          className="relative"
          aria-label={hasUnread ? `알림, 새 알림 ${unread.length}개` : "알림"}
          aria-expanded={open}
        >
          {hasUnread ? (
            <span
              className="pointer-events-none absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive"
              aria-hidden
            />
          ) : null}
        </IconButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="z-overlay w-[360px] max-w-[calc(100vw-24px)] overflow-hidden p-0"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <h2 className="text-heading4_700 text-foreground">알림</h2>
          <Button type="button" variant="ghost" size="sm" onClick={handleViewAll}>
            전체 보기
          </Button>
        </div>
        <div className="min-h-[400px] max-h-[800px] overflow-y-auto border-t border-border">
          {unread.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center px-5">
              <p className="text-center text-body3_400 text-foreground-placeholder">
                새 알림이 없습니다
              </p>
            </div>
          ) : (
            <>
              <NotificationGroup title="오늘" items={todayItems} onSelect={handleSelect} />
              <NotificationGroup title="이전" items={earlierItems} onSelect={handleSelect} />
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
