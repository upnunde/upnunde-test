/** 에피소드 생성 폼 — 필드별 보조 문구·플레이스홀더 (창작자 안내) */

export const EPISODE_FORM_FIELD_COPY = {
  title: {
    subtitle: "목록·에디터에 표시되는 회차명이에요.",
    placeholder: "예: 새벽의 문턱에서",
  },
  summary: {
    subtitle: "회차 선택 화면에 보이는 한 줄 소개예요.",
    placeholder: "예: 봉인된 문이 열리며, 첫 선택의 대가를 마주한다",
  },
  thumbnail: {
    subtitle: "9:16 비율의 회차 썸네일이에요.",
  },
  history: {
    subtitle: "이번 화 이전 사건·관계를 정리해 주세요.",
    placeholder: "직전 회차 요약, 인물 관계, 남은 떡밥",
  },
  script: {
    subtitle: "변환 시 장면·대사 블록으로 나뉩니다.",
    placeholder: "[scene], [text] 태그 또는 자유 작성",
    empty: {
      title: "대본을 작성해 주세요",
      description: "장면·대사·연출을 입력해 주세요.",
      sampleButton: "샘플 대본 불러오기",
      tagHints: [
        "[scene]",
        '[text speaker="이름"]',
        "[direction]",
        "[event]",
      ],
    },
  },
} as const;
