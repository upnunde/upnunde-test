"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface AiConvertLoadingOverlayProps {
  message?: string;
  messageSteps?: string[];
  className?: string;
}

/** 참고 영상 기반: 4도트 합체/분리 로더 (모노톤) */
function AiLoaderIcon({ className }: { className?: string }) {
  return (
    <div className={cn("ai-orb-loader", className)} aria-hidden>
      <div className="ai-orb-loader-spin">
        <span className="ai-orb-node ai-orb-node-0">
          <span className="ai-orb ai-orb-mono" />
        </span>
        <span className="ai-orb-node ai-orb-node-90">
          <span className="ai-orb ai-orb-mono" />
        </span>
        <span className="ai-orb-node ai-orb-node-180">
          <span className="ai-orb ai-orb-mono" />
        </span>
        <span className="ai-orb-node ai-orb-node-270">
          <span className="ai-orb ai-orb-mono" />
        </span>
      </div>
    </div>
  );
}

export function AiConvertLoadingOverlay({
  message = "에디터로 변환 중이에요…",
  messageSteps,
  className,
}: AiConvertLoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const resolvedSteps =
    messageSteps && messageSteps.length > 0 ? messageSteps : [message];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setStepIndex(0);
  }, [resolvedSteps]);

  useEffect(() => {
    if (resolvedSteps.length <= 1) return;
    const interval = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % resolvedSteps.length);
    }, 1500);
    return () => window.clearInterval(interval);
  }, [resolvedSteps]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "ai-convert-overlay fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 backdrop-blur-[1.5px]",
        className,
      )}
      style={{ backgroundColor: "var(--dim-30)" }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <AiLoaderIcon />
      <p className="ai-loading-message text-sm font-medium" style={{ color: "var(--on-surface-inverse)" }}>
        <span key={stepIndex} className="ai-loading-message-fade">
          {resolvedSteps[stepIndex] ?? message}
        </span>
      </p>
    </div>,
    document.body,
  );
}
