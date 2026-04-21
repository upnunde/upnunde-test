# 저장소 구조 및 아키텍처

## 모노레포 개요

루트는 **여러 하위 프로젝트**를 한 저장소에 둔 구조입니다. 각각 **별도 의존성·실행 방법**을 가질 수 있으므로, 작업 시 **어느 디렉터리인지**를 먼저 구분합니다.

| 경로 | 역할 |
|------|------|
| **`app/`** | **메인 제품 UI (Next.js App Router).** 시리즈·에피소드·에디터·리소스·알림 등. 루트 `npm run dev`는 보통 `app`으로 이동해 실행한다. |
| **`web/`** | MCP/플러그인 상태 시각화 등 **대시보드·데모 성격**의 Next.js 앱. 제품 에디터와는 별도 실행 단위. |
| **`prototype/`** | `ink-editor.html` 등 **정적 프로토타입**. 빠른 UI 실험용. |
| **`cursor-talk-to-figma-mcp/`** (하위 패키지) | **TalkToFigma MCP 서버** + **Figma 플러그인**. Cursor와 Figma 연동. |
| **`ink-editor/`** | 인크 에디터 실험용 **별도 Next.js 앱** (루트와 독립 실행). |
| **`web/lib/ink-editor/`** | `web` 쪽에서 쓰는 인크 에디터 **타입·로직·목 데이터** 모듈. |

## 기술 스택 (앱 제품 기준)

- **프레임워크:** Next.js (React), TypeScript  
- **상태:** Zustand (`useEditorStore` 등)  
- **스타일:** Tailwind CSS, Radix UI 기반 컴포넌트 (`Popover`, `Dialog` 등)  
- **에디터 UX:** `@dnd-kit` 등으로 블록 순서 변경 지원  

## 데이터 흐름 원칙

- **스크립트의 단일 소스:** 편집 중 상태는 주로 **스토어의 `blocks` 배열**이다.
- **직렬화:** `scriptParser` / `scriptSerializer` 등으로 텍스트 형식과 동기화할 때는 **한 방향의 규칙**을 유지하고, 타입(`BlockType`)과 맞춘다.
- **세션 보조:** 예: 시리즈 페르소나는 `sessionStorage`로 복원하는 등, **민감하지 않은 UI 상태**에 한정한다.

## 확장 시 유의사항

- 새 기능을 넣을 때 **`app/` vs `web/`** 를 혼동하지 않는다. 스토리 제작 UX는 `app/`이 기준이다.
- Figma/MCP 변경은 **디자인·개발 워크플로**에만 영향을 주고, 스크립트 데이터 모델과 **느슨하게 결합**한다.

## 개발 서버 운영 정책 (Next.js dev)

### 기본값: webpack (Turbopack 비활성)

`app/package.json`의 `dev` 스크립트는 **`next dev --webpack`** 으로 고정한다.

**이유:** 이 저장소는 모노레포지만 **루트에 `next` 의존성이 없는** 구조다(루트 `package.json` + `pnpm-lock.yaml`만 존재, `next`는 `app/node_modules`에만 설치됨). Next 16의 Turbopack은 부모 디렉터리의 lockfile을 **워크스페이스 루트로 자동 인식**해 거기서 `next` 패키지를 탐색하다가 `Next.js package not found`로 무한 panic을 일으킨다. `next.config.ts`의 `turbopack.root` 옵션만으로는 이 자동 탐지를 완전히 막지 못한다.

panic이 누적되면 HMR이 무한 재시도되며 dev 오버레이가 mount/unmount를 반복해 **마우스 hover 깜빡임 + 클릭 무반응** 같은 화면 증상으로 나타난다(컴포넌트 CSS 문제처럼 보이지만 원인은 빌드 파이프라인이다).

### 명령어 정리

| 명령 | 용도 |
|------|------|
| `npm run dev` (루트 또는 `app/`) | **표준 개발 서버.** webpack 모드. 항상 이걸 사용한다. |
| `npm run dev:turbo` (`app/` 한정) | **임시 실험용.** 위 모노레포 이슈가 해결됐는지 확인하거나, Turbopack 전용 기능을 시험할 때만. 일반 개발에 쓰지 않는다. |
| `npm run clean` (루트 또는 `app/`) | `app/.next` 캐시 삭제. dev 서버가 이상 동작하면 가장 먼저 시도한다. |
| `npm run build` (`app/`) | 프로덕션 빌드. dev와 무관하게 정상 동작한다. |

### 같은 증상이 재발했을 때 점검 순서

1. **dev 서버 로그**에 `Turbopack Error` / `FATAL` / `Next.js package not found`가 반복 출력되는지 확인한다. → 있으면 webpack 모드인지 다시 확인.
2. webpack 모드인데도 이상하면 `npm run clean` 후 dev 재시작.
3. 화면 hover 깜빡임 / 클릭 무반응을 **컴포넌트 CSS 문제로 오인하지 말 것.** 먼저 dev 서버 로그를 본다.
4. 다른 디렉터리에서 `next dev`가 동시에 실행 중이지 않은지 `pgrep -fl "next dev"`로 확인한다(같은 포트/캐시 충돌 가능).

### 향후 Turbopack 복귀 조건

다음 중 하나가 충족되면 `dev` 스크립트를 `next dev --turbopack`으로 되돌려도 된다.

- 루트의 `pnpm-lock.yaml` / `package.json` 의존성 흔적을 정리해 워크스페이스 자동 탐지가 `app/`에서 멈추도록 만든 경우
- Next.js가 `turbopack.root` 옵션을 우선 적용하도록 동작이 바뀐 경우(릴리즈 노트 확인)
