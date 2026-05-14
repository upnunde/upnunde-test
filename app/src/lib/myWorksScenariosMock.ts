/** 내 작품 — 상황공략 목록 목업 (상황공략 탭·분석 공통) */
export interface MyWorksScenarioMock {
  id: string;
  title: string;
  tagline: string;
  thumbnailUrl?: string;
}

export const MY_WORKS_SCENARIOS_MOCK: MyWorksScenarioMock[] = [
  {
    id: "s1",
    title: "밤하늘의 별들에게",
    tagline: "별빛 아래서 나누는 첫 대화",
    thumbnailUrl: "/scenario-stars-night.png",
  },
  {
    id: "s2",
    title: "비밀 화원으로",
    tagline: "잠긴 문 너머의 향기",
    thumbnailUrl: "/scenario-secret-garden.png",
  },
  {
    id: "s3",
    title: "마지막 인사",
    tagline: "떠나기 전 남기고 싶은 말",
    thumbnailUrl: "/scenario-last-greeting.png",
  },
  {
    id: "s4",
    title: "거울 너머",
    tagline: "다른 나와 마주한 밤",
    thumbnailUrl: "/scenario-beyond-mirror.png",
  },
  {
    id: "s5",
    title: "안개 속 산책",
    tagline: "길을 잃어도 괜찮은 저녁",
    thumbnailUrl: "/scenario-fog-walk.png",
  },
];
