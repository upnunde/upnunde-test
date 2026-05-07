# n8n 로컬 운영 가이드

## 빠른 시작

```bash
cp n8n/.env.example n8n/.env
npm run n8n:up
```

- 접속: `http://localhost:5678`
- 기본 계정: `.env`의 `N8N_BASIC_AUTH_USER`, `N8N_BASIC_AUTH_PASSWORD`

## 종료/재시작

```bash
npm run n8n:down
npm run n8n:restart
```

## 로그 확인

```bash
npm run n8n:logs
```

## 워크플로 템플릿 Import

1. n8n 접속
2. Workflows -> Import from File
3. `n8n/workflows/role-handoff-checklist.json` 선택
4. Slack 노드/채널 ID/크리덴셜 설정 후 활성화

## 참고

- 데이터 디렉터리: `n8n/data`
- 워크플로 템플릿: `n8n/workflows`
