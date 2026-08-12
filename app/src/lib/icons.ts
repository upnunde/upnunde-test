/**
 * DS 아이콘 정본 — 앱에서 아이콘은 이 모듈만 import한다.
 * `pencilSparkles`는 현재 앱 lucide(0.563) / DS 레지스트리에 없어 Lucide 공식 path로 보강.
 * DS에 등록되면 제거한다.
 */
import {
  ICONS as DS_ICONS,
  type LucideIcon,
} from "design-system/icons";
import { createLucideIcon } from "lucide-react";

const PencilSparkles = createLucideIcon("pencil-sparkles", [
  ["path", { d: "M10 3H8", key: "mzdi2d" }],
  ["path", { d: "m15.007 5.008 3.987 3.986", key: "1scubj" }],
  ["path", { d: "M20 15v4", key: "nmhudv" }],
  [
    "path",
    {
      d: "M21.174 6.813a2.82 2.82 0 0 0-3.986-3.987L3.842 16.175a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "fs0856",
    },
  ],
  ["path", { d: "M22 17h-4", key: "1sj068" }],
  ["path", { d: "M4 5v4", key: "13jjxc" }],
  ["path", { d: "M6 7H2", key: "8zbtv0" }],
  ["path", { d: "M9 2v2", key: "165o2o" }],
]);

export const ICONS = {
  ...DS_ICONS,
  pencilSparkles: PencilSparkles,
} as const;

export type IconKey = keyof typeof ICONS;
export type { LucideIcon };
export { Icon, type IconProps, type IconSize } from "design-system/ui/icon";
