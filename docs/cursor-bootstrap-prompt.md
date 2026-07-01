# Cursor 프로젝트 부트스트랩 프롬프트

새 저장소를 연 뒤 **Cursor Agent 채팅에 아래 블록 전체를 붙여넣기** 하세요.  
`{{...}}` 만 새 프로젝트에 맞게 바꿉니다.

---

## 붙여넣기용 프롬프트

```
이 저장소에 Cursor 작업 환경을 upnunde-test와 동일한 패턴으로 부트스트랩해줘.
아래 항목을 실제로 파일 생성·수정까지 완료하고, 마지막에 생성 목록과 사용법을 요약해줘.

## 프로젝트 변수 (여기만 수정)

- 프로젝트명: {{프로젝트명}}
- 메인 앱 경로: {{app/ 또는 src/ 등}}
- 개발 서버: {{예: cd app && npm run dev, 포트 3000}}
- 미리보기 URL(있으면): {{예: http://localhost:3000}}
- 스택: {{예: Next.js App Router + TypeScript + Zustand + Tailwind + Radix}}
- 실험/레거시 폴더(작업 제외): {{예: web/, prototype/ — 없으면 "없음"}}
- UI 언어: 한국어 (답변·UI 문자열 모두)

## 1. Cursor Rules (.cursor/rules/)

다음 파일을 생성하거나, 이미 있으면 동일 정책으로 맞춰줘.

### project-overview.mdc (alwaysApply: true)
- 저장소 구조, 메인 작업 디렉터리, 스택 요약
- 개발 서버 명령·포트
- 답변·UI는 한국어
- 세부 규칙은 다른 rule 파일로 링크
- WORKLOG 안내 한 줄 포함

### worklog.mdc (alwaysApply: false)
- docs/wip/WORKLOG.md — 현재 작업 맥락 (Git 추적)
- docs/wip/history/ — npm run worklog:snapshot 로컬 스냅샷 (7일 보존)
- 커밋·세션 마무리·「이어서」 요청 시 WORKLOG 갱신 규칙
- 이어서 작업 시 WORKLOG 먼저 읽기

### commit-convention.mdc (alwaysApply: false)
- Conventional Commits + 한국어 한 줄 요약
- type: feat|fix|refactor|style|chore|docs
- 커밋은 사용자가 요청할 때만

### (선택) 프로젝트 전용 rule
- {{에디터/UI/라우트 등 이 프로젝트만의 규칙이 있으면 파일 추가}}

## 2. 작업 일지 (WORKLOG)

생성:
- docs/wip/WORKLOG.md — 템플릿(오늘 한 일 / 다음 할 일 / 막힌 것 / 브랜치·경로)
- scripts/snapshot-worklog.sh — WORKLOG + git status/diff/log 스냅샷, 7일 이전 history/ 삭제
- package.json scripts에 "worklog:snapshot": "sh scripts/snapshot-worklog.sh"
- .gitignore에 docs/wip/history/

스크립트 실행 테스트까지 해줘.

## 3. 에이전트 행동 규칙 (User Rules 수준 — 가능하면 Cursor User Rules에도 반영 권장)

- 답변은 항상 한국어
- 커밋·push는 명시적 요청 시에만
- git config 변경·force push·--no-verify 금지
- 최소 범위 수정, 기존 컨벤션 따르기
- 커밋 전 WORKLOG 갱신 제안 (사용자가 커밋 요청 시)

## 4. project-overview.mdc에 넣을 WORKLOG 한 줄

- 작업 일지: docs/wip/WORKLOG.md · .cursor/rules/worklog.mdc · npm run worklog:snapshot

## 5. 하지 말 것

- .env·시크릿 커밋
- web/.next 등 빌드 산출물 커밋
- 프로젝트와 무관한 대량 리팩터

## 6. 완료 후 보고

- 생성·수정한 파일 목록
- npm run worklog:snapshot 결과
- 다음 세션에서 「@docs/wip/WORKLOG.md 이어서」 사용법 한 줄
```

---

## upnunde-test에서 그대로 복사해도 되는 것

| 복사 원본 | 새 프로젝트 위치 | 비고 |
|-----------|------------------|------|
| `.cursor/rules/worklog.mdc` | 동일 | 그대로 사용 가능 |
| `.cursor/rules/commit-convention.mdc` | 동일 | scope만 프로젝트에 맞게 예시 수정 |
| `scripts/snapshot-worklog.sh` | 동일 | 그대로 |
| `docs/wip/WORKLOG.md` | 동일 | 템플릿 |
| `docs/cursor-bootstrap-prompt.md` | 동일 | 이 파일 |

`project-overview.mdc`, `editor-patterns.mdc`, `persona.mdc` 등은 **upnunde 전용**이므로 새 프로젝트에서는 변수에 맞게 새로 작성.

---

## User Rules에 넣을 최소 문장 (Cursor Settings → Rules)

```
- 답변·UI 문자열은 한국어.
- git commit/push는 사용자가 요청할 때만.
- 작업 마무리·커밋 요청 시 docs/wip/WORKLOG.md 갱신.
- 이어서 작업 시 @docs/wip/WORKLOG.md 먼저 읽기.
```

---

## 매일 습관 (자동 아님)

```bash
# 세션 끝 또는 커밋 전
npm run worklog:snapshot
```

자정 자동 실행은 cron/launchd 별도 설정 필요.
