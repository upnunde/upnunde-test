/**
 * 디자인 토큰 자동 치환 규칙 — docs/design-system.md Part 1 §3 와 1:1 대응.
 * 수동 판단 없이 이 모듈의 매핑만 적용한다.
 */

/** @type {readonly number[]} */
export const MY_SPACING_PX = [
  1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 80,
];

/** Tailwind spacing scale n → my-* suffix (스냅 포함, 80px 초과 n 미포함) */
export const TAILWIND_N_TO_MY_SUFFIX = {
  px: "my-1",
  0.5: "my-2",
  1: "my-4",
  1.5: "my-8",
  2: "my-8",
  2.5: "my-8",
  3: "my-12",
  3.5: "my-16",
  4: "my-16",
  5: "my-20",
  6: "my-24",
  7: "my-28",
  8: "my-32",
  9: "my-36",
  10: "my-40",
  11: "my-44",
  12: "my-48",
  14: "my-56",
  16: "my-64",
  18: "my-72",
  20: "my-80",
};

/** 임의 px 스냅 (문서 고정 예외) */
export const ARBITRARY_PX_SNAP = {
  6: 8,
  10: 8,
  14: 16,
};

export const SPACING_UTILITY_PREFIXES = [
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "ps",
  "pe",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "ms",
  "me",
  "gap",
  "gap-x",
  "gap-y",
  "space-x",
  "space-y",
  "h",
  "w",
  "size",
  "min-h",
  "min-w",
  "max-h",
  "max-w",
];

/** 컨트롤 높이 — 일반 스페이싱 치환보다 우선 */
export const CONTROL_SIZE_OVERRIDES = {
  "h-8": "h-my-32",
  "min-h-8": "min-h-my-32",
  "size-8": "size-my-32",
  "h-9": "h-my-36",
  "size-9": "size-my-36",
  "h-10": "h-my-36",
  "size-10": "size-my-36",
  "h-12": "h-[42px]",
  "min-h-12": "min-h-[42px]",
  "min-w-16": "min-w-my-64",
  "min-w-20": "min-w-my-80",
};

export const SHADOW_REPLACEMENTS = {
  "shadow-[0px_1px_2px_1px_rgba(0,0,0,0.16)]": "shadow-elevation-10",
  "shadow-[0px_2px_4px_2px_rgba(0,0,0,0.16)]": "shadow-elevation-20",
  "shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)]": "shadow-elevation-50",
  "shadow-sm": "shadow-elevation-10",
  "shadow-md": "shadow-elevation-30",
  "shadow-lg": "shadow-elevation-40",
  "shadow-xl": "shadow-elevation-50",
};

/** 비인터랙티브 surface radius (인터랙티브 컴포넌트 파일은 스크립트에서 제외 가능) */
export const SURFACE_RADIUS_REPLACEMENTS = {
  "rounded-2xl": "rounded-[4px]",
  "rounded-xl": "rounded-[4px]",
  "rounded-t-2xl": "rounded-t-[4px]",
  "rounded-t-xl": "rounded-t-[4px]",
  "rounded-b-2xl": "rounded-b-[4px]",
  "rounded-b-xl": "rounded-b-[4px]",
};

const TYPO_SIZE_TO_FAMILY = {
  "text-xs": "caption1",
  "text-sm": "body3",
  "text-base": "body1",
  "text-lg": "heading5",
  "text-xl": "heading4",
  "text-2xl": "heading2",
  "text-3xl": "heading1",
  "text-[15px]": "body2",
  "text-[13px]": "body4",
  "text-[11px]": "caption2",
};

const FONT_WEIGHT_TO_SUFFIX = {
  "font-bold": "700",
  "font-semibold": "700",
  "font-medium": "500",
  "font-normal": "400",
  "font-light": "400",
};

const DEFAULT_WEIGHT_BY_FAMILY = {
  caption1: "400",
  caption2: "400",
  body1: "400",
  body2: "400",
  body3: "400",
  body4: "400",
  heading1: "700",
  heading2: "700",
  heading3: "700",
  heading4: "700",
  heading5: "700",
};

/**
 * @param {number} px
 * @returns {number | null}
 */
export function snapPxToMyToken(px) {
  if (px > 80) return null;
  if (ARBITRARY_PX_SNAP[px] != null) return ARBITRARY_PX_SNAP[px];
  if (MY_SPACING_PX.includes(px)) return px;

  let best = MY_SPACING_PX[0];
  let bestDist = Math.abs(px - best);
  for (const t of MY_SPACING_PX) {
    const dist = Math.abs(px - t);
    if (dist < bestDist || (dist === bestDist && t < best)) {
      best = t;
      bestDist = dist;
    }
  }
  return best;
}

/**
 * @param {string} pxSuffix e.g. "my-16"
 */
export function mySuffixFromPx(px) {
  return `my-${px}`;
}

function splitVariantUtility(part) {
  const idx = part.lastIndexOf(":");
  if (idx === -1) return { variant: "", utility: part };
  return { variant: part.slice(0, idx + 1), utility: part.slice(idx + 1) };
}

/**
 * @param {string} classList space-separated utilities on one element
 * @returns {string}
 */
export function inferTypoTokenForClassList(classList) {
  const parts = classList.split(/\s+/).filter(Boolean);
  let sizePart = null;
  let weightUtility = null;
  const kept = [];

  for (const part of parts) {
    const { variant, utility } = splitVariantUtility(part);
    if (TYPO_SIZE_TO_FAMILY[utility]) {
      sizePart = { variant, utility };
      continue;
    }
    if (FONT_WEIGHT_TO_SUFFIX[utility]) {
      weightUtility = utility;
      continue;
    }
    if (/^leading-/.test(utility)) continue;
    if (/^text-(body|heading|caption)/.test(utility)) {
      kept.push(part);
      continue;
    }
    kept.push(part);
  }

  if (
    !sizePart ||
    kept.some((p) =>
      /^text-(body|heading|caption)/.test(splitVariantUtility(p).utility),
    )
  ) {
    return classList;
  }

  const family = TYPO_SIZE_TO_FAMILY[sizePart.utility];
  const weight = weightUtility
    ? FONT_WEIGHT_TO_SUFFIX[weightUtility]
    : DEFAULT_WEIGHT_BY_FAMILY[family];

  const token = `${sizePart.variant}text-${family}_${weight}`;
  return [...kept, token].join(" ");
}
