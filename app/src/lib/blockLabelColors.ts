import type { BlockType } from "@/types/editor";

/**
 * 에디터 블록 타입 라벨(`#장면`, `#장면정보`, `#배경` 등) 전용 chroma.
 *
 * **DS 예외 정책**
 * - 일반 UI의 `text-{role}-foreground` 짝 규칙(bg-{role} 내부만)과 **별도**로 허용한다.
 * - 색상 값은 `block-label-chroma.css`의 DS primitive 변수(`--warning-500` 등)만 사용.
 * - 정의·변경은 **이 파일 + block-label-chroma.css**만. 소비처는 `LABEL_COLOR_BY_TYPE`만 참조.
 *
 * | 라벨 | 블록 타입 | chroma |
 * |------|-----------|--------|
 * | #장면N | scene | orange |
 * | #장면정보 | top_desc | yellow |
 * | #배경 | background | lime |
 * | #배경음악 | bgm | teal |
 * | #효과음 | sfx | sky |
 * | #캐릭터 | character | royal blue |
 * | #갤러리 | gallery | purple |
 * | #동영상 | video | magenta |
 * | #선택지 | choice | steel blue |
 * | #장면 전환 | event | dusty rose |
 * | 스피커 | text | gray |
 *
 * @see `.cursor/rules/editor-patterns.mdc` — 블록 라벨 chroma
 */
export const LABEL_COLOR_BY_TYPE: Record<BlockType, string> = {
  scene: "text-block-label-scene",
  top_desc: "text-block-label-top-desc",
  text: "text-foreground-muted",
  background: "text-block-label-background",
  bgm: "text-block-label-bgm",
  sfx: "text-block-label-sfx",
  character: "text-block-label-character",
  gallery: "text-block-label-gallery",
  video: "text-block-label-video",
  direction: "text-block-label-direction",
  choice: "text-block-label-choice",
  event: "text-block-label-event",
  event_end: "text-block-label-event",
};
