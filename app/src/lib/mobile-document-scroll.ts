import { MOBILE_MEDIA_QUERY } from "@/lib/mobile-viewport";

export function isMobileDocumentScrollMode() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

export function getDocumentScrollTop() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}
