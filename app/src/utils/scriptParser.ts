import type { ScriptBlock, BlockType, ChoiceItem } from "@/types/editor";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Match `// SCENE N: [Title]` — store title for next == SCENE_N == */
const SCENE_TITLE_REGEX = /^\/\/\s*SCENE\s+(\d+):\s*(.*)$/i;

/** Match `== SCENE_N ==` — create scene block with stored title and N */
const SCENE_MARKER_REGEX = /^==\s*SCENE_?(\d+)\s*==$/i;

/** Match `== Scene Name ==` (legacy fallback: plain title, no turn/sceneNumber) */
const SCENE_LEGACY_REGEX = /^==\s*(.+?)\s*==$/;

/** Match `# tag: value` */
const TAG_REGEX = /^#\s*(\w+):\s*(.*)$/;

/** Match legacy choice line: * [ text ] — extract text inside brackets */
const CHOICE_LINE_REGEX = /^\*\s*\[(.*)\]\s*$/;

/** Match next-scene line: -> SCENE_NAME */
const NEXT_SCENE_REGEX = /^->\s*(.+?)\s*$/;

/** Decorative separator: // ==== or // ========== … — skip, do not create block */
const DECORATIVE_COMMENT_REGEX = /^\/\/\s*=+/;
/** Standalone transition (e.g. -> SCENE_1) — skip; scene is delineated by == SCENE_N == */
const STANDALONE_SCENE_TRANSITION_REGEX = /^->\s*SCENE_/i;

/** Match `Speaker: Dialogue` (Speaker contains no spaces or is a known pattern) */
function parseSpeakerLine(line: string): { speaker: string; content: string } | null {
  const colonIdx = line.indexOf(":");
  if (colonIdx <= 0) return null;
  const speaker = line.slice(0, colonIdx).trim();
  const content = line.slice(colonIdx + 1).trim();
  if (!speaker || content === "") return null;
  // Avoid treating "# tag: value" or "== x ==" as speaker
  if (line.startsWith("#") || line.startsWith("==")) return null;
  return { speaker, content };
}

export function parseScriptToBlocks(text: string): ScriptBlock[] {
  const blocks: ScriptBlock[] = [];
  const lines = text.split(/\r?\n/);
  const sceneTitlesByNumber: Record<number, string> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === "") continue;

    // Structural/decorative: skip so they don’t become text blocks
    if (DECORATIVE_COMMENT_REGEX.test(trimmed)) continue;
    if (STANDALONE_SCENE_TRANSITION_REGEX.test(trimmed)) continue;

    // Legacy choice: * [ text ] with optional next line -> SCENE_NAME — group consecutive into one block
    if (trimmed.startsWith("* [")) {
      const choiceItems: ChoiceItem[] = [];
      while (i < lines.length) {
        const cur = lines[i].trim();
        if (cur === "") {
          i++;
          continue;
        }
        if (!cur.startsWith("* [")) break;

        const choiceMatch = cur.match(CHOICE_LINE_REGEX);
        const text = choiceMatch ? choiceMatch[1].trim() : cur.replace(/^\*\s*\[/, "").replace(/\]\s*$/, "").trim();
        let nextScene = "";

        if (i + 1 < lines.length) {
          const nextTrimmed = lines[i + 1].trim();
          const sceneMatch = nextTrimmed.match(NEXT_SCENE_REGEX);
          if (sceneMatch) {
            nextScene = sceneMatch[1].trim();
            i++;
          }
        }

        choiceItems.push({
          id: generateId(),
          text,
          nextScene,
          isPaid: false,
        });
        i++;
      }
      i--;
      blocks.push({
        id: generateId(),
        type: "choice",
        content: "",
        data: { choices: choiceItems },
      });
      continue;
    }

    // // SCENE N: [Title] — store title for next == SCENE_N ==
    const sceneTitleMatch = trimmed.match(SCENE_TITLE_REGEX);
    if (sceneTitleMatch) {
      const n = parseInt(sceneTitleMatch[1], 10);
      sceneTitlesByNumber[n] = sceneTitleMatch[2].trim();
      continue;
    }

    // == SCENE_N == — create scene block with title and turn/sceneNumber
    const sceneMarkerMatch = trimmed.match(SCENE_MARKER_REGEX);
    if (sceneMarkerMatch) {
      const n = parseInt(sceneMarkerMatch[1], 10);
      const title = sceneTitlesByNumber[n] ?? `씬 ${n}`;
      blocks.push({
        id: generateId(),
        type: "scene",
        content: title,
        data: { turn: n, sceneNumber: n },
      });
      continue;
    }

    // == Scene Name == (legacy: no number, just title)
    const sceneLegacyMatch = trimmed.match(SCENE_LEGACY_REGEX);
    if (sceneLegacyMatch) {
      blocks.push({
        id: generateId(),
        type: "scene",
        content: sceneLegacyMatch[1].trim(),
      });
      continue;
    }

    // # tag: value
    const tagMatch = trimmed.match(TAG_REGEX);
    if (tagMatch) {
      const [, tag, value] = tagMatch;
      const content = value.trim();

      if (tag === "turn") continue;

      if (tag === "top_desc") {
        blocks.push({
          id: generateId(),
          type: "top_desc",
          content: content || "",
        });
        continue;
      }

      let type: BlockType;

      switch (tag) {
        case "bg":
          type = "background";
          break;
        case "bgm":
          type = "bgm";
          break;
        case "sfx":
          type = "sfx";
          break;
        case "char_img":
        case "spine":
          type = "character";
          break;
        case "gallery":
          type = "gallery";
          break;
        case "direction":
          type = "direction";
          break;
        case "choice":
          type = "choice";
          break;
        default:
          type = "text";
      }

      blocks.push({
        id: generateId(),
        type,
        content: content || "none",
        ...(type === "choice" && content ? { data: { raw: content } } : {}),
      });
      continue;
    }

    // Speaker: Dialogue → emit character block then text block (state machine: character sets speaker, text is dialogue only)
    const speakerMatch = parseSpeakerLine(line);
    if (speakerMatch) {
      blocks.push({
        id: generateId(),
        type: "character",
        content: speakerMatch.speaker,
      });
      blocks.push({
        id: generateId(),
        type: "text",
        content: speakerMatch.content,
      });
      continue;
    }

    // Plain text
    blocks.push({
      id: generateId(),
      type: "text",
      content: trimmed,
    });
  }

  return blocks;
}
