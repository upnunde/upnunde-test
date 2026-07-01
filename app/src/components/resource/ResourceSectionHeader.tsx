"use client";

import React, { useId } from "react";
import { FieldLabel } from "@/components/ui/field-label";
import { PAGE_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

const SECTION_HEADER_CLASS = cn(
  "w-full h-fit py-3 border-b border-divider",
  PAGE_CONTENT_PAD_X_CLASS,
);

export function ResourceSectionHeader({
  title,
  description,
  headerAction,
}: {
  title: string;
  description: string;
  headerAction?: React.ReactNode;
}) {
  const baseId = useId();
  const descriptionId = `${baseId}-desc`;

  const label = (
    <FieldLabel size="default" description={description} descriptionId={descriptionId}>
      {title}
    </FieldLabel>
  );

  if (headerAction) {
    return (
      <div
        className={cn(SECTION_HEADER_CLASS, "flex items-center justify-between gap-3")}
      >
        <div className="min-w-0 flex-1">{label}</div>
        {headerAction}
      </div>
    );
  }

  return (
    <div
      className={cn(SECTION_HEADER_CLASS, "flex flex-col justify-center items-start")}
    >
      {label}
    </div>
  );
}
