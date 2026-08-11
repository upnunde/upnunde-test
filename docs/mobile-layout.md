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
| 모바일·데스크톱 공통 | `px-5` | **20px** |

본문에 좌우 여백이 있는 화면(스크롤 루트·서브헤더·카드 본문·목록 행 등)은 **뷰포트와 관계없이 20px**을 기본으로 한다.

### 코드

```ts
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";

// PAGE_GUTTER_X_CLASS === "px-5"
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

## 스크롤 상단 여백

서브헤더 아래 **스크롤 본문** 상단 패딩은 아래를 따른다.

| 뷰포트 | 토큰 | 값 |
|--------|------|-----|
| 모바일·데스크톱 공통 | `pt-my-12` | **12px** |

`PAGE_SCROLL_TOP_CLASS` · `PAGE_SCROLL_ROOT_TOP_CLASS` · `PAGE_SCROLL_COLUMN_CLASS` · 시리즈 폼 스크롤 등에 공통 적용.

## 스크롤 하단 여백

AppShell·Header+main 등 **페이지 스크롤 영역**은 마지막 콘텐츠 아래 **80px**(`pb-my-80`)를 항상 유지한다.

| 토큰 | 값 |
|------|-----|
| `pb-my-80` | **80px** |

### 코드

```ts
import { PAGE_SCROLL_BOTTOM_CLASS, PAGE_SCROLL_ROOT_CLASS } from "@/lib/page-layout";

// PAGE_SCROLL_BOTTOM_CLASS === "pb-my-80"
// PAGE_SCROLL_ROOT_CLASS === py-0 + 가로 인셋 + pb-my-80
// PAGE_SCROLL_TOP_CLASS === pt-my-12
// PAGE_SCROLL_ROOT_TOP_CLASS === PAGE_SCROLL_TOP_CLASS + 가로 인셋 + pb-my-80
```

`PAGE_SCROLL_COLUMN_CLASS`에도 `PAGE_SCROLL_BOTTOM_CLASS`가 포함된다.

### 적용 대상

- 내 작품·정산·프로필·알림·문의·가이드 등 AppShell `main` 스크롤 루트
- 분석 대시보드 스크롤 루트
- 리소스 관리·에피소드 목록 등 `PAGE_SCROLL_COLUMN_CLASS` 열

### 적용 제외

- **드롭다운·짧은 팝오버** 내부 스크롤
- **에디터** 본문 스크롤 (`docs/editor-policies.md`)
- 사이드바 오버레이

### 바텀 시트 모달 (고정 푸터)

`presentation="auto"` 폼·입력 모달(에피소드 생성기, 에피소드 폼 등)은 **스크롤 본문**과 **하단 고정 버튼 영역**의 하단 여백을 분리한다.

| 영역 | 하단 여백 | 코드 |
|------|----------|------|
| 스크롤 본문 | **80px** (`pb-my-80`) | `formDialogSheetScrollBodyClassName` |
| 고정 푸터(취소·생성하기 등) | **없음** — 시트 하단에 밀착 | `formDialogSheetStickyFooterClassName` |

- 스크롤 본문의 80px는 마지막 필드·텍스트아rea 아래 **콘텐츠 끝** 여백이다.
- 고정 푸터에는 `pb-my-80`·`PAGE_SCROLL_BOTTOM_CLASS`를 주지 않는다. iPhone safe-area·브라우저 하단 크롬은 `DialogContent` 셸(`max-lg:pb-[calc(env(safe-area-inset-bottom)+…)]`)이 처리한다.
- 플로팅 컴포저 등 본문 위에 겹치는 입력 UI가 열릴 때는 `FLOATING_COMPOSER_SCROLL_PAD_CLASS` 등 **추가** 패딩을 별도로 검토한다.

## 서브 헤더 높이

| 뷰포트 | 토큰 | 값 |
|--------|------|-----|
| 모바일 | `h-my-56` | 56px |
| 데스크톱 | `h-my-64` | 64px |

글로벌 상단 `Header` / `AppHeader`는 `h-14`(56px) 고정.

## 신규 페이지 체크리스트

1. 스크롤·본문 가로 인셋에 `PAGE_SCROLL_GUTTER_CLASS` 또는 `PAGE_GUTTER_X_CLASS` 사용
2. 본문 세로 스택에 `PAGE_STACK_CLASS` 또는 `PAGE_GUTTER_GAP_CLASS` 사용
3. 스크롤 루트 하단에 `PAGE_SCROLL_BOTTOM_CLASS` 또는 `PAGE_SCROLL_ROOT_CLASS` 사용
4. 서브헤더에 `PAGE_SUBHEADER_CLASS` 사용
5. 인라인 `gap-my-20` 단독 사용 금지 — 가로는 `PAGE_GUTTER_X_CLASS` 또는 `px-5`, gap은 `PAGE_GUTTER_GAP_CLASS` 또는 `*-my-12 lg:*-my-20`
6. `npm run check:routes` (라우트 변경 시)
