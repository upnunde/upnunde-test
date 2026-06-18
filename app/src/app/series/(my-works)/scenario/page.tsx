import { WorksEmptyCreateButton } from "@/components/works/WorksEmptyCreateButton";
import { WORKS_LIST_CREATE_SLOT_CLASS, WORKS_LIST_GRID_CLASS } from "@/lib/worksArea";

/**
 * 내 작품 — 상황공략 목록 (`/series/scenario`)
 */
export default function WorksScenarioListPage() {
  return (
    <div className={WORKS_LIST_GRID_CLASS}>
      <div className={WORKS_LIST_CREATE_SLOT_CLASS}>
        <WorksEmptyCreateButton hint="새로운 상황공략을 등록하세요" actionLabel="새 상황공략 생성" />
      </div>
    </div>
  );
}
