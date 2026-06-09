import { cn } from "@/lib/utils";

export const profileReadonlyInputClassName =
  "h-[42px] w-full rounded-md border border-slate-200 bg-slate-100 px-my-16 text-body1_400 text-on-surface-30 focus:outline-none";

export const profileEditableInputClassName =
  "h-[42px] w-full rounded-md border border-slate-200 bg-white px-my-16 text-body1_500 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus-within:border-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30";

export const profileTextareaClassName =
  "min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-white p-my-16 text-body1_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30";

export function ProfileFieldLabel({
  text,
  hint,
}: {
  text: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-my-4">
      <span className="text-body1_700 text-on-surface-10">{text}</span>
      {hint ? <span className="text-body3_400 text-on-surface-20">{hint}</span> : null}
    </div>
  );
}

export function ProfileCharCount({ current, max }: { current: number; max: number }) {
  return (
    <div className="flex justify-end">
      <span className="text-caption1_400 tabular-nums text-on-surface-30">
        {current}/{max}
      </span>
    </div>
  );
}

export function profileTabButtonClassName(active: boolean): string {
  return cn(
    "flex h-my-36 min-w-0 cursor-pointer items-center justify-center gap-my-8 text-body1_700",
    active
      ? "border-b-2 border-slate-800 text-on-surface-10"
      : "text-on-surface-disabled",
  );
}
