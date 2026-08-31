import packageJson from "../../package.json";

export const APP_VERSION = packageJson.version;

/** 목업 단계 — 실제로는 스토어·배포 버전과 비교한다. */
export const APP_LATEST_VERSION = APP_VERSION;

export function isAppUpToDate(): boolean {
  return APP_VERSION === APP_LATEST_VERSION;
}
