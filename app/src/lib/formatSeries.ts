/**
 * 시리즈용 포맷 유틸 (정책 2, 13)
 * - 날짜: YYYY.MM.DD (정책 2)
 * - 조회수: 10,000 미만 천 단위 콤마 / 10,000 이상 만 단위 축약 (정책 13)
 */
export { formatDate as formatSeriesDate } from "@/lib/formatEpisode";
export { formatViews as formatSeriesViewCount } from "@/lib/formatEpisode";
