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
