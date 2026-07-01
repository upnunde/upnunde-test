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
import { Button } from "design-system/ui/button";
import { controlSizeToIconGlyph } from "design-system/component-size-tokens";

export type AnalyticsScopeDropdownOption = {
  id: string;
  label: string;
};

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
  const label = options.find((o) => o.id === value)?.label ?? placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={`${ariaLabelPrefix} — ${label}`}
          title={label}
        >
          {label}
          <Icon
            icon={ICONS.chevronDown}
            size={controlSizeToIconGlyph("default")}
            position="inline-end"
          />
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
