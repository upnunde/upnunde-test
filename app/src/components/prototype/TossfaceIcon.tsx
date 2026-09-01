import { cn } from "design-system/utils";

import "./tossface.css";

/** Figma `20:582` Frame 3 — 48×48 Surface Container + 32×32 Tossface 이모지 */
const ICON_TILE_CLASS =
  "flex size-12 shrink-0 items-center justify-center rounded-xl bg-background-muted";

const EMOJI_CLASS = "tossface text-[28px] leading-none select-none";

export type TossfaceIconProps = {
  emoji: string;
  label: string;
  className?: string;
  emojiClassName?: string;
};

export function TossfaceIcon({ emoji, label, className, emojiClassName }: TossfaceIconProps) {
  return (
    <span className={cn(ICON_TILE_CLASS, className)} role="img" aria-label={label}>
      <span className={cn(EMOJI_CLASS, emojiClassName)} aria-hidden>
        {emoji}
      </span>
    </span>
  );
}
