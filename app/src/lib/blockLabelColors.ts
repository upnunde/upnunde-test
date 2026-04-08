import type { BlockType } from "@/types/editor";

/**
 * 블록 타입 라벨(#동영상 등) 색상.
 * 에러·검증 실패 UI(rose/red)와 혼동되지 않도록 rose·밝은 빨강 계열은 사용하지 않습니다.
 */
export const LABEL_COLOR_BY_TYPE: Record<BlockType, string> = {
  scene: "text-emerald-600",
  top_desc: "text-primary",
  text: "text-zinc-600",
  background: "text-blue-600",
  bgm: "text-fuchsia-600",
  sfx: "text-orange-700",
  character: "text-violet-600",
  gallery: "text-teal-600",
  video: "text-sky-600",
  direction: "text-indigo-600",
  choice: "text-cyan-600",
  event: "text-amber-600",
  event_end: "text-amber-700",
};
