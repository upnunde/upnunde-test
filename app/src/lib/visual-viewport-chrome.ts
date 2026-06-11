/** 키보드·브라우저 하단 크롬 구분 임계값(px) */
export const KEYBOARD_OPEN_THRESHOLD_PX = 80;

export type VisualViewportChromeState = {
  top: number;
  bottom: number;
  height: number;
  offsetTop: number;
};

export type VisualViewportChromeSnapshot = VisualViewportChromeState & {
  keyboardOpen: boolean;
  /** visualViewport 실측 하단 inset — 키보드·브라우저 하단 크롬 포함 */
  liveBottom: number;
};

const DEFAULT_CHROME_STATE: VisualViewportChromeState = {
  top: 0,
  bottom: 0,
  height: 0,
  offsetTop: 0,
};

/**
 * visualViewport 기준 브라우저 상·하단 크롬 inset.
 * 키보드가 열리면 마지막 크롬 값을 유지해 shell padding이 추가로 눌리지 않게 한다.
 */
export function readVisualViewportChromeInsets(
  lastChrome: VisualViewportChromeState = DEFAULT_CHROME_STATE,
): VisualViewportChromeSnapshot {
  const vv = window.visualViewport;
  if (!vv) {
    return { ...lastChrome, keyboardOpen: false, liveBottom: 0 };
  }

  const rawBottom = measureVisualViewportBottomInset(vv);
  const rawTop = Math.max(0, Math.round(vv.offsetTop));
  const rawHeight =
    Math.max(0, Math.round(vv.height)) || Math.max(0, Math.round(window.innerHeight));
  const rawOffsetTop = Math.max(0, Math.round(vv.offsetTop));
  const keyboardOpen = rawBottom >= KEYBOARD_OPEN_THRESHOLD_PX;

  if (keyboardOpen) {
    return { ...lastChrome, keyboardOpen: true, liveBottom: rawBottom };
  }

  return {
    top: rawTop,
    bottom: rawBottom,
    height: rawHeight,
    offsetTop: rawOffsetTop,
    keyboardOpen: false,
    liveBottom: rawBottom,
  };
}

/** visualViewport 기준 하단 inset — 브라우저별 innerHeight·clientHeight 차이 흡수 */
export function measureVisualViewportBottomInset(vv: VisualViewport): number {
  const layoutHeight = Math.max(
    window.innerHeight,
    document.documentElement.clientHeight,
  );
  const fromLayout = layoutHeight - vv.offsetTop - vv.height;
  const fromInner = window.innerHeight - vv.offsetTop - vv.height;
  return Math.max(0, Math.round(Math.max(fromLayout, fromInner)));
}
