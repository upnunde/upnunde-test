"use client";

import * as React from "react";

type DropdownMenuOpenContextValue = {
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
};

export const DropdownMenuOpenContext =
  React.createContext<DropdownMenuOpenContextValue | null>(null);

export function useDropdownMenuOpenContext() {
  return React.useContext(DropdownMenuOpenContext);
}
