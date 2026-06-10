# 모바일 레이아웃 가이드

정본 토큰·매핑: `docs/design-system.md` · 코드 단일 소스: `app/src/lib/page-layout.ts`

## 브레이크포인트

- **모바일**: `max-lg` (1024px 미만)
- **데스크톱**: `lg:` (1024px 이상)
- 뷰포트 높이: `h-dvh` / `min-h-dvh`

## 페이지 좌우 인셋 (가로 패딩)

화면·스크롤 영역·서브헤더·카드 본문·섹션 헤더 등 **콘텐츠가 화면 가장자리에 닿는 좌우 패딩**은 아래를 따른다.

| 뷰포트 | 토큰 | 값 |
|--------|------|-----|
| 모바일 (`< lg`) | `px-my-12` | **12px** |
| 데스크톱 (`lg+`) | `px-my-20` | 20px |

### 코드

```ts
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";

// PAGE_GUTTER_X_CLASS === "px-my-12 lg:px-my-20"
```

파생 상수(`PAGE_SCROLL_GUTTER_CLASS`, `PAGE_CONTENT_PAD_X_CLASS`, `PAGE_SUBHEADER_CLASS` 등)는 모두 `PAGE_GUTTER_X_CLASS`를 사용한다.

### 적용 대상

- AppShell 하위 `main` 스크롤 영역
- 서브 페이지 제목 바(`PAGE_SUBHEADER_CLASS`)
- `PageCard`·`Title2 asSectionHeader` 본문 인셋
- 분석·정산·알림·문의 등 대시보드/목록 스크롤 루트
- 리스트 행·카드 아이템의 좌우 인셋 (`SeriesItem`, `EpisodeListItem` 등)

## 페이지·섹션 스택 간격 (gap)

페이지 본문·카드 묶음·대시보드 섹션 등 **세로/가로 스택 간격**은 아래를 따른다.

| 뷰포트 | 토큰 | 값 |
|--------|------|-----|
| 모바일 (`< lg`) | `gap-my-12` | **12px** |
| 데스크톱 (`lg+`) | `gap-my-20` | 20px |

### 코드

```ts
import { PAGE_GUTTER_GAP_CLASS, PAGE_STACK_CLASS } from "@/lib/page-layout";

// PAGE_GUTTER_GAP_CLASS === "gap-my-12 lg:gap-my-20"
// PAGE_STACK_CLASS === PAGE_CONTAINER + flex-col + PAGE_GUTTER_GAP + py-my-20
```

### 적용 대상

- AppShell `main` 본문 스택 (`PAGE_STACK_CLASS`)
- 정산·분석·프로필 탭 내부 섹션 열
- `SeriesItem`·`CharacterItem` 카드 레이아웃
- `PAGE_SCROLL_COLUMN_CLASS` 스크롤 열

### 적용 제외

- **XL 탭** 목록 간격 (`tab-styles.ts` `gap-my-20` 고정)
- **모달** 본문 스택 (`modal-styles.ts` 등)
- 폼 필드 묶음(`gap-my-4`·`gap-my-8`)·버튼 그룹 등 컴포넌트 내부 미세 간격

### 적용 제외 (패딩)

- **버튼·칩·입력 필드** 내부 패딩 (`Button` `px-my-16` 등) — 컨트롤 스펙 유지
- **모달 헤더** 등 이미 `modal-styles.ts`로 정의된 영역 — 모달 전용 규칙 우선
- 에디터 **블록 본문** 등 에디터 전용 인셋 — `docs/editor-policies.md` 참고

## 서브 헤더 높이

| 뷰포트 | 토큰 | 값 |
|--------|------|-----|
| 모바일 | `h-my-56` | 56px |
| 데스크톱 | `h-my-64` | 64px |

글로벌 상단 `Header` / `AppHeader`는 `h-14`(56px) 고정.

## 신규 페이지 체크리스트

1. 스크롤·본문 가로 인셋에 `PAGE_SCROLL_GUTTER_CLASS` 또는 `PAGE_GUTTER_X_CLASS` 사용
2. 본문 세로 스택에 `PAGE_STACK_CLASS` 또는 `PAGE_GUTTER_GAP_CLASS` 사용
3. 서브헤더에 `PAGE_SUBHEADER_CLASS` 사용
4. 인라인 `px-my-20`·`gap-my-20` 단독 사용 금지 — 반드시 `*-my-12 lg:*-my-20` 또는 상수 import
5. `npm run check:routes` (라우트 변경 시)
