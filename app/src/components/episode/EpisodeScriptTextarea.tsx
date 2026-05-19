"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EPISODE_FORM_FIELD_COPY } from "@/lib/episode-form-copy";
import { EPISODE_SCRIPT_SAMPLE } from "@/lib/episode-script-sample";
import { cn } from "@/lib/utils";

const MAX_SCRIPT = 5000;

export interface EpisodeScriptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function EpisodeScriptTextarea({
  value,
  onChange,
  className,
}: EpisodeScriptTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isEmpty = value.trim().length === 0;
  const showEmptyState = isEmpty && !isFocused;
  const { empty: emptyCopy } = EPISODE_FORM_FIELD_COPY.script;

  const focusTextarea = useCallback(() => {
    textareaRef.current?.focus();
  }, []);

  const handleLoadSample = useCallback(() => {
    onChange(EPISODE_SCRIPT_SAMPLE);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [onChange]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={8}
          maxLength={MAX_SCRIPT}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            showEmptyState ? undefined : EPISODE_FORM_FIELD_COPY.script.placeholder
          }
          aria-label="에피소드 대본"
          className={cn(
            "min-h-[160px] max-h-[400px] w-full rounded-md border border-border-10 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary",
            showEmptyState && "text-transparent caret-on-surface-10",
          )}
        />

        {showEmptyState ? (
          <div
            role="presentation"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-md px-6 py-8 text-center"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-on-surface-20">{emptyCopy.title}</p>
              <p className="text-xs leading-5 text-on-surface-30">{emptyCopy.description}</p>
            </div>
            <ul className="flex flex-col gap-1 text-left text-xs text-on-surface-30">
              {emptyCopy.tagHints.map((hint) => (
                <li key={hint}>
                  <code className="font-mono text-[11px] text-on-surface-20">{hint}</code>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              className="pointer-events-auto h-10 min-w-20 rounded-md border-border-20 text-sm font-medium text-secondary-on-secondary shadow-none hover:bg-surface-20"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleLoadSample}
            >
              {emptyCopy.sampleButton}
            </Button>
            <button
              type="button"
              className="pointer-events-auto text-xs text-primary underline-offset-2 hover:underline"
              onMouseDown={(e) => e.preventDefault()}
              onClick={focusTextarea}
            >
              직접 작성하기
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex justify-end text-xs text-on-surface-30">
        {value.length}/{MAX_SCRIPT}
      </div>
    </div>
  );
}
