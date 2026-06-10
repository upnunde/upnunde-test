/** 키보드·브라우저 하단 크롬 구분 임계값(px) */
export const KEYBOARD_OPEN_THRESHOLD_PX = 80;

export type VisualViewportChromeState = {
  top: number;
  bottom: number;
};

export type VisualViewportChromeSnapshot = VisualViewportChromeState & {
  keyboardOpen: boolean;
};

/**
 * visualViewport 기준 브라우저 상·하단 크롬 inset.
 * 키보드가 열리면 마지막 크롬 값을 유지해 shell padding이 추가로 눌리지 않게 한다.
 */
export function readVisualViewportChromeInsets(
  lastChrome: VisualViewportChromeState,
): VisualViewportChromeSnapshot {
  const vv = window.visualViewport;
  if (!vv) {
    return { ...lastChrome, keyboardOpen: false };
  }

  const rawBottom = Math.max(0, Math.round(window.innerHeight - vv.offsetTop - vv.height));
  const rawTop = Math.max(0, Math.round(vv.offsetTop));
  const keyboardOpen = rawBottom >= KEYBOARD_OPEN_THRESHOLD_PX;

  if (keyboardOpen) {
    return { top: lastChrome.top, bottom: lastChrome.bottom, keyboardOpen: true };
  }

  return { top: rawTop, bottom: rawBottom, keyboardOpen: false };
}
