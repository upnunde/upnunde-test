"use client";

import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { WorkDetailPrototype } from "@/components/prototype/WorkDetailPrototype";
import { PAGE_SCROLL_ROOT_CLASS, PAGE_SCROLL_TOP_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

/**
 * Figma 작품 상세 프로토타입
 * @see https://www.figma.com/design/wxrlczSyjZ0eAfQ2suYFPO/?node-id=2-32
 * @see docs/figma-to-ds-mapping.md
 */
export default function PrototypeWorkDetailPage() {
  return (
    <StandaloneHeaderPage>
      <div
        className={cn(
          PAGE_SCROLL_ROOT_CLASS,
          PAGE_SCROLL_TOP_CLASS,
          "items-center",
        )}
      >
        <WorkDetailPrototype />
      </div>
    </StandaloneHeaderPage>
  );
}
