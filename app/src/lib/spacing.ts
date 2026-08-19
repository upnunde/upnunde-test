/**
 * DS Spacing Semantic 호환 레이어.
 * DS 최신본은 `layout`/`overlay`만 노출하므로, 앱에서 쓰던 레거시 그룹을 alias로 유지한다.
 *
 * @see design-system/spacing-tokens
 * @see docs/design-system.md
 */
import {
  space as dsSpace,
  type SemanticSpaceToken,
  type SemanticSpaceGroup,
} from "design-system/spacing-tokens";

const createAlias = (
  name: string,
  className: string,
  role: string,
  source: SemanticSpaceToken,
): SemanticSpaceToken => ({
  name,
  variable: `--space-${name}`,
  className,
  source: source.source,
  px: source.px,
  role,
});

const sectionPadding = createAlias(
  "section-padding",
  "p-5",
  "카드/섹션 본문 인셋 20px",
  dsSpace.overlay.modalPaddingX,
);
const sectionStackGap = createAlias(
  "section-stack-gap",
  "gap-3",
  "카드/섹션 내부 기본 세로 간격 12px",
  dsSpace.layout.pagePaddingX,
);
const sectionStackGapLarge = createAlias(
  "section-stack-gap-large",
  "gap-5",
  "카드/섹션 내부 큰 세로 간격 20px",
  dsSpace.overlay.modalPaddingY,
);
const formGroupGap = createAlias(
  "form-group-gap",
  "gap-4",
  "폼 그룹 기본 세로 간격 16px",
  dsSpace.overlay.modalHeaderPaddingY,
);
const formGroupGapRelaxed = createAlias(
  "form-group-gap-relaxed",
  "gap-5",
  "폼 그룹 여유 세로 간격 20px",
  dsSpace.overlay.modalPaddingY,
);
const controlGroupCompact = createAlias(
  "control-group-compact",
  "gap-1",
  "촘촘한 컨트롤 그룹 간격 4px",
  dsSpace.layout.pagePaddingX,
);
const controlGroupStandard = createAlias(
  "control-group-standard",
  "gap-2",
  "기본 컨트롤 그룹 간격 8px",
  dsSpace.layout.pagePaddingX,
);
const controlGroupResponsive = createAlias(
  "control-group-responsive",
  "gap-1 lg:gap-2",
  "반응형 컨트롤 그룹 간격 4px / 8px",
  dsSpace.layout.pagePaddingX,
);
const listItemGap = createAlias(
  "list-item-gap",
  "gap-3",
  "목록 아이템 간격 12px",
  dsSpace.layout.pagePaddingX,
);
const listItemGapCompact = createAlias(
  "list-item-gap-compact",
  "gap-2",
  "촘촘한 목록 아이템 간격 8px",
  dsSpace.layout.pagePaddingX,
);
const actionGap = createAlias(
  "action-gap",
  "gap-3",
  "액션 버튼 그룹 간격 12px",
  dsSpace.layout.pagePaddingX,
);
const pageStackGap = createAlias(
  "page-stack-gap",
  "gap-3 lg:gap-5",
  "페이지 섹션 간 반응형 간격 12px / 20px",
  dsSpace.layout.pagePaddingX,
);
const sectionGap = createAlias(
  "section-gap",
  "gap-5",
  "단일 섹션 내부 세로 간격 20px",
  dsSpace.overlay.modalPaddingY,
);
const modalHeaderPaddingX = createAlias(
  "modal-header-padding-x",
  dsSpace.overlay.modalPaddingX.className,
  "모달 헤더 좌우 인셋",
  dsSpace.overlay.modalPaddingX,
);
const modalHeaderPaddingTop = {
  name: "modal-header-padding-top",
  variable: "--space-modal-header-padding-top",
  className: "pt-8",
  source: "8_32",
  px: 32,
  role: "모달 헤더 상단 인셋 32px (DS v0.1.42 Dialog Content pt-8)",
} as const;
const modalFooterPaddingX = createAlias(
  "modal-footer-padding-x",
  dsSpace.overlay.modalPaddingX.className,
  "모달 푸터 좌우 인셋",
  dsSpace.overlay.modalPaddingX,
);
const modalBodyStackGap = createAlias(
  "modal-body-stack-gap",
  "gap-4",
  "모달 본문 세로 간격 16px",
  dsSpace.overlay.modalHeaderPaddingY,
);

export const space = {
  layout: {
    ...dsSpace.layout,
    pageStackGap,
    sectionGap,
  },
  overlay: {
    ...dsSpace.overlay,
    modalHeaderPaddingX,
    modalHeaderPaddingTop,
    modalFooterPaddingX,
    modalBodyStackGap,
  },
  section: {
    sectionPadding,
    sectionStackGap,
    sectionStackGapLarge,
  },
  form: {
    formGroupGap,
    formGroupGapRelaxed,
  },
  control: {
    controlGroupCompact,
    controlGroupStandard,
    controlGroupResponsive,
  },
  list: {
    listItemGap,
    listItemGapCompact,
  },
  actions: {
    actionGap,
  },
} as const;

export type { SemanticSpaceToken, SemanticSpaceGroup };
