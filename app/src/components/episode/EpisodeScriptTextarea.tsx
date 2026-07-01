"use client";

import { AiFieldLoadingMessage } from "@/components/episode/EpisodeAiFieldLoading";
import { InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EPISODE_FORM_FIELD_COPY } from "@/lib/episode-form-copy";
import { cn } from "design-system/utils";

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
    <div className={cn("flex flex-col gap-3", className)}>
      {isLoading ? (
        <>
          <div
            className="flex h-[400px] max-h-[400px] w-full items-start rounded-md border border-border bg-background px-3 py-3"
            aria-busy="true"
          >
            <AiFieldLoadingMessage message={loadingMessage} />
          </div>
          <div className="flex justify-end text-body4_400 tabular-nums text-foreground-muted">
            —/{MAX_SCRIPT}
          </div>
        </>
      ) : (
        <InputGroup>
          <Textarea
            rows={rows}
            maxLength={MAX_SCRIPT}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={EPISODE_FORM_FIELD_COPY.script.placeholder}
            aria-label="에피소드 대본"
            className={cn(
              "h-[400px] min-h-[160px] max-h-[400px] resize-y overflow-y-auto",
              textareaClassName,
            )}
          />
          <InputHypertext count={value.length} max={MAX_SCRIPT} />
        </InputGroup>
      )}
    </div>
  );
}
