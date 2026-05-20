import { cva, type VariantProps } from "class-variance-authority";

/** 인터랙티브 컨트롤 기본 높이 — 구 h-9(36px) 통일 제거, h-8(32px) */
export const CONTROL_HEIGHT_CLASS = "h-8 min-h-8";

/** 칩 필터·탭 그룹 가로 간격 공통 */
export const CHIP_GROUP_GAP_CLASS = "gap-2";

/** FilterChip M(h-8)과 같은 행 — 날짜·드롭다운·셀렉트 트리거 높이·라운드·보더 */
export const CHIP_COMPANION_CONTROL_CLASS =
  "h-8 min-h-8 shrink-0 rounded-[8px] border border-border-10 bg-white px-3 text-sm font-normal leading-5 text-on-surface-20 shadow-none hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

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
          "text-on-surface-10 outline outline-1 outline-offset-[-1px] outline-border-10",
      },
      {
        chipType: "outline",
        variant: "default",
        class:
          "text-on-surface-30 outline outline-1 outline-offset-[-1px] outline-border-10 hover:text-on-surface-20",
      },
      { corner: "square", size: "l", class: "rounded-[12px]" },
      { corner: "square", size: "m", class: "rounded-[8px]" },
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

/** 필터 칩 — square 기본: L(h-10)=radius 12px, M(h-8)=radius 8px */
export function filterChipVariantProps(
  selected: boolean,
  size: NonNullable<ChipVariantProps["size"]> = "m",
  corner?: ChipVariantProps["corner"],
): Pick<ChipVariantProps, "chipType" | "variant" | "corner" | "size" | "icon"> {
  const resolvedCorner = corner ?? "square";
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
