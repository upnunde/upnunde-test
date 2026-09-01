"use client";

import { ICONS, Icon } from "@/lib/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClientMounted } from "@/hooks/useClientMounted";
import { Button } from "design-system/ui/button";
import { controlSizeToIconGlyph } from "design-system/component-size-tokens";

export type AnalyticsScopeDropdownOption = {
  id: string;
  label: string;
};

function ScopeDropdownTriggerLabel({ label }: { label: string }) {
  return (
    <>
      {label}
      <Icon
        icon={ICONS.chevronDown}
        size={controlSizeToIconGlyph("default")}
        position="inline-end"
      />
    </>
  );
}

/** 분석 필터 — 작품·캐릭터·회차 등 단일 선택 드롭다운 (DS Button showcase: outline + chevron) */
export function AnalyticsScopeDropdown({
  value,
  onChange,
  options,
  ariaLabelPrefix,
  placeholder = "선택",
  align = "start",
}: {
  value: string;
  onChange: (id: string) => void;
  options: readonly AnalyticsScopeDropdownOption[];
  ariaLabelPrefix: string;
  placeholder?: string;
  align?: "start" | "end";
}) {
  const mounted = useClientMounted();
  const label = options.find((o) => o.id === value)?.label ?? placeholder;
  const ariaLabel = `${ariaLabelPrefix} — ${label}`;

  // Base UI Menu의 useId가 Next/React hydration 레이스에서 서버·클라이언트 id가 어긋날 수 있다.
  // 마운트 전에는 동일 트리거 셸만 SSR하고, 이후에 Menu를 붙인다(Tabs 래퍼와 동일 패턴).
  if (!mounted) {
    return (
      <Button variant="outline" aria-label={ariaLabel} title={label} type="button">
        <ScopeDropdownTriggerLabel label={label} />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label={ariaLabel} title={label}>
          <ScopeDropdownTriggerLabel label={label} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[220px]">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {options.map((opt) => (
              <DropdownMenuRadioItem key={opt.id} value={opt.id}>
                {opt.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
