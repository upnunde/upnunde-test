import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-my-12 py-my-8 text-body1_400 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-body3_400",
        "min-h-[160px] max-h-[400px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
