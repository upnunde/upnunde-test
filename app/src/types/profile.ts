export type ProfileSettingsTabId = "profile" | "settlement" | "account";

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
