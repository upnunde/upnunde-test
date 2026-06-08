import { cn } from "@/lib/utils";

export const profileReadonlyInputClassName =
  "h-12 w-full rounded-md border border-slate-200 bg-slate-100 px-4 text-base font-normal leading-6 text-on-surface-30 focus:outline-none";

export const profileEditableInputClassName =
  "h-12 w-full rounded-md border border-slate-200 bg-white px-4 text-base font-medium leading-6 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus-within:border-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30";

export const profileTextareaClassName =
  "min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-white p-4 text-base font-normal leading-6 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30";

export function ProfileFieldLabel({
  text,
  hint,
}: {
  text: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-base font-bold leading-5 text-on-surface-10">{text}</span>
      {hint ? <span className="text-sm font-normal leading-5 text-on-surface-20">{hint}</span> : null}
    </div>
  );
}

export function ProfileCharCount({ current, max }: { current: number; max: number }) {
  return (
    <div className="flex justify-end">
      <span className="text-xs font-normal tabular-nums leading-4 text-on-surface-30">
        {current}/{max}
      </span>
    </div>
  );
}

export function profileTabButtonClassName(active: boolean): string {
  return cn(
    "flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2.5 text-base font-bold leading-6",
    active
      ? "border-b-2 border-slate-800 text-on-surface-10"
      : "text-on-surface-disabled",
  );
}
