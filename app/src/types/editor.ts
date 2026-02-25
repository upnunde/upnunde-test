/**
 * Linear Block Editor - Block Types
 * Each block is independent; no nested attributes.
 */

export type BlockType =
  | "scene"       // Scene Header (title + turn/sceneNumber in data)
  | "top_desc"    // Top situation/badge text
  | "text"        // Dialogue/Narration
  | "background"  // BG Image
  | "bgm"         // Background Music
  | "sfx"         // Sound Effect
  | "character"   // Character Appearance/Acting
  | "gallery"     // CG Event
  | "direction"   // Camera/Effect
  | "choice"      // Interactive Choices
  | "event"       // Event Start
  | "event_end";  // Event End

export interface ChoiceItem {
  id: string;
  text: string;
  nextScene: string;
  isPaid: boolean;
  isAiMode?: boolean;
}

/** Block metadata. For `choice` blocks, use `data.choices`. For `text` blocks, use `data.speaker`. */
export interface ScriptBlockData {
  choices?: ChoiceItem[];
  /** Speaker name for dialogue (text blocks). Default "독백" (Monologue). Preview uses this only; ignores # character for dialogue attribution. */
  speaker?: string;
  [key: string]: unknown;
}

export interface ScriptBlock {
  id: string;
  type: BlockType;
  content: string;
  /** Optional metadata. For text blocks: speaker is stored here (default "독백"). */
  data?: ScriptBlockData;
}
