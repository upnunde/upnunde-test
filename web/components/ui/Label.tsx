"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import styles from "./Label.module.css";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export default function Label({ className, ...props }: LabelProps) {
  return (
    <label className={cn(styles.label, className)} {...props} />
  );
}
