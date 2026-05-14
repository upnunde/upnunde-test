/**
 * 분석 상황공략 필터 — 내 작품 상황공략 목록과 동일한 id·이름을 사용한다.
 */
import { MY_WORKS_SCENARIOS_MOCK } from "@/lib/myWorksScenariosMock";

export const ANALYTICS_SCENARIO_OPTIONS = MY_WORKS_SCENARIOS_MOCK.map((scenario) => ({
  id: scenario.id,
  label: scenario.title,
}));

export type AnalyticsScenarioId = (typeof MY_WORKS_SCENARIOS_MOCK)[number]["id"];

export const DEFAULT_ANALYTICS_SCENARIO_ID: AnalyticsScenarioId = MY_WORKS_SCENARIOS_MOCK[0]!.id;

export function getAnalyticsScenarioLabel(id: AnalyticsScenarioId): string {
  return ANALYTICS_SCENARIO_OPTIONS.find((o) => o.id === id)?.label ?? "";
}
