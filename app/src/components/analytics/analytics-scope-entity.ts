import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";

/** 범위 칩별 캐시·시드용 엔티티 키 */
export function analyticsScopeEntityKey(
  scope: AnalyticsScopeCategoryId,
  seriesId: string,
  characterId: string,
  scenarioId: string,
): string {
  switch (scope) {
    case "series":
      return seriesId;
    case "character":
      return characterId;
    case "scenario":
      return scenarioId;
    default:
      return "noseries";
  }
}
