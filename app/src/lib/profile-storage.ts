import type { CreatorProfile, SettlementProfile, StoredProfileSettings } from "@/types/profile";
import { DUMMY_DEFAULT_PROFILE_AVATAR } from "@/lib/dummy-profile-images";

const STORAGE_KEY = "upnunde:creator-profile-settings";

export const PROFILE_PEN_NAME_MAX = 50;
export const PROFILE_DESCRIPTION_MAX = 500;

export const DEFAULT_CREATOR_PROFILE: CreatorProfile = {
  loginId: "selly@gmail.com",
  penName: "사자이빨닦기",
  description: "",
  avatarUrl: DUMMY_DEFAULT_PROFILE_AVATAR,
};

/** blob·빈 값은 더미 프로필로 — SSR·새로고침 후에도 헤더·마이페이지 일치 */
export function resolveProfileAvatarUrl(url: string | null | undefined): string {
  if (!url || url.startsWith("blob:")) return DUMMY_DEFAULT_PROFILE_AVATAR;
  return url;
}

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
          typeof pub.loginId === "string" && pub.loginId !== "selly@linefriends.com"
            ? pub.loginId
            : DEFAULT_CREATOR_PROFILE.loginId,
        penName: typeof pub.penName === "string" ? pub.penName : DEFAULT_CREATOR_PROFILE.penName,
        description:
          typeof pub.description === "string"
            ? pub.description
            : DEFAULT_CREATOR_PROFILE.description,
        avatarUrl: resolveProfileAvatarUrl(
          typeof pub.avatarUrl === "string" || pub.avatarUrl === null
            ? (pub.avatarUrl as string | null)
            : DEFAULT_CREATOR_PROFILE.avatarUrl,
        ),
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

/** 마이페이지 편집 중 아바타 미리보기 — 저장 전 헤더와 동기화 */
export const PROFILE_AVATAR_PREVIEW_EVENT = "profile-avatar-preview";

export function dispatchProfileAvatarPreview(avatarUrl: string | null): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PROFILE_AVATAR_PREVIEW_EVENT, { detail: avatarUrl }));
}

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
