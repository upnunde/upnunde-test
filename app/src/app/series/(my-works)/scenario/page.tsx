import { WorksEmptyCreateButton } from "@/components/works/WorksEmptyCreateButton";
import { WORKS_GRID_CELL_MAX_WIDTH_CLASS } from "@/lib/worksArea";

/**
 * 내 작품 — 상황공략 목록 (`/series/scenario`)
 */
export default function WorksScenarioListPage() {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-4">
      <div className={WORKS_GRID_CELL_MAX_WIDTH_CLASS}>
        <WorksEmptyCreateButton hint="새로운 상황공략을 등록하세요" actionLabel="새 상황공략 생성" />
      </div>
    </div>
  );
}
