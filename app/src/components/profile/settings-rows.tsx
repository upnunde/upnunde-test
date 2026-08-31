"use client";

import type { ReactNode } from "react";
import { Icon, ICONS, type LucideIcon } from "@/lib/icons";
import { Switch } from "@/components/ui/switch";
import { cn } from "design-system/utils";

/** 설정 목록 행 — 상하 16px 패딩으로 높이를 만들고 좌우는 20px 인셋 */
const SETTINGS_ROW_CLASS = "flex w-full items-center gap-4 px-5 py-4 text-left";

const SETTINGS_ROW_INTERACTIVE_CLASS =
  "cursor-pointer transition-colors duration-short ease-standard hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40";

/** 행 묶음 — 구분선 없이 행 높이로만 리듬을 만든다. */
export function SettingsList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex w-full flex-col", className)}>{children}</div>;
}

function SettingsRowLabel({ icon, label }: { icon?: LucideIcon; label: string }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-4">
      {icon ? <Icon icon={icon} size="2xl" className="shrink-0 text-foreground" /> : null}
      <span className="truncate text-body1_500 text-foreground">{label}</span>
    </span>
  );
}

/** 하위 화면으로 이동하는 행 */
export function SettingsLinkRow({
  icon,
  label,
  onClick,
}: {
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(SETTINGS_ROW_CLASS, SETTINGS_ROW_INTERACTIVE_CLASS)}
    >
      <SettingsRowLabel icon={icon} label={label} />
      <Icon icon={ICONS.chevronRight} size="xl" className="shrink-0 text-foreground-placeholder" />
    </button>
  );
}

/** 값·컨트롤을 우측에 두는 행 — 버전 정보, 화면 스타일 등 */
export function SettingsValueRow({
  icon,
  label,
  value,
  children,
}: {
  icon?: LucideIcon;
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div className={SETTINGS_ROW_CLASS}>
      <SettingsRowLabel icon={icon} label={label} />
      <span className="flex shrink-0 items-center gap-2">
        {value ? <span className="text-body3_400 text-foreground-muted">{value}</span> : null}
        {children}
      </span>
    </div>
  );
}

/** 스위치 행 — 알림 설정 */
export function SettingsSwitchRow({
  icon,
  label,
  checked,
  onCheckedChange,
}: {
  icon?: LucideIcon;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className={cn(SETTINGS_ROW_CLASS, "cursor-pointer")}>
      <SettingsRowLabel icon={icon} label={label} />
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        className="shrink-0"
      />
    </label>
  );
}

/** 로그아웃 등 액션 행 — 되돌릴 수 있는 동작이라 경고색 대신 보조 텍스트 톤 */
export function SettingsActionRow({
  icon,
  label,
  onClick,
}: {
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        SETTINGS_ROW_CLASS,
        "text-foreground-muted",
        SETTINGS_ROW_INTERACTIVE_CLASS,
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-4">
        {icon ? <Icon icon={icon} size="2xl" className="shrink-0 text-current" /> : null}
        <span className="truncate text-body1_500">{label}</span>
      </span>
    </button>
  );
}
