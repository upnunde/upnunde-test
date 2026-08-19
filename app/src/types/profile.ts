export type ProfileSettingsTabId = "profile" | "settlement" | "account";

export function parseProfileSettingsTab(
  tab: string | string[] | undefined,
): ProfileSettingsTabId {
  const value = Array.isArray(tab) ? tab[0] : tab;
  if (value === "settlement" || value === "account") return value;
  return "profile";
}

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
