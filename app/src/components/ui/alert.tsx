import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "design-system/utils"

/**
 * 리노벨 Alert — DS 스펙 재구현.
 * variant: default (카드 톤) · destructive (에러 톤)
 */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-body3_500 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 [&_svg]:row-span-2 [&_svg]:translate-y-0.5 [&_svg]:text-current [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "bg-background text-destructive [&_[data-slot=alert-description]]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-body3_400 text-foreground-muted group-has-[>svg]/alert:col-start-2",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
