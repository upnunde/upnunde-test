import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/** DS 스페이싱 토큰 — `p-my-24` 등이 `p-0`·`px-my-20`과 merge 시 충돌 인식되도록 */
const DS_SPACING_THEME = [
  "my-1", "my-2", "my-4", "my-8", "my-12", "my-16", "my-20", "my-24", "my-28",
  "my-32", "my-36", "my-40", "my-44", "my-48", "my-52", "my-56", "my-60",
  "my-64", "my-68", "my-72", "my-80",
] as const

/** DS 타이포 토큰(`text-body3_500` 등)은 font-size 그룹 — `text-on-surface-*` 색상과 병행 가능 */
const isDsTypographyClassPart = (classPart: string) =>
  /^(?:body|heading|caption)\d+_\d{3}$/.test(classPart)

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [...DS_SPACING_THEME],
    },
    classGroups: {
      "font-size": [{ text: [isDsTypographyClassPart] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
