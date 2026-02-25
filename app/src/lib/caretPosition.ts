/**
 * Mirror Div 기법: textarea와 동일한 스타일의 보이지 않는 div를 만들어
 * 커서/선택 시작 위치의 픽셀 좌표를 계산한다.
 */

export interface CaretCoordinates {
  top: number;
  left: number;
  height: number;
}

const TEXT_MEASURE_PROPS = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "fontVariant",
  "letterSpacing",
  "wordSpacing",
  "lineHeight",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "borderTopWidth",
  "borderLeftWidth",
  "boxSizing",
  "width",
  "whiteSpace",
] as const;

export function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number
): CaretCoordinates {
  const style = window.getComputedStyle(element);
  const div = document.createElement("div");

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.top = "0";
  div.style.left = "0";
  div.style.pointerEvents = "none";

  const toKebab = (s: string) =>
    s.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");

  TEXT_MEASURE_PROPS.forEach((prop) => {
    const value = style.getPropertyValue(toKebab(prop));
    if (value) {
      (div.style as unknown as Record<string, string>)[prop] = value;
    }
  });

  // textarea와 동일한 줄바꿈을 위해 width 고정
  const width = element.offsetWidth;
  div.style.width = `${width}px`;
  div.style.minHeight = "0";

  const textBefore = element.value.substring(0, position);
  const textAfter = element.value.substring(position);

  div.textContent = textBefore;

  const span = document.createElement("span");
  span.textContent = textAfter || ".";
  div.appendChild(span);

  document.body.appendChild(div);

  const borderTop = parseInt(style.borderTopWidth, 10) || 0;
  const borderLeft = parseInt(style.borderLeftWidth, 10) || 0;
  const lineHeight = parseInt(style.lineHeight, 10) || parseInt(style.fontSize, 10) || 16;

  const coordinates: CaretCoordinates = {
    top: span.offsetTop + borderTop,
    left: span.offsetLeft + borderLeft,
    height: lineHeight,
  };

  document.body.removeChild(div);
  return coordinates;
}
