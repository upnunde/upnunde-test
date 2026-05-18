import * as React from "react"

import { cn } from "@/lib/utils"
import { formFieldFocusClassName, formTextFieldBaseClassName } from "@/lib/form-field-styles"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        formTextFieldBaseClassName,
        formFieldFocusClassName,
        "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-12 w-full min-w-0 bg-transparent py-1 text-base file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
