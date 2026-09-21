"use client";

import { IPhone15ProFrame } from "@/components/preview/IPhone15ProFrame";
import { Figma71_479Prototype } from "@/components/prototype/Figma71_479Prototype";
import { cn } from "design-system/utils";

/** iPhone 15 Pro 상단 스테이터스 바 + Dynamic Island — 스크롤 위 고정 오버레이 */
function IosStatusBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-sticky flex h-11 items-end justify-between bg-transparent px-6 pb-1.5 text-foreground",
        className,
      )}
      aria-hidden
    >
      <span className="w-16 text-center text-caption1_700 tabular-nums">9:41</span>

      <div className="pointer-events-none absolute left-1/2 top-2.5 h-7 w-[100px] -translate-x-1/2 rounded-full bg-inverse" />

      <div className="flex w-16 items-center justify-end gap-1">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
          <path d="M8 9.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
          <path
            d="M4.4 7.2a5.2 5.2 0 0 1 7.2 0l-1.1 1.1a3.6 3.6 0 0 0-5 0L4.4 7.2Z"
            opacity="0.9"
          />
          <path
            d="M1.6 4.4a9.2 9.2 0 0 1 12.8 0L13.3 5.5a7.6 7.6 0 0 0-10.6 0L1.6 4.4Z"
            opacity="0.75"
          />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="11"
            rx="2.5"
            stroke="currentColor"
            opacity="0.4"
          />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
          <path d="M23 4v4a1.5 1.5 0 0 0 0-4Z" fill="currentColor" opacity="0.45" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Figma `71:479` 코인 이벤트 홈 — 웹 검수용 단독 시안
 * @see https://www.figma.com/design/wxrlczSyjZ0eAfQ2suYFPO/?node-id=71-479
 */
export function CoinEventPrototype() {
  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-6 px-0 pb-16 pt-4">
      <header className="w-full max-w-[360px] px-1">
        <h1 className="text-heading3_700 text-foreground">코인 이벤트</h1>
        <p className="mt-1 text-body4_400 text-foreground-muted">
          Figma 71:479 · iPhone 15 Pro 프레임 · DS 컴포넌트
        </p>
      </header>

      <section className="mx-auto flex w-[360px] flex-col">
        <IPhone15ProFrame>
          <div className="relative h-full min-h-0 overflow-hidden bg-background text-foreground">
            <IosStatusBar />
            <div className="flex h-full min-h-0 flex-col">
              <Figma71_479Prototype />
            </div>
          </div>
        </IPhone15ProFrame>
      </section>
    </div>
  );
}
