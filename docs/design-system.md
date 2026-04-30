# 디자인 시스템 가이드

> **단일 소스 원칙**: 이 문서가 UI 원칙과 디자인 토큰의 공식 기준이다.  
> 코드(`app/src/app/globals.css`)와 불일치할 경우 이 문서를 기준으로 코드를 수정한다.

---

## Part 1: UI 원칙

### UI 목표

- UI 관점의 최우선 목표는 **사용자 경험의 일관성 유지**다.
- 새 기능은 "새로운 화면을 만드는 것"보다, 기존 사용자에게 **익숙한 패턴 안에서 확장**하는 것을 우선한다.

### 재사용 우선 원칙 (Interface/Foundation First)

- 신규 UI 구현 시 우선순위는 다음과 같다.  
  **1) 기존 컴포넌트 재사용 → 2) 기존 컴포넌트 변형(variant/props) → 3) 신규 컴포넌트 생성**
- 버튼, 입력, 모달, 팝오버, 토스트, 리스트 아이템 등 공통 인터페이스 요소는 가능한 한 기존 컴포넌트 계층을 사용한다.
- 같은 역할의 UI가 여러 스타일로 분화되지 않도록, 비슷한 기능은 동일한 인터랙션/시각 패턴으로 유지한다.

### 토큰·변수 대응 원칙

- 색상, 간격, 타이포, radius, shadow 등은 임의 값보다 **이 문서에 정의된 디자인 토큰**을 우선 사용한다.
- 새 변수값이 필요할 때는 먼저 기존 토큰과 매핑 가능한지 검토한다.
- 불가피하게 새 토큰을 추가할 경우, 일회성 하드코딩이 아니라 **재사용 가능한 이름**으로 정의하고 이 문서에 추가한다.

### 언어

- **제품 UI 카피는 한국어**를 기본으로 한다.
- 코드 주석·문서는 팀 합의에 따라 한국어 또는 영어를 쓰되, **사용자에게 보이는 문자열**은 한국어 일관성을 우선한다.

### Global Policy (표기 규칙)

아래 규칙은 통계, 목록, 히스토리, 정산, 광고 등 **서비스 전반의 공통 표기 기준**으로 적용한다.

#### 날짜·시간 표기

- `30초 미만`: `방금 전`
- `1분 미만`: `SS초 전` (예: `30초 전`, `59초 전`)
- `60분 미만`: `MM분 전` (예: `1분 전`, `59분 전`)
- `24시간 미만`: `HH시간 전` (예: `1시간 전`, `23시간 전`)
- `24시간 이상`: `YYYY.MM.DD` (예: `2025.01.01`)
- 사용자에게 "최신이 위"인지 혼동이 없도록, **정렬 정책**은 [editor-policies.md](./editor-policies.md)와 맞춘다.

#### 수치 표기

- `10,000 미만`: 천 단위 구분 기호 사용 (예: `1`, `9,999`)
- `10,000 이상`: 소수점 둘째 자리까지 노출한 만 단위 표기 (예: `13,500 -> 1.35만`, `13,999 -> 1.39만`)
- 갱신 주기: 접속 및 새로고침 시 서버 최신 데이터 기준으로 갱신한다.

#### 기간만료 시간 표기

- `30일 이상`: `YYYY.MM.DD 까지` (예: `2026.01.31 까지`)
- `30일 미만`: `DD일 남음` (예: `1일 남음`, `30일 남음`)
- `24시간 미만`: `HH시간 남음` (예: `1시간 남음`, `23시간 남음`)
- `1시간 미만`: `MM분 남음` (예: `1분 남음`, `59분 남음`)
- 기간 만료 시: `기간 만료` 고정 텍스트 사용

### 접근성

- 아이콘만 있는 버튼(뒤로 가기, 히스토리 등)에는 **`aria-label`** 을 제공한다.
- 키보드·포커스는 Radix UI 컴포넌트의 기본 동작을 존중하고, 커스텀 시 **포커스 트랩·탭 순서**를 깨지 않는다.

### 시각 디자인

- **Tailwind 유틸리티**로 간격·타이포·색을 맞춘다. 시맨틱 토큰(`text-on-surface-10`, `primary`, `border-10` 등)을 제품 전반에서 일관되게 사용한다.
- 팝오버·다이얼로그는 **과한 너비·과한 애니메이션**보다 **읽기 쉬운 폭과 명확한 구획**을 우선한다.
- 컴포넌트 단위 커스터마이징이 필요할 때도, 먼저 기존 class 조합/variant로 해결하고 새로운 스타일 규칙 추가는 마지막 수단으로 둔다.

### 피드백

- 임시저장 완료 등은 **스낵바(토스트)** 등 비차단 피드백으로 짧게 알린다.
- 확인이 필요한 이탈은 **모달/다이얼로그**로 명시적으로 묻는다.

### 카피 톤

- 짧고 정중한 설명체("~해 주세요", "~했어요")를 기본으로 한다.
- 사용자 자책을 유발하는 표현은 피하고, **다음 행동**(임시저장, 취소)을 버튼에 분명히 적는다.

### Figma·MCP

- 디자인 시안과의 정합은 **스크린샷·토큰**을 참고하되, 최종 구현은 **이 저장소의 컴포넌트·토큰**에 맞춘다 (루트 README의 "디자인은 참고용" 원칙).

### 구현 전 체크리스트 (UI)

- 이 UI를 기존 컴포넌트로 구현할 수 있는가?
- 새 값이 필요하다면 기존 토큰으로 대응 가능한가?
- 기존 화면과 상호작용(버튼 위치, 용어, 피드백 방식)이 일관적인가?
- 유사 기능 화면과 비교했을 때 사용자가 학습 비용 없이 사용할 수 있는가?

---

## Part 2: 디자인 토큰

### 1. 타이포그래피

폰트 패밀리: **Pretendard JP** (서비스 전역 단일 서체)

#### Heading

| 토큰명 | Size | Line Height | Weight |
|--------|------|-------------|--------|
| `heading1_700` | 32px | 38px | 700 (Bold) |
| `heading2_700` | 24px | 34px | 700 (Bold) |
| `heading2_500` | 24px | 34px | 500 (Medium) |
| `heading3_700` | 22px | 30px | 700 (Bold) |
| `heading3_500` | 22px | 30px | 500 (Medium) |
| `heading4_700` | 20px | 28px | 700 (Bold) |
| `heading4_500` | 20px | 28px | 500 (Medium) |
| `heading5_700` | 18px | 26px | 700 (Bold) |
| `heading5_500` | 18px | 26px | 500 (Medium) |

#### Body

| 토큰명 | Size | Line Height | Weight |
|--------|------|-------------|--------|
| `body1_700` | 16px | 24px | 700 (Bold) |
| `body1_500` | 16px | 24px | 500 (Medium) |
| `body1_400` | 16px | 24px | 400 (Regular) |
| `body2_700` | 15px | 22px | 700 (Bold) |
| `body2_500` | 15px | 22px | 500 (Medium) |
| `body2_400` | 15px | 22px | 400 (Regular) |
| `body3_700` | 14px | 20px | 700 (Bold) |
| `body3_500` | 14px | 20px | 500 (Medium) |
| `body3_400` | 14px | 20px | 400 (Regular) |
| `body4_700` | 13px | 18px | 700 (Bold) |
| `body4_500` | 13px | 18px | 500 (Medium) |
| `body4_400` | 13px | 18px | 400 (Regular) |

#### Caption

| 토큰명 | Size | Line Height | Weight |
|--------|------|-------------|--------|
| `caption1_700` | 12px | 16px | 700 (Bold) |
| `caption1_500` | 12px | 16px | 500 (Medium) |
| `caption1_400` | 12px | 16px | 400 (Regular) |
| `caption2_700` | 11px | 14px | 700 (Bold) |
| `caption2_500` | 11px | 14px | 500 (Medium) |
| `caption2_400` | 11px | 14px | 400 (Regular) |

#### 타이포 예외 규칙

- **font-weight 600 (semibold), 800 (extrabold)**: 가이드에 없음. 기존 사용처는 500 또는 700으로 마이그레이션.
- **10px 이하**: 가이드 최소는 11px(`caption2`). 특수 UI(뱃지 카운터 등)만 예외 허용.

---

### 2. 컬러 토큰 (프리미티브)

UI에서 직접 쓰지 않고, **시맨틱 토큰이 참조하는 원천 팔레트**.

#### White Opacity

| 토큰명 | 값 |
|--------|-----|
| `white-opacity-10` | `#FFFFFF` 7% |
| `white-opacity-20` | `#FFFFFF` 9% |
| `white-opacity-30` | `#FFFFFF` 17% |
| `white-opacity-40` | `#FFFFFF` 23% |
| `white-opacity-50` | `#FFFFFF` 33% |
| `white-opacity-60` | `#FFFFFF` 47% |
| `white-opacity-70` | `#FFFFFF` 72% |
| `white-opacity-80` | `#FFFFFF` 78% |
| `white-opacity-90` | `#FFFFFF` 87% |
| `white-opacity-100` | `#FFFFFF` 91% |
| `white-opacity-110` | `#FFFFFF` 95% |
| `white` | `#FFFFFF` |

#### Black Opacity

| 토큰명 | 값 |
|--------|-----|
| `black-opacity-10` | `#000000` 2% |
| `black-opacity-20` | `#000000` 4% |
| `black-opacity-30` | `#000000` 8% |
| `black-opacity-40` | `#000000` 12% |
| `black-opacity-50` | `#000000` 22% |
| `black-opacity-60` | `#000000` 38% |
| `black-opacity-70` | `#000000` 42% |
| `black-opacity-80` | `#000000` 53% |
| `black-opacity-90` | `#000000` 67% |
| `black-opacity-100` | `#000000` 74% |
| `black-opacity-110` | `#000000` 86% |
| `black-opacity-120` | `#000000` 93% |
| `black` | `#000000` |

#### Grayscale

| 토큰명 | 값 |
|--------|-----|
| `grayscale-10` | `#F9F9FC` |
| `grayscale-20` | `#F2F3F5` |
| `grayscale-30` | `#E8E9EC` |
| `grayscale-40` | `#E3E3E8` |
| `grayscale-50` | `#D0D0D5` |
| `grayscale-60` | `#C5C5C7` |
| `grayscale-70` | `#A9A9AB` |
| `grayscale-80` | `#919194` |
| `grayscale-90` | `#767678` |
| `grayscale-100` | `#626264` |
| `grayscale-110` | `#434436` |
| `grayscale-120` | `#282625` |
| `grayscale-130` | `#1C1C1E` |
| `grayscale-140` | `#111112` |

#### Red

| 토큰명 | 값 |
|--------|-----|
| `red-10` | `#FFF0F0` |
| `red-20` | `#FFD8D8` |
| `red-30` | `#FFBCBC` |
| `red-40` | `#FF9B9B` |
| `red-50` | `#F46464` |
| `red-60` | `#F03535` |
| `red-70` | `#EC2222` |
| `red-80` | `#E52828` |
| `red-90` | `#C82424` |
| `red-100` | `#B81C1C` |
| `red-110` | `#6B1C1C` |

#### Pink

| 토큰명 | 값 |
|--------|-----|
| `pink-10` | `#FEF0FC` |
| `pink-20` | `#FEE3F9` |
| `pink-30` | `#FDD2F5` |
| `pink-40` | `#FCBBF0` |
| `pink-50` | `#FA8EE5` |
| `pink-60` | `#FB68DD` |
| `pink-70` | `#F642D4` |
| `pink-80` | `#C437A9` |
| `pink-90` | `#922D7F` |
| `pink-100` | `#722663` |
| `pink-110` | `#59214E` |

---

### 3. 컬러 시맨틱 토큰

UI에서 **실제로 사용하는 역할 기반 토큰**. 값은 프리미티브를 참조한다.

#### Surface (배경면)

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `surface-10` | `white` | `#FFFFFF` |
| `surface-20` | `grayscale-10` | `#F9F9FC` |
| `surface-disabled-10` | `black-opacity-10` | `#000000` 2% |
| `surface-disabled-20` | `black-opacity-20` | `#000000` 4% |
| `surface-inverse-10` | `grayscale-120` | `#282625` |
| `surface-inverse-20` | `grayscale-140` | `#111112` |

#### On Surface (텍스트/아이콘)

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `on-surface-10` | `grayscale-120` | `#282625` |
| `on-surface-20` | `grayscale-100` | `#626264` |
| `on-surface-30` | `grayscale-80` | `#919194` |
| `on-surface-disabled` | `black-opacity-50` | `#000000` 22% |
| `on-surface-inverse` | `white` | `#FFFFFF` |

#### Background

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `background-10` | `white` | `#FFFFFF` |
| `background-20` | `grayscale-10` | `#F9F9FC` |

#### Primary (브랜드)

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `primary` | `pink-70` | `#F642D4` |
| `on-primary` | `white` | `#FFFFFF` |
| `primary-container` | `pink-10` | `#FEF0FC` |
| `on-primary-container` | `pink-70` | `#F642D4` |

#### Secondary

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `secondary` | `grayscale-30` | `#E8E9EC` |
| `on-secondary` | `grayscale-100` | `#626264` |
| `secondary-container` | `white` | `#FFFFFF` |
| `on-secondary-container` | `white` | `#FFFFFF` |

#### Border

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `border-10` | `black-opacity-30` | `#000000` 8% |
| `border-20` | `black-opacity-40` | `#000000` 12% |
| `border-30` | `black-opacity-50` | `#000000` 22% |
| `border-strong` | `grayscale-100` | `#626264` |
| `border-inverse` | `white` | `#FFFFFF` |

#### Divider

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `divider-10` | `black-opacity-10` | `#000000` 2% |
| `divider-20` | `black-opacity-30` | `#000000` 8% |

#### Dim (오버레이)

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `dim-10` | `black-opacity-60` | `#000000` 38% |
| `dim-20` | `black-opacity-80` | `#000000` 53% |
| `dim-30` | `black-opacity-90` | `#000000` 67% |

#### Error

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `error` | `red-70` | `#EC2222` |
| `on-error` | `white` | `#FFFFFF` |
| `error-container` | `red-10` | `#FFF0F0` |
| `on-error-container` | `red-70` | `#EC2222` |

#### Success

| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `success` | (정의 필요) | — |
| `on-success` | (정의 필요) | — |
| `success-container` | (정의 필요) | — |
| `on-success-container` | (정의 필요) | — |

---

### 4. 스페이싱

단위: **px**. Tailwind 기본 스케일과 다르므로 `@theme` 또는 임의값(`p-[12px]`)으로 적용한다.

| 토큰명 | 값 |
|--------|-----|
| `spacing-1` | 1px |
| `spacing-2` | 2px |
| `spacing-4` | 4px |
| `spacing-8` | 8px |
| `spacing-12` | 12px |
| `spacing-16` | 16px |
| `spacing-20` | 20px |
| `spacing-24` | 24px |
| `spacing-28` | 28px |
| `spacing-32` | 32px |
| `spacing-36` | 36px |
| `spacing-40` | 40px |
| `spacing-44` | 44px |
| `spacing-48` | 48px |
| `spacing-52` | 52px |
| `spacing-56` | 56px |
| `spacing-60` | 60px |
| `spacing-64` | 64px |
| `spacing-68` | 68px |
| `spacing-72` | 72px |
| `spacing-80` | 80px |

---

### 5. Radius (모서리)

단위: **px**. 비인터랙티브 surface 기본값은 **4px**.

| 토큰명 | 값 |
|--------|-----|
| `radius-2` | 2px |
| `radius-4` | 4px |
| `radius-6` | 6px |
| `radius-8` | 8px |
| `radius-12` | 12px |
| `radius-16` | 16px |
| `radius-20` | 20px |
| `radius-circle` | 999px |

#### 라운드(반경) 정책

- 버튼·칩·토글 등 **인터랙티브 컴포넌트**를 제외한 모든 surface의 기본 라운드는 **4px(`radius-4`)**를 사용한다.
- 대표 대상: 카드, 패널, 모달/드로어 본문 컨테이너, 섹션 박스, 정보 블록.
- 인터랙티브 컴포넌트는 접근성·터치 영역·기존 시각 규칙을 고려해 별도 라운드 값을 유지할 수 있다.

---

## Part 3: 코드 적용 가이드

### CSS 변수 네이밍 규칙

```css
/* 프리미티브 (직접 사용 X) */
--pink-70: #F642D4;
--grayscale-80: #919194;

/* 시맨틱 (UI에서 사용) */
--primary: var(--pink-70);
--on-surface-30: var(--grayscale-80);
```

### Tailwind 연결 (`globals.css` @theme)

```css
@theme inline {
  --color-primary: var(--primary);
  --color-on-surface-10: var(--on-surface-10);
  --color-border-10: var(--border-10);
  /* ... */
}
```

### 타이포 유틸리티 예시

```css
@utility text-body1-700 {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}
```

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-30 | 초안 작성 — UI 원칙(`ux-and-content-standards.md`) + 토큰(`design-tokens.md`) 통합 |
