import { cva, type VariantProps } from "class-variance-authority";

/** 인터랙티브 컨트롤 compact 티어 — h-8(32px) */
export const CONTROL_HEIGHT_CLASS = "h-8 min-h-8";

/** 인터랙티브 컨트롤 standard 티어 — h-9(36px). 구 h-10(40px) 대체 */
export const CONTROL_HEIGHT_STANDARD_CLASS = "h-9 min-h-9";

/** 인터랙티브 컨트롤 form 티어 — 42px. 구 h-12(48px) 대체 */
export const CONTROL_HEIGHT_FORM_CLASS = "h-[42px] min-h-[42px]";

/** compact(h-8·32px) 컨트롤 그룹 가로 간격 — spacing-4 = 4px */
export const CONTROL_GROUP_GAP_COMPACT_CLASS = "gap-[4px]";

/** standard(h-9·36px) 컨트롤 그룹 가로 간격 — spacing-8 = 8px */
export const CONTROL_GROUP_GAP_STANDARD_CLASS = "gap-[8px]";

/** @deprecated `CONTROL_GROUP_GAP_COMPACT_CLASS` — FilterChip M·h-8 그룹 */
export const CHIP_GROUP_GAP_CLASS = CONTROL_GROUP_GAP_COMPACT_CLASS;

/** FilterChip M(h-8)과 같은 행 — 날짜·드롭다운·셀렉트 트리거 높이·라운드·보더 */
export const CHIP_COMPANION_CONTROL_CLASS =
  "h-8 min-h-8 shrink-0 rounded-[8px] border border-border-20 bg-white px-3 text-sm font-normal leading-5 text-on-surface-20 shadow-none hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20";

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
        l: "h-9 min-w-0 text-[15px] leading-[22px]",
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
          "border-0 bg-secondary-container text-on-secondary-container hover:opacity-90",
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
      { corner: "square", class: "rounded-[8px]" },
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

/** FilterChip size → 그룹 gap (L=h-9→8px, M=h-8→4px) */
export function chipGroupGapClass(
  chipSize: NonNullable<ChipVariantProps["size"]>,
): string {
  return chipSize === "l"
    ? CONTROL_GROUP_GAP_STANDARD_CLASS
    : CONTROL_GROUP_GAP_COMPACT_CLASS;
}

/** 필터 칩 — square 기본: L/M 공통 radius 8px */
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
