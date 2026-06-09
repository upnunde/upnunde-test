"use client";

import { AiFieldLoadingMessage } from "@/components/episode/EpisodeAiFieldLoading";
import { EPISODE_FORM_FIELD_COPY } from "@/lib/episode-form-copy";
import { cn } from "@/lib/utils";

const MAX_SCRIPT = 5000;

export interface EpisodeScriptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  textareaClassName?: string;
  rows?: number;
  isLoading?: boolean;
  loadingMessage?: string;
}

/** 에피소드 대본 — 일반 placeholder 입력 (샘플 오버레이 없음) */
export function EpisodeScriptTextarea({
  value,
  onChange,
  className,
  textareaClassName,
  rows = 8,
  isLoading = false,
  loadingMessage = EPISODE_FORM_FIELD_COPY.aiComposer.fieldLoading.script,
}: EpisodeScriptTextareaProps) {
  return (
    <div className={cn("flex flex-col gap-my-12", className)}>
      {isLoading ? (
        <div
          className="flex h-[400px] max-h-[400px] w-full items-start rounded-md border border-border-10 bg-white px-my-12 py-my-12"
          aria-busy="true"
        >
          <AiFieldLoadingMessage message={loadingMessage} />
        </div>
      ) : (
        <textarea
          rows={rows}
          maxLength={MAX_SCRIPT}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={EPISODE_FORM_FIELD_COPY.script.placeholder}
          aria-label="에피소드 대본"
          className={cn(
            "h-[400px] min-h-[160px] max-h-[400px] w-full resize-y overflow-y-auto rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary",
            textareaClassName,
          )}
        />
      )}
      <div className="flex justify-end text-caption1_400 text-on-surface-30">
        {isLoading ? "—" : value.length}/{MAX_SCRIPT}
      </div>
    </div>
  );
}
