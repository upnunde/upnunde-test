import type { BlockType } from "@/types/editor";

/** 에디터·읽기 전용 뷰 공통: 리소스 블록 왼쪽 `# …` 한글 라벨 */
export const BLOCK_LABEL_KO: Record<BlockType, string> = {
  scene: "장면",
  top_desc: "장면정보",
  text: "텍스트",
  background: "배경",
  bgm: "배경음악",
  sfx: "효과음",
  character: "캐릭터",
  gallery: "갤러리",
  video: "동영상",
  direction: "연출",
  choice: "선택지",
  event: "장면 전환",
  event_end: "이벤트 종료",
};
