import { ICONS } from "@/lib/icons";
import { Badge } from "design-system/ui/badge";
import type { SeriesStatus } from "@/types/series";

/** 상세 시트·카드와 동일 톤의 상태 뱃지 */
export function WorksStatusBadge({ status }: { status: SeriesStatus }) {
  if (status === "PRIVATE") {
    return (
      <Badge variant="secondary" status="destructive" size="md" shape="square">
        비공개
      </Badge>
    );
  }
  if (status === "DRAFT") {
    return (
      <Badge variant="default" size="md" shape="square">
        작성중
      </Badge>
    );
  }
  if (status === "BANNED") {
    return (
      <Badge variant="default" status="destructive" size="md" shape="square">
        <ICONS.alertCircle className="size-4 shrink-0" aria-hidden />
        <span className="truncate">이용 금지</span>
      </Badge>
    );
  }
  return null;
}
