"use client";

import * as React from "react";
import Icon from "../Icon";
import { cn } from "../../lib/utils";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function Checkbox({
  className,
  checked,
  onCheckedChange,
  onChange,
  ...props
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
    onChange?.(e);
  };

  return (
    <label className={cn(styles.checkboxWrapper, className)}>
      <input
        type="checkbox"
        className={styles.checkboxInput}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      <span className={cn(styles.checkbox, checked && styles.checked)}>
        {checked && <Icon name="checked_regular" size={14} />}
      </span>
    </label>
  );
}
