import { cva, type VariantProps } from "class-variance-authority";

/** Figma `chips` — type × variant × corner × size × icon */
export const chipVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center overflow-hidden",
    "font-medium font-['Pretendard_JP'] transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      chipType: {
        fill: "",
        outline: "bg-transparent",
      },
      variant: {
        activated: "",
        default: "",
      },
      corner: {
        circle: "rounded-full",
        square: "",
      },
      size: {
        l: "h-10 min-w-0 text-base leading-5",
        m: "h-8 min-w-0 text-sm leading-5",
      },
      icon: {
        true: "gap-0.5",
        false: "",
      },
    },
    compoundVariants: [
      {
        chipType: "fill",
        variant: "activated",
        class:
          "border-0 bg-secondary-secondary text-secondary-on-secondary hover:opacity-90",
      },
      {
        chipType: "fill",
        variant: "default",
        class:
          "bg-surface-20 text-on-surface-30 outline outline-1 outline-offset-[-1px] outline-border-10 hover:text-on-surface-20",
      },
      {
        chipType: "outline",
        variant: "activated",
        class:
          "text-on-surface-10 outline outline-1 outline-offset-[-1px] outline-border-strong",
      },
      {
        chipType: "outline",
        variant: "default",
        class:
          "text-on-surface-30 outline outline-1 outline-offset-[-1px] outline-border-20 hover:text-on-surface-20",
      },
      { corner: "square", size: "l", class: "rounded-lg" },
      { corner: "square", size: "m", class: "rounded" },
      { icon: false, size: "l", class: "px-4" },
      { icon: false, size: "m", class: "px-3" },
      { icon: true, size: "l", class: "pl-4 pr-3" },
      { icon: true, size: "m", class: "pl-3 pr-2" },
    ],
    defaultVariants: {
      chipType: "outline",
      variant: "default",
      corner: "square",
      size: "m",
      icon: false,
    },
  },
);

export type ChipVariantProps = VariantProps<typeof chipVariants>;

/** 필터 칩 — 선택 여부에 type/variant 매핑 (M=h-8 → Figma corner `rounded` = `circle`) */
export function filterChipVariantProps(
  selected: boolean,
  size: NonNullable<ChipVariantProps["size"]> = "m",
  corner?: ChipVariantProps["corner"],
): Pick<ChipVariantProps, "chipType" | "variant" | "corner" | "size" | "icon"> {
  const resolvedCorner = corner ?? (size === "m" ? "circle" : "square");
  return selected
    ? { chipType: "fill", variant: "activated", corner: resolvedCorner, size, icon: false }
    : { chipType: "outline", variant: "default", corner: resolvedCorner, size, icon: false };
}

/** 입력 토큰(Tag) — fill default circle M + 닫기 아이콘 */
export const tagVariantProps: Pick<
  ChipVariantProps,
  "chipType" | "variant" | "corner" | "size" | "icon"
> = {
  chipType: "fill",
  variant: "default",
  corner: "circle",
  size: "m",
  icon: true,
};
