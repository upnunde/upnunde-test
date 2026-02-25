"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import styles from "./Input.module.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(styles.input, className)}
      {...props}
    />
  );
}
