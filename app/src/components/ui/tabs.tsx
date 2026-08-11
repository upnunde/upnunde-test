"use client";

import type { ComponentProps } from "react";
import {
  Tabs as DsTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
} from "design-system/ui/tabs";
import { useClientMounted } from "@/hooks/useClientMounted";
import { cn } from "design-system/utils";

export { TabsList, TabsTrigger, TabsContent, tabsListVariants };

type TabsProps = ComponentProps<typeof DsTabs>;

/**
 * Base UI Tabs는 SSR HTML과 클라이언트 첫 페인트의 className이 어긋날 수 있다.
 * 마운트 전에는 동일 레이아웃 셸만 두고, 이후에 DS Tabs를 렌더한다.
 */
export function Tabs({ className, children, ...props }: TabsProps) {
  const mounted = useClientMounted();

  if (!mounted) {
    return (
      <div
        data-slot="tabs"
        data-orientation="horizontal"
        className={cn(
          "group/tabs flex min-h-9 gap-2 data-horizontal:flex-col",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <DsTabs className={className} {...props}>
      {children}
    </DsTabs>
  );
}
