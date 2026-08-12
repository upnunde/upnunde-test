"use client";

import { useRouter } from "next/navigation";
import { ICONS } from "@/lib/icons";
import { IconButton } from "@/components/ui/icon-button";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { cn } from "design-system/utils";

/**
 * 서브헤더(뒤로가기 페이지) 우측 공용 액션 — 홈 이동 + 다크모드 토글.
 * 글로벌 헤더가 숨겨지는 모바일/태블릿(max-lg)에서만 노출한다.
 * 데스크톱(lg+)은 글로벌 헤더가 테마 토글 등을 제공하므로 중복을 피해 숨긴다.
 */
export function SubHeaderActions({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <div className={cn("flex shrink-0 items-center gap-2 lg:hidden", className)}>
      <IconButton
        type="button"
        variant="ghost"
        shape="circle"
        size="icon-xl"
        icon={ICONS.home}
        onClick={() => router.push("/series")}
        aria-label="내 작품 홈으로"
      />
      <ThemeToggleButton />
    </div>
  );
}
