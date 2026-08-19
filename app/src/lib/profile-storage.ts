import type { CreatorProfile, SettlementProfile, StoredProfileSettings } from "@/types/profile";

const STORAGE_KEY = "upnunde:creator-profile-settings";

export const PROFILE_PEN_NAME_MAX = 50;
export const PROFILE_DESCRIPTION_MAX = 500;

export const DEFAULT_CREATOR_PROFILE: CreatorProfile = {
  loginId: "selly@linefriends.com",
  penName: "사자이빨닦기",
  description: "",
  avatarUrl: null,
};

export const DEFAULT_SETTLEMENT_PROFILE: SettlementProfile = {
  bankName: "라인은행",
  accountNumber: "1231234567890",
  depositor: "브라운",
  supplierBizNumber: "123-45-67890",
  taxInvoiceEmail: "selly@linefriends.com",
};

function maskAccountNumber(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}***`;
}

export function formatMaskedBankAccount(bankName: string, accountNumber: string): string {
  const bank = bankName.trim() || "은행";
  return `${bank} ${maskAccountNumber(accountNumber)}`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function loadProfileSettings(): StoredProfileSettings {
  if (typeof window === "undefined") {
    return {
      public: DEFAULT_CREATOR_PROFILE,
      settlement: DEFAULT_SETTLEMENT_PROFILE,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        public: DEFAULT_CREATOR_PROFILE,
        settlement: DEFAULT_SETTLEMENT_PROFILE,
      };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return {
        public: DEFAULT_CREATOR_PROFILE,
        settlement: DEFAULT_SETTLEMENT_PROFILE,
      };
    }

    const pub = isRecord(parsed.public) ? parsed.public : {};
    const settlement = isRecord(parsed.settlement) ? parsed.settlement : {};

    return {
      public: {
        loginId:
          typeof pub.loginId === "string" ? pub.loginId : DEFAULT_CREATOR_PROFILE.loginId,
        penName: typeof pub.penName === "string" ? pub.penName : DEFAULT_CREATOR_PROFILE.penName,
        description:
          typeof pub.description === "string"
            ? pub.description
            : DEFAULT_CREATOR_PROFILE.description,
        avatarUrl:
          typeof pub.avatarUrl === "string" || pub.avatarUrl === null
            ? (pub.avatarUrl as string | null)
            : DEFAULT_CREATOR_PROFILE.avatarUrl,
      },
      settlement: {
        bankName:
          typeof settlement.bankName === "string"
            ? settlement.bankName
            : DEFAULT_SETTLEMENT_PROFILE.bankName,
        accountNumber:
          typeof settlement.accountNumber === "string"
            ? settlement.accountNumber
            : DEFAULT_SETTLEMENT_PROFILE.accountNumber,
        depositor:
          typeof settlement.depositor === "string"
            ? settlement.depositor
            : DEFAULT_SETTLEMENT_PROFILE.depositor,
        supplierBizNumber:
          typeof settlement.supplierBizNumber === "string"
            ? settlement.supplierBizNumber
            : DEFAULT_SETTLEMENT_PROFILE.supplierBizNumber,
        taxInvoiceEmail:
          typeof settlement.taxInvoiceEmail === "string"
            ? settlement.taxInvoiceEmail
            : DEFAULT_SETTLEMENT_PROFILE.taxInvoiceEmail,
      },
    };
  } catch {
    return {
      public: DEFAULT_CREATOR_PROFILE,
      settlement: DEFAULT_SETTLEMENT_PROFILE,
    };
  }
}

export const PROFILE_UPDATED_EVENT = "profile-settings-updated";

export function saveProfileSettings(settings: StoredProfileSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT));
  } catch {
    /* quota / private mode */
  }
}

export function saveCreatorProfile(publicProfile: CreatorProfile): void {
  const current = loadProfileSettings();
  saveProfileSettings({ ...current, public: publicProfile });
}

export function saveSettlementProfile(settlement: SettlementProfile): void {
  const current = loadProfileSettings();
  saveProfileSettings({ ...current, settlement });
}
