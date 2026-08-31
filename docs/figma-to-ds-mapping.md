# Figma → Design System 매핑 가이드

Figma에서 읽어 온 **수치·색·간격은 DS와 1:1로 연결되지 않는다.**  
구현 시 raw px/hex를 그대로 쓰지 말고, **가장 가까운 DS 토큰·컴포넌트**로 치환한다.

참고 페이지: `/prototype/work-detail`  
Figma 원본: [리노벨_테스트 `2:32`](https://www.figma.com/design/wxrlczSyjZ0eAfQ2suYFPO/?node-id=2-32)

---

## 원칙

1. **측정 → 매핑 → 적용**  
   TalkToFigma / 공식 MCP로 수치를 읽은 뒤, 아래 표로 DS 토큰을 고른다.
2. **컴포넌트 우선**  
   같은 역할을 DS 컴포넌트가 하면 커스텀 UI 대신 DS를 쓴다.  
   예: 태그/칩 → `Badge` / `Chip`, 버튼 → `Button`
3. **스케일 밖 값**  
   DS spacing 스케일(최대 80px, 고정 단계)에 없으면  
   - 가능하면 **가장 가까운 단계**로 올리고  
   - 레이아웃이 깨질 때만 `size-[Npx]` 등 임의값을 허용한다.  
   (`design-system` spacing 정본 주석과 동일)
4. **시맨틱 색 우선**  
   `#111213` 같은 hex 복붙 대신 `text-foreground`, `text-muted-foreground`, `bg-muted` 등을 쓴다.

---

## Spacing

| Figma (px) | DS token | Tailwind | 비고 |
|------------|----------|----------|------|
| 4 | `1` | `gap-1` / `p-1` | 칩·썸네일 간격 |
| 8 | `2` | `gap-2` / `p-2` | 타이틀 블록 스택 |
| 16 | `4` | `p-4` / `gap-4` | 스토리 카드 패딩·섹션 간격 |
| 20 | `5` | `px-5` / `py-5` / `gap-5` | 페이지 거터 (`PAGE_GUTTER_X_CLASS`) |
| 60 (썸네일) | `16` (64px) | `size-16` | 60에 가장 가까움. 필요 시만 `size-[60px]` |

⚠️ token 이름 `"20"` = **80px** (`--space-20`). 20px가 아니다.

앱 공통 거터: `@/lib/page-layout` 의 `PAGE_GUTTER_X_CLASS` (= `px-5`).

---

## Radius

| Figma (px) | DS | class |
|------------|-----|--------|
| 4 | `sm_4` | `rounded-sm` |
| 8 | `md_8` | `rounded-md` |

---

## Typography

| Figma | DS utility | 용도 예 |
|-------|------------|---------|
| 24 Bold | `text-heading2_700` | 작품 제목 |
| 18 SemiBold | `text-heading5_600` | 섹션 제목 |
| 16 Medium | `text-body1_500` | 작가명 |
| 14 Bold | `text-body3_700` | 통계 값 |
| 14 SemiBold | `text-body3_600` | 스토리 소제목 |
| 14 Regular | `text-body3_400` | 본문·라벨 |
| 13 Regular | `text-body4_400` 또는 Badge 내장 타이포 | 태그 |

색은 타이포와 함께: `text-foreground` / `text-muted-foreground`.

---

## Color (hex → semantic)

요청 hex가 DS 팔레트에 없어도 **시맨틱 토큰**으로 치환한다.

| Figma | 가까운 DS / semantic | 사용 |
|-------|----------------------|------|
| `#FFFFFF` | `--white` / `bg-background` | 면 |
| `#111213` | `--grayscale-150` ≈ `text-foreground` | 제목·강조 |
| `#404348` | `--grayscale-120` ≈ `text-foreground` (섹션 타이틀) | 섹션 헤딩 |
| `#8e94a0` | `--grayscale-70` 근처 → `text-muted-foreground` | 보조 텍스트 |
| `#444444` | `text-muted-foreground` | 태그 텍스트 |
| `#f9fafa` | `--grayscale-10` 근처 → `bg-muted` | 스토리 카드 배경 |
| black 60% overlay | `bg-black/60` | 히어로 딤 |

---

## Components

| Figma 패턴 | DS / 앱 | 권장 props |
|------------|---------|------------|
| 아웃라인 태그 (스릴러 등) | `Badge` (`design-system/ui/badge`) | `variant="outline"` `size="md"` `shape="square"` |
| 선택형 필터 칩 | `Chip` (`design-system/ui/chip`) | `variant="outline"` `shape="square"` `size="sm"` |
| 입력 토큰 태그 | `@/components/ui/tag` (Chip 래퍼) | — |
| 버튼 | `Button` | DS variant/tone/size |
| 아바타 | `Avatar` | DS size 스케일 |
| 카드 셸 | DS에 Card 없음 → `rounded-md border bg-muted` 또는 `PageCard` | — |

프로토타입 `/prototype/work-detail` 태그 행은 **Badge outline square** 로 구현했다.  
(Toggle 동작이 없는 표시용 태그이므로 Chip보다 Badge가 맞다.)

---

## 워크플로 체크리스트

1. Figma에서 프레임 선택 + TalkToFigma 채널 연결 (또는 공식 MCP 링크)
2. `get_node_info` / `read_my_design` 으로 수치·카피 수집
3. 이 문서 표로 **spacing / type / color / component** 매핑표 작성 (페이지별 1표면 충분)
4. 구현 — raw px/hex 금지, DS import·utility만
5. 시각 확인 후, 스케일 밖 임의값이 남았으면 표에 “예외”로 기록

---

## 예시: `2:32` 작품 상세 매핑

| 영역 | Figma | 적용 |
|------|-------|------|
| 페이지 폭 | 420 | `max-w-[420px]` (디바이스 프레임 — 토큰 밖 예외) |
| 히어로 | 420×360 | `aspect-[420/360]` |
| 좌우 패딩 | 20 | `px-5` / `PAGE_GUTTER_X_CLASS` |
| 제목 | 24 Bold `#111213` | `text-heading2_700 text-foreground` |
| 태그 | h26 r4 stroke | `Badge` outline md square |
| 태그 gap | 4 | `gap-1` |
| 작가 | 16 Medium `#8e94a0` | `text-body1_500 text-muted-foreground` |
| 통계 | 14 / gap≈20 | `text-body3_*` + `gap-5` |
| 스토리 카드 | bg `#f9fafa` r8 pad16 | `bg-muted rounded-md p-4 border-border` |
| 에피소드 썸네일 | 60 r4 gap4 | `size-16 rounded-sm gap-1` |

구현 파일:

- `app/src/app/prototype/work-detail/page.tsx`
- `app/src/components/prototype/WorkDetailPrototype.tsx`
- `app/src/components/prototype/work-detail-assets.ts`
- `app/public/prototype/work-detail/` — Figma export JPG 저장 위치

## 이미지 export

Figma raw px가 아니라 **노드 단위 JPG**를 `public/`에 두고 `next/image`로 참조한다.

| Figma node | 파일 |
|------------|------|
| `2:33` | `hero-background.jpg` |
| `2:36` | `cover.jpg` |
| `2:66`–`2:76` | `episode-1.jpg` … `episode-6.jpg` |

```bash
cd app

# 방법 A — Figma Personal Access Token (권장)
FIGMA_ACCESS_TOKEN=figd_xxx npm run export:figma-prototype

# 방법 B — TalkToFigma (소켓 + 플러그인 같은 채널)
bunx cursor-talk-to-figma-socket
# Figma → Cursor Talk To Figma MCP → Join (qein2h49)
npm run export:figma-prototype -- qein2h49
```

토큰 발급: [Figma Settings → Personal access tokens](https://www.figma.com/developers/api#access-tokens)
