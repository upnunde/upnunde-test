## Cursor Talk to Figma MCP Monorepo

이 리포지토리는 **Cursor ↔ Figma MCP 서버**, **Figma 플러그인**, 그리고 **Next.js 기반 웹 프론트엔드**를 함께 담고 있는 모노레포입니다.

기존 `cursor-talk-to-figma-mcp` 패키지의 기능은 그대로 유지하면서, 상단에 Next.js 앱(`web/`)과 HTML 프로토타입(`prototype/`)을 추가한 구조입니다.

---

### 프로젝트 구조

- **`cursor-talk-to-figma-mcp/`**  
  - Node.js 기반 MCP 서버 패키지 (npm 레지스트리 배포용, 로컬 개발은 pnpm 사용)
  - 주요 구성:
    - `src/talk_to_figma_mcp/` – Figma 연동용 TypeScript MCP 서버
    - `src/cursor_mcp_plugin/` – Cursor와 통신하는 Figma 플러그인
    - `readme.md` – MCP 서버 및 플러그인 사용/개발 가이드 (상세)

- **`web/`**  
  - **Next.js + TypeScript** 기반의 웹 프론트엔드
  - MCP 서버/플러그인 사용 상태를 시각화하고, 추후 데모/도구를 통합하기 위한 대시보드 역할
  - 주요 파일:
    - `package.json` – Next.js/React 의존성 및 스크립트
    - `next.config.mjs` – Next.js 설정
    - `tsconfig.json` – TypeScript 설정
    - `app/layout.tsx` – 공통 레이아웃
    - `app/page.tsx` – 간단한 대시보드 홈 화면
    - `app/globals.css` – 전역 스타일

- **`prototype/`**
  - `ink-editor.html` – 리노벨 스튜디오용 Scene Editor HTML 프로토타입  
    (독립 실행 가능한 정적 프로토타입, 웹 앱과는 분리된 실험용 UI)

---

### MCP 서버 실행 (백엔드)

- **1. 의존성 및 MCP 설치**

```bash
cd cursor-talk-to-figma-mcp
pnpm run setup
```

- **2. 로컬 MCP 서버 실행 예시**

개발용(TypeScript 직접 실행):

```bash
cd cursor-talk-to-figma-mcp
pnpm dev
```

빌드 후 실행(Node 번들 사용):

```bash
cd cursor-talk-to-figma-mcp
pnpm build
pnpm start
```

- **3. Cursor에서 MCP 서버 등록**

자세한 설정 예시는 `cursor-talk-to-figma-mcp/readme.md`의  
**“Manual Setup and Installation” → “MCP Server: Integration with Cursor”** 섹션을 참고해  
`~/.cursor/mcp.json` 에 `TalkToFigma` 서버를 추가합니다.

- **4. Figma 플러그인 설치 및 연결**

Figma 플러그인 설치/연결 방법도 하위 패키지의 `readme.md`에 자세히 정리되어 있습니다.  
간단히 요약하면:

1. Figma 플러그인을 커뮤니티에서 설치하거나 로컬 개발 플러그인으로 링크
2. MCP 도구를 통해 Figma 문서/노드/주석/프로토타입 등을 제어

---

### Next.js 프론트엔드 실행 (`web/`)

Next.js 기반 대시보드는 MCP/플러그인과는 완전히 분리된 **독립 실행** 프론트엔드입니다.

1. 의존성 설치

```bash
cd web
pnpm install
```

2. 개발 서버 실행

```bash
pnpm dev
```

3. 브라우저에서 접속

```text
http://localhost:3000
```

홈 화면에서:
- 이 모노레포가 무엇을 하는지 간단히 요약해 주고,
- 향후 MCP 상태 패널, 로그 뷰어, Figma/ink-editor 연동 UI 등을 추가하기 위한 베이스로 동작합니다.

---

### ink-editor 프로토타입 사용 (`prototype/`)

`prototype/ink-editor.html` 은 Next.js나 MCP 서버와는 별개로 동작하는 정적 HTML 프로토타입입니다.

로컬에서 단순히 더블 클릭하거나, 정적 서버로 서빙해 열 수 있습니다.

```bash
# 예: 간단한 정적 서버로 열기 (Node 설치 가정)
cd prototype
pnpm dlx serve .
```

브라우저에서 `http://localhost:3000/ink-editor.html` (포트는 사용하는 서버에 따라 상이)로 접근하면,
리노벨 스튜디오용 Scene Editor UI를 확인할 수 있습니다.

---

### 아키텍처 개요

- **Cursor / IDE**
  - MCP 프로토콜을 통해 `TalkToFigma` MCP 서버와 통신

- **MCP 서버 (`cursor-talk-to-figma-mcp/src/talk_to_figma_mcp/`)**
  - Figma 문서/노드/주석/컴포넌트 등 각종 API를 추상화한 MCP 도구 제공

- **Figma 플러그인 (`cursor-talk-to-figma-mcp/src/cursor_mcp_plugin/`)**
  - Figma 캔버스/노드에 직접 접근하여, MCP 명령을 실제 디자인 변경으로 반영

- **Next.js 웹 앱 (`web/`)**
  - 현재는 소개/대시보드 역할의 기본 페이지만 포함
  - 향후:
    - MCP 서버/플러그인 상태 모니터링
    - 명령 로그/에러 로그 뷰어
    - 간단한 툴 실행 UI
    - `ink-editor.html`과의 연동(iframe 또는 기능 포팅) 등으로 확장 가능

---

### 추가 참고

- MCP 서버 및 Figma 플러그인의 **상세 사용법/도구 목록/베스트 프랙티스**는  
  `cursor-talk-to-figma-mcp/readme.md`에 매우 잘 정리되어 있으니, 해당 파일을 1차 레퍼런스로 사용하는 것을 권장합니다.

