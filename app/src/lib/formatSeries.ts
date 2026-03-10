/**
 * 시리즈용 포맷 유틸 (정책 2, 13, Global Policy 날짜·시간 표기)
 * - 날짜: 24h 미만 상대 시간 / 24h 이상 YYYY.MM.DD
 * - 조회수: 10,000 미만 천 단위 콤마 / 10,000 이상 소수점 둘째 자리 만 단위
 */
export { formatDate as formatSeriesDate } from "@/lib/formatEpisode";
export { formatDateOrRelative as formatSeriesDateOrRelative } from "@/lib/formatEpisode";
export { formatViews as formatSeriesViewCount } from "@/lib/formatEpisode";
