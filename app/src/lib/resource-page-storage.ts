const RESOURCE_PAGE_STORAGE_PREFIX = "resource-mgmt-";
const RESOURCE_PAGE_STORAGE_RESET_KEY = "resource-mgmt-storage-reset";
/** 더미 에셋·페이지 저장소 일괄 초기화 버전 — `DUMMY_ASSET_CACHE_VERSION`과 맞춘다 */
export const RESOURCE_PAGE_STORAGE_RESET_VERSION = "20250611";

/** 리소스 관리 페이지 localStorage(배너 닫기 등) 초기화 */
export function clearResourceManagementPageStorage(): void {
  if (typeof window === "undefined") return;

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(RESOURCE_PAGE_STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}

/** 버전이 바뀐 뒤 최초 1회만 리소스 관리 페이지 저장소 초기화 */
export function resetResourceManagementPageStorageIfNeeded(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(RESOURCE_PAGE_STORAGE_RESET_KEY) === RESOURCE_PAGE_STORAGE_RESET_VERSION) {
    return;
  }
  clearResourceManagementPageStorage();
  localStorage.setItem(RESOURCE_PAGE_STORAGE_RESET_KEY, RESOURCE_PAGE_STORAGE_RESET_VERSION);
}
