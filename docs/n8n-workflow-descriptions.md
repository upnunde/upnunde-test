# n8n 워크플로 Description 표준 문구

아래 문구를 n8n Cloud의 각 워크플로 `Description`에 그대로 붙여 사용합니다.

## 공통 원칙

- 문구 형식: `목적 / 입력 / 출력 / 실행 시점 / 실패 시 대응`
- 상태값 표준: `ready_for_planner`, `ready_for_uiux`, `ready_for_fe`, `done`
- 전환키 표준: `planner_to_uiux`, `uiux_to_fe`, `fe_to_done`

---

## [LIVE] Handoff Form UI

**설명 문구(복붙용)**

기획/UIUX/FE 역할 전환을 폼 기반으로 수동 실행하는 라이브 워크플로입니다.  
입력값(`feature_name`, `transition_key`, 담당자)을 받아 다음 단계/다음 담당자를 계산하고 결과 화면을 반환합니다.  
운영자가 브라우저에서 직접 사용하며, API 키 없이도 역할 핸드오프를 표준 포맷으로 기록할 수 있습니다.  
실패 시 입력값(전환키/담당자) 오타를 우선 확인하고 재실행합니다.

---

## [LIVE] Handoff Selector API

**설명 문구(복붙용)**

역할 핸드오프를 API(Webhook)로 호출하기 위한 라이브 워크플로입니다.  
JSON 입력(`feature_name`, `transition_key`, 담당자)을 받아 단계 전환 결과(`from_stage`, `to_stage`, `next_owner`)를 JSON으로 반환합니다.  
외부 도구(노션/슬랙/스크립트)에서 자동 전환 처리 시 사용합니다.  
실패 시 요청 바디 형식과 `transition_key` 유효값을 점검합니다.

---

## [ARCHIVE] Role Handoff Checklist (Template)

**설명 문구(복붙용)**

역할 핸드오프 표준 구조를 빠르게 복제하기 위한 템플릿 워크플로입니다.  
운영용이 아닌 참조/복제 목적이며 기본적으로 비활성 상태를 유지합니다.  
새 자동화 실험은 이 템플릿을 복제한 뒤 수정하고 검증 완료 시 `[LIVE]`로 승격합니다.

---

## [ARCHIVE] Handoff: Planner -> UIUX

**설명 문구(복붙용)**

기획 완료 후 UIUX 단계로 넘길 때 사용하는 수동 전환 템플릿입니다.  
`feature_name` 중심으로 핸드오프 메시지를 생성하며, 필요 시 Slack 알림 노드를 활성화해 전달합니다.  
운영 기본은 비활성이며 테스트/참조 용도로 유지합니다.

---

## [ARCHIVE] Handoff: UIUX -> FE

**설명 문구(복붙용)**

UIUX 확정 후 FE 구현 단계로 넘길 때 사용하는 수동 전환 템플릿입니다.  
핸드오프 메시지를 표준 포맷으로 생성해 누락 없이 전달하는 것이 목적입니다.  
운영 기본은 비활성이며 테스트/참조 용도로 유지합니다.

---

## [ARCHIVE] Handoff: FE -> Done

**설명 문구(복붙용)**

FE 구현 완료를 `done` 상태로 마무리할 때 사용하는 수동 전환 템플릿입니다.  
최종 단계 전환 기록을 남기고 종료 상태를 명확히 하기 위한 용도입니다.  
운영 기본은 비활성이며 테스트/참조 용도로 유지합니다.

---

## [ARCHIVE] Handoff: Single Selector

**설명 문구(복붙용)**

하나의 워크플로에서 전환키(`planner_to_uiux`, `uiux_to_fe`, `fe_to_done`)를 바꿔 수동 전환을 처리하는 통합 템플릿입니다.  
운영 단순화를 위한 대체안으로 보관하며, 실제 상시 운영은 `[LIVE]` 워크플로를 우선 사용합니다.
