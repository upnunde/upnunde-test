/**
 * Icon 컴포넌트 사용 예시
 * 이 파일은 참고용이며 실제로 import하지 않습니다.
 */

import Icon from "./Icon";

export default function IconExample() {
  return (
    <>
      {/* 기본 사용 (medium 사이즈, 디자인 시스템 텍스트 색상) */}
      <Icon name="arrow_back" />

      {/* 사이즈 지정: small 16px, medium 24px, large 32px, size={40} 커스텀 */}
      <Icon name="home" size="small" />
      <Icon name="home" size="medium" />
      <Icon name="home" size="large" />
      <Icon name="home" size={40} />

      {/* 색상 지정 */}
      <Icon name="search" color="var(--primary)" />
      <Icon name="heart" color="var(--error)" />
      <Icon name="star" color="var(--on-surface-20)" />

      {/* 클릭 이벤트 */}
      <Icon name="close" onClick={() => console.log("closed")} />

      {/* 스타일 커스터마이징 */}
      <Icon
        name="menu"
        size="large"
        color="var(--primary)"
        className="my-custom-class"
        style={{ marginRight: "8px" }}
      />
    </>
  );
}

// 실제 사용 예시
export function HeaderExample() {
  return (
    <header>
      <Icon name="arrow_back" size="medium" onClick={() => history.back()} />
      <h1>제목</h1>
      <Icon name="menu" size="medium" />
    </header>
  );
}
