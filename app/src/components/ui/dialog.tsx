"use client";

import * as React from "react";
import { DialogContent as DsDialogContent } from "design-system/ui/dialog";

export {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogDescriptionStatic,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTitleStatic,
  DialogTrigger,
} from "design-system/ui/dialog";

type DialogContentProps = Omit<
  React.ComponentProps<typeof DsDialogContent>,
  "showCloseButton"
>;

/** 앱 Dialog에는 우상단 Close(X)를 두지 않는다. 닫기는 푸터 액션만 사용한다. */
export function DialogContent(props: DialogContentProps) {
  return <DsDialogContent showCloseButton={false} {...props} />;
}
