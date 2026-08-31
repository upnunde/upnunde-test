/** 설정 화면 — `home`은 목록, 나머지는 하위 상세 화면 */
export type ProfileSettingsTabId =
  | "home"
  | "profile"
  | "settlement"
  | "notifications"
  | "privacy";

export function parseProfileSettingsTab(
  tab: string | string[] | undefined,
): ProfileSettingsTabId {
  const value = Array.isArray(tab) ? tab[0] : tab;
  if (value === "settlement" || value === "notifications" || value === "privacy") return value;
  // `account`는 회원정보로 통합됨 — 기존 딥링크 호환
  if (value === "profile" || value === "account") return "profile";
  return "home";
}

export const PROFILE_SETTINGS_TAB_TITLES: Record<ProfileSettingsTabId, string> = {
  home: "설정",
  profile: "회원정보",
  settlement: "계좌정보",
  notifications: "알림 설정",
  privacy: "개인정보처리방침",
};

export type CreatorProfile = {
  loginId: string;
  penName: string;
  description: string;
  avatarUrl: string | null;
};

export type SettlementProfile = {
  bankName: string;
  accountNumber: string;
  depositor: string;
  supplierBizNumber: string;
  taxInvoiceEmail: string;
};

export type StoredProfileSettings = {
  public: CreatorProfile;
  settlement: SettlementProfile;
};
