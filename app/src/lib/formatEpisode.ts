/**
 * 실시간 조회수 표기 (정책 5)
 * - 10,000 미만: 천 단위 콤마 (예: 8,999)
 * - 10,000 이상: 소수점 첫째 자리까지 내림 후 '만' 단위 (예: 13,500 → 1.3만, 13,999 → 1.3만)
 */
export function formatViews(views: number): string {
  if (views < 10_000) {
    return views.toLocaleString("ko-KR");
  }
  const man = Math.floor(views / 1000) / 10;
  return `${man}만`;
}

/**
 * 날짜 포맷 YYYY.MM.DD (정책 12)
 */
export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "-") return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
