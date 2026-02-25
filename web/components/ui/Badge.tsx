"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import styles from "./Badge.module.css";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export default function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
