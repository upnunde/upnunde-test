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
    autoFillFromPrevious: "이전 회차 AI요약",
    autoFillLoading: "이전 회차 정보를 불러오고 있어요",
    autoFillUnavailable: "첫 회차이거나 회차 정보가 없어 불러올 수 없어요",
    autoFillDone: "이전 회차 정보를 채웠어요",
  },
  aiComposer: {
    placeholder: "AI로 에피소드 내용을 작성해 보세요.",
    fieldLoading: {
      title: "제목을 생성하고 있어요",
      summary: "요약을 생성하고 있어요",
      thumbnail: "대표 이미지를 생성하고 있어요",
      history: "지난 사건 히스토리를 생성하고 있어요",
      script: "에피소드 대본을 생성하고 있어요",
      composer: "초안을 생성하고 있어요",
    },
    emptyTitle: "이번 화의 이야기를 간략히 알려 주세요",
    emptyDescription:
      "아래 입력창에 핵심 장면·감정·전개를 적으면 AI가 제목, 요약, 히스토리, 대본을 채워 드려요.",
  },
  script: {
    subtitle: "변환 시 장면·대사 블록으로 나뉩니다.",
    aiProduce: "AI 제작",
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
