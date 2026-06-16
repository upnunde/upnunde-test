"use client";

import { createPortal } from "react-dom";
import {
  FloatingComposerBar,
  type FloatingComposerBarProps,
} from "@/components/ui/floating-composer-bar";
import { useClientMounted } from "@/hooks/useClientMounted";

export type FloatingAiComposerPortalProps = Omit<FloatingComposerBarProps, "placement"> & {
  enabled?: boolean;
};

/** document.body 포털로 플로팅 AI 입력 바를 렌더링 */
export function FloatingAiComposerPortal({
  enabled = true,
  className = "!z-[60] !pointer-events-auto",
  ...props
}: FloatingAiComposerPortalProps) {
  const mounted = useClientMounted();

  if (!enabled || !mounted) return null;

  return createPortal(
    <FloatingComposerBar placement="fixed" className={className} {...props} />,
    document.body,
  );
}
