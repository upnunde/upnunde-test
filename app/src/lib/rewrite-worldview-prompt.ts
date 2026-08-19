const REWRITE_DELAY_MS = 480;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function compactWhitespace(text: string): string {
  return text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function splitNotes(raw: string): string[] {
  return raw
    .split(/[\n.!?。]+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2);
}

function takeKeywords(raw: string, max = 6): string[] {
  const tokens = raw
    .replace(/[#,[\]()"'“”‘’]/g, " ")
    .split(/[\s,/|·]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && token.length <= 16);

  const unique: string[] = [];
  for (const token of tokens) {
    if (unique.includes(token)) continue;
    unique.push(token);
    if (unique.length >= max) break;
  }
  return unique;
}

function clip(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength - 1);
  const lastBreak = Math.max(sliced.lastIndexOf("\n"), sliced.lastIndexOf(" "));
  return `${(lastBreak > maxLength * 0.7 ? sliced.slice(0, lastBreak) : sliced).trimEnd()}…`;
}

/**
 * 두서없는 세계관 메모를 임시 프롬프트 골격으로 재작성합니다.
 * 확정 규칙이 오기 전까지의 로컬 초안용입니다.
 */
export async function rewriteWorldviewPrompt(
  raw: string,
  maxLength: number,
): Promise<string> {
  await delay(REWRITE_DELAY_MS);

  const notes = compactWhitespace(raw);
  const sentences = splitNotes(notes);
  const keywords = takeKeywords(notes);
  const hook = sentences[0] ?? notes.slice(0, 80);
  const extra = sentences.slice(1, 4);
  const keywordLine = keywords.length > 0 ? keywords.join(", ") : "장르·분위기 미정";
  const conflict =
    extra[0] ??
    `${hook}에서 비롯된 이해관계와 감정의 충돌이 이야기 전개를 밀어붙인다.`;
  const texture = extra[1] ?? "낮과 밤의 대비, 공간의 온도, 인물 사이의 거리감을 장면마다 분명하게 잡을 것.";
  const taboo = extra[2] ?? "갑자기 설정을 뒤집거나, 메모에 없는 초자연 규칙을 추가하지 말 것.";

  const rewritten = `[세계 개요]
${hook}
이 세계는 위 메모를 절대 기준으로 삼는다. 장면·대사·사건은 모두 이 전제와 충돌하지 않게 전개한다.

[시공간 · 무대]
시대와 장소는 메모에 드러난 단서를 우선한다. 구체적 지명이 없으면 메모 분위기에 맞는 도시·궁정·학원 중 하나를 고정하고, 에피소드마다 배경을 바꾸지 않는다.
핵심 키워드: ${keywordLine}

[사회 · 관계 규칙]
권력, 신분, 금기, 친밀함의 거리는 메모의 말투와 사건을 따른다. 인물은 자신의 위치에서만 행동할 수 있다.

[핵심 갈등]
${conflict}

[톤 · 장르]
문체는 메모의 온도를 유지한다. 과한 설명보다 행동·대사·공간 묘사로 세계관을 보여 준다.
${texture}

[AI 전개 가이드]
- 할 것: 메모에 나온 인물·사건·감정을 매 장면에 되새기고, 인과를 분명하게 이어 간다.
- 하지 말 것: ${taboo}
- 모호한 부분은 추측으로 메우지 말고, 기존 메모를 반복·구체화한다.

[원본 메모]
${notes}`;

  return clip(rewritten, maxLength);
}
