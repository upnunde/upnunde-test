import { chipVariants } from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

/** @deprecated `FilterChip` / `chipVariants` 사용 권장 */
export const filterChipOutlineClassName = chipVariants({
  chipType: "outline",
  variant: "default",
  corner: "square",
  size: "l",
  icon: false,
});

/** @deprecated `FilterChip` / `chipVariants` 사용 권장 */
export const filterChipFilledClassName = chipVariants({
  chipType: "fill",
  variant: "activated",
  corner: "square",
  size: "l",
  icon: false,
});

/** @deprecated `FilterChip` size="m" 사용 권장 */
export const filterChipTabActiveClassName = chipVariants({
  chipType: "fill",
  variant: "activated",
  corner: "square",
  size: "m",
  icon: false,
});

/** @deprecated `FilterChip` size="m" 사용 권장 */
export const filterChipTabInactiveClassName = cn(
  chipVariants({
    chipType: "outline",
    variant: "default",
    corner: "square",
    size: "m",
    icon: false,
  }),
  "min-w-0",
);
