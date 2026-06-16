/**
 * 실시간 조회수 표기 (정책 5, Global Policy 수치 표기)
 * - 10,000 미만: 천 단위 구분 기호 (예: 1, 9,999)
 * - 10,000 이상: 소수점 둘째 자리까지 만 단위 (예: 13,500 → 1.35만, 13,999 → 1.39만)
 */
export function formatViews(views: number): string {
  if (views < 10_000) {
    return views.toLocaleString("ko-KR");
  }
  const man = Math.floor(views / 100) / 100;
  return `${man}만`;
}

/**
 * 날짜 포맷 YYYY.MM.DD (정책 12, 24시간 이상일 때 사용)
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

/**
 * 날짜·시간 표기 (Global Policy)
 * - 30초 미만: "방금 전"
 * - 1분 미만: "SS초 전"
 * - 60분 미만: "MM분 전"
 * - 24시간 미만: "HH시간 전"
 * - 24시간 이상: "YYYY.MM.DD"
 */
export function formatDateOrRelative(dateStr: string): string {
  if (!dateStr || dateStr === "-") return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 30) return "방금 전";
  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return formatDate(dateStr);
}

/**
 * 기간 만료 시간 표기 (Global Policy)
 * - 30일 이상: "YYYY.MM.DD 까지"
 * - 1일 이상 30일 미만: "DD일 남음"
 * - 1시간 이상 24시간 미만: "HH시간 남음"
 * - 1분 이상 1시간 미만: "MM분 남음"
 * - 1분 미만 또는 만료: "기간 만료"
 */
/** 예약 공개 시각 요약 (모달·스낵바) — 예: 6월 20일 오후 8:00 */
export function formatScheduledPublishSummary(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** 예약 공개 시각 짧은 표기 (목록 개시일 컬럼) — 예: 2025.06.19 15:00 */
export function formatScheduledPublishAtParts(isoString: string): { date: string; time: string } {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return { date: isoString, time: "" };
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return { date: formatDate(isoString), time: `${hours}:${minutes}` };
}

export function formatScheduledPublishAtShort(isoString: string): string {
  const { date, time } = formatScheduledPublishAtParts(isoString);
  return time ? `${date} ${time}` : date;
}

export function formatExpiration(expiresAt: Date | string): string {
  const end = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  if (Number.isNaN(end.getTime())) return "기간 만료";
  const now = Date.now();
  const diffMs = end.getTime() - now;
  if (diffMs < 60 * 1000) return "기간 만료";

  const diffMin = Math.floor(diffMs / (60 * 1000));
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay >= 30) {
    const y = end.getFullYear();
    const m = String(end.getMonth() + 1).padStart(2, "0");
    const d = String(end.getDate()).padStart(2, "0");
    return `${y}.${m}.${d} 까지`;
  }
  if (diffDay >= 1) return `${diffDay}일 남음`;
  if (diffHour >= 1) return `${diffHour}시간 남음`;
  if (diffMin >= 1) return `${diffMin}분 남음`;
  return "기간 만료";
}
