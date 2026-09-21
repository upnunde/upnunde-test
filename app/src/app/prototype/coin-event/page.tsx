"use client";

import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { CoinEventPrototype } from "@/components/prototype/CoinEventPrototype";
import { PAGE_SCROLL_ROOT_CLASS, PAGE_SCROLL_TOP_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

/**
 * 코인 이벤트 홈 시안 (Figma 71:479)
 * @see https://www.figma.com/design/wxrlczSyjZ0eAfQ2suYFPO/?node-id=71-479
 */
export default function PrototypeCoinEventPage() {
  return (
    <StandaloneHeaderPage>
      <div
        className={cn(
          PAGE_SCROLL_ROOT_CLASS,
          PAGE_SCROLL_TOP_CLASS,
          "items-center px-4",
        )}
      >
        <CoinEventPrototype />
      </div>
    </StandaloneHeaderPage>
  );
}
