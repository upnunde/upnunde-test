import type { BlockType } from "@/types/editor";

/**
 * 블록 타입 라벨(#동영상 등) 색상.
 * 에러·검증 실패 UI(rose/red)와 혼동되지 않도록 rose·밝은 빨강 계열은 사용하지 않습니다.
 */
export const LABEL_COLOR_BY_TYPE: Record<BlockType, string> = {
  scene: "text-amber-600",
  top_desc: "text-yellow-600",
  text: "text-neutral-400",
  background: "text-lime-500",
  bgm: "text-emerald-400",
  sfx: "text-cyan-600",
  character: "text-blue-700",
  gallery: "text-violet-600",
  video: "text-fuchsia-600",
  direction: "text-indigo-600",
  choice: "text-slate-500",
  event: "text-stone-500",
  event_end: "text-stone-500",
};
