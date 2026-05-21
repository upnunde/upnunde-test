/** API 연동 전 — 직전 회차 메타로 지난 사건 히스토리 초안 생성 */

export const PREVIOUS_EPISODE_HISTORY_DELAY_MS = 1200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getEpisodeTitle(episodeNumber: number): string {
  if (episodeNumber === 116) return "작성 중인 에피소드";
  if (episodeNumber === 117) return "기억의 늪에 빠진 로맨스";
  if (episodeNumber === 118) return "잊혀진 과거의 그림자";
  if (episodeNumber === 119) return "운명의 갈림길에서";
  if (episodeNumber === 120) return "빛과 그림자";
  return `에피소드 ${episodeNumber}화`;
}

/** 직전 회차별 샘플 히스토리 (프로토타입) */
const SAMPLE_PREVIOUS_HISTORY: Partial<Record<number, string>> = {
  117:
    "116화 이후, 주인공은 봉인된 문양과 연결된 단서를 좇다 새벽에 폐성당으로 향했습니다. " +
    "동료들의 경고와 불안 속에서도 진실 확인을 선택했고, 지하 입구에서 차가운 안개와 낯선 속삭임을 마주했습니다.",
  118:
    "117화 「기억의 늪에 빠진 로맨스」에서 주인공은 잃어버린 기억의 조각을 되찾으며, " +
    "카일런과 리아 사이의 긴장과 베로니카의 냉담한 시선이 겹쳐지는 밤을 보냈습니다. " +
    "회귀 직전의 감정선과 아직 풀리지 않은 복선이 이번 화의 출발점이 됩니다.",
  119:
    "118화 「잊혀진 과거의 그림자」에서 숲 속 마차 사고와 하인들의 실종, 독이 든 유리병을 통해 " +
    "주인공은 죽음 직전의 회상을 맞이했습니다. 공작성 안에서의 고립과 배신 가능성이 드러난 뒤, " +
    "장례식장 환영과 낯선 남자의 눈물까지 이어진 사건이 남아 있습니다.",
};

function buildDefaultPreviousHistory(prevEpisodeNo: number): string {
  const title = getEpisodeTitle(prevEpisodeNo);
  return (
    `【${prevEpisodeNo}화 「${title}」 직전 정리】\n` +
    `직전 회차의 주요 사건·감정선·남은 갈등을 바탕으로 이번 화 이전 상황을 요약했어요.\n` +
    `- 핵심 인물 관계와 미해결 떡밥을 이어 서술해 주세요.\n` +
    `- ${prevEpisodeNo}화 결말 직후의 시간·장소·주인공 심리를 기준으로 작성했습니다.`
  );
}

/** 현재 회차 번호 기준 직전 회차 히스토리 초안 (없으면 null) */
export async function generatePreviousEpisodeHistory(
  currentEpisodeNo: number,
): Promise<string | null> {
  const prevEpisodeNo = Math.floor(currentEpisodeNo) - 1;
  if (!Number.isFinite(currentEpisodeNo) || prevEpisodeNo < 1) {
    return null;
  }

  await delay(PREVIOUS_EPISODE_HISTORY_DELAY_MS);

  const sample = SAMPLE_PREVIOUS_HISTORY[prevEpisodeNo];
  const text = sample ?? buildDefaultPreviousHistory(prevEpisodeNo);
  return text.length > 5000 ? `${text.slice(0, 4999)}…` : text;
}

export function canLoadPreviousEpisodeHistory(
  currentEpisodeNo: number | null | undefined,
): boolean {
  if (currentEpisodeNo == null || !Number.isFinite(currentEpisodeNo)) {
    return false;
  }
  return Math.floor(currentEpisodeNo) > 1;
}
