import type { BlockType } from "@/types/editor";

/**
 * 블록 타입 라벨(#동영상 등) 색상.
 * 에러·검증 실패 UI(rose/red)와 혼동되지 않도록 rose·밝은 빨강 계열은 사용하지 않습니다.
 */
export const LABEL_COLOR_BY_TYPE: Record<BlockType, string> = {
  scene: "text-[#CA6C29]",
  top_desc: "text-[#C5A221]",
  text: "text-[#919194]",
  background: "text-[#80B72E]",
  bgm: "text-[#1D90BE]",
  sfx: "text-[#264EC6]",
  character: "text-[#7E2EE0]",
  gallery: "text-[#8A38F5]",
  video: "text-[#C02ABB]",
  direction: "text-[#2FBA90]",
  choice: "text-[#6C81AE]",
  event: "text-[#946060]",
  event_end: "text-[#946060]",
};
