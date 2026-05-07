# PM Autopilot 브리지 사용법

채팅에서 나온 자연어 요청을 n8n PM 오케스트레이터로 전달할 때 사용하는 로컬 브리지입니다.

## 1) 1회 설정

```bash
cp .env.pm.example .env.pm
```

`.env.pm`의 값을 채웁니다.

```text
N8N_PM_WEBHOOK_URL=https://upnunde.app.n8n.cloud/webhook/pm-autopilot
```

## 2) 요청 전달

```bash
npm run pm:req -- "정산 내역 필터 가독성 개선"
```

실행 시 n8n에서 반환한 `request_id`, 단계 라우팅 정보가 출력됩니다.

## 3) 동작 방식

- 입력 문구 -> `feature_name`/`pm_note`로 변환
- PM 오케스트레이터 Webhook 호출
- planner/uiux/fe 라우팅 결과를 콘솔 JSON으로 반환

## 4) 참고

- 이 브리지는 "요청 전달 자동화" 도구입니다.
- 실제 구현/수정은 채팅 에이전트 또는 각 단계 에이전트가 수행합니다.
