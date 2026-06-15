import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-my-8 whitespace-nowrap rounded-md text-body3_500 transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive max-lg:min-h-my-32",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-border-20 bg-background hover:bg-accent hover:text-accent-foreground disabled:border-border-20 dark:bg-input/30 dark:border-border-20 dark:hover:bg-input/50",
        /** Secondary fill (light) — Figma `secondary-secondary` (#F0F0F5) */
        secondary:
          "border-0 bg-secondary text-on-secondary shadow-none hover:opacity-90 disabled:bg-surface-disabled-10 disabled:text-on-surface-disabled",
        /** Secondary 강조 fill (dark) — Figma `secondary-secondary-container` (#343436) */
        secondaryContainer:
          "border-0 bg-secondary-container text-on-secondary-container shadow-none hover:opacity-90 disabled:bg-surface-disabled-10 disabled:text-on-surface-disabled",
        /** Error fill — `error-error` / `error-on-error` */
        error:
          "border-0 bg-error-error text-error-on-error shadow-none hover:opacity-90 disabled:bg-surface-disabled-10 disabled:text-on-surface-disabled",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        /** Tertiary — fill/outline 없음 · 기본 neutral(`on-surface-30`). primary/error 톤은 `text-primary`/`text-error-error` className 조합 */
        tertiary:
          "border-0 bg-transparent shadow-none text-on-surface-30 hover:text-on-surface-20 disabled:text-on-surface-disabled disabled:opacity-100",
        link: "text-primary underline-offset-4 hover:underline",
        /** 추가 버튼 (호버 시 표시되는 플로팅 메뉴용) - 공통 스타일 (drop shadow 제거) */
        addMenu:
          "rounded-full bg-white ring-1 ring-slate-900/20 text-on-surface-10 hover:bg-white",
      },
      size: {
        default: "h-my-32 min-w-my-64 px-my-12 has-[>svg]:px-my-12",
        xs: "h-my-24 max-lg:h-my-32 min-w-my-48 gap-my-4 rounded-md px-my-8 text-caption1_500 has-[>svg]:px-my-8 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-my-32 min-w-my-64 rounded-md gap-my-8 px-my-12 has-[>svg]:px-my-12",
        lg: "h-my-36 min-w-my-72 rounded-md px-my-12 text-body2_500 has-[>svg]:px-my-12",
        form: "h-[42px] min-w-my-80 rounded-md px-my-16 has-[>svg]:px-my-16",
        icon: "size-my-32 max-lg:min-w-my-32",
        "icon-xs": "size-my-24 max-lg:size-my-32 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-my-32 max-lg:min-w-my-32",
        /** 36×36 — 내부 SVG 22px · stroke-width 1.5 공통 */
        "icon-lg":
          "size-my-36 max-lg:min-w-my-36 [&_svg:not([class*='size-'])]:!size-[22px] [&_svg]:![stroke-width:1.5]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
