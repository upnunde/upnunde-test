"use client";

import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { Figma20_252Prototype } from "@/components/prototype/Figma20_252Prototype";
import { PAGE_SCROLL_ROOT_CLASS, PAGE_SCROLL_TOP_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

/**
 * Figma `20:582` 프로토타입 (별도 페이지)
 * @see https://www.figma.com/design/wxrlczSyjZ0eAfQ2suYFPO/?node-id=20-582
 * @see docs/figma-to-ds-mapping.md
 */
export default function PrototypeFigma20_252Page() {
  return (
    <StandaloneHeaderPage>
      <div
        className={cn(
          PAGE_SCROLL_ROOT_CLASS,
          PAGE_SCROLL_TOP_CLASS,
          "figma-prototype-light items-center",
        )}
      >
        <Figma20_252Prototype />
      </div>
    </StandaloneHeaderPage>
  );
}
