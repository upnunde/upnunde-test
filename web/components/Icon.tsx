"use client";

import { useState, useEffect } from "react";
import type { IconName } from "../lib/icon-list";
import styles from "./Icon.module.css";

export interface IconProps {
  name: IconName | string;
  size?: "small" | "medium" | "large" | number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Icon component that loads SVG files and applies design system colors and sizes
 * 
 * @example
 * <Icon name="arrow_back" size="medium" />
 * <Icon name="home" size={32} color="var(--primary)" />
 */
export default function Icon({
  name,
  size = "medium",
  color,
  className,
  style,
  onClick,
}: IconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/icons/${name}.svg`);
        if (!response.ok) {
          throw new Error(`Icon not found: ${name}`);
        }
        const svgText = await response.text();
        setSvgContent(svgText);
        setError(false);
      } catch (err) {
        console.warn(`Failed to load icon: ${name}`, err);
        setError(true);
      }
    };

    loadSvg();
  }, [name]);

  if (error || !svgContent) {
    return null;
  }

  // Parse SVG and replace fill colors with CSS variables
  const processedSvg = svgContent
    .replace(/fill="#[^"]*"/g, (match) => {
      // Replace hardcoded colors with CSS variable
      // Keep "none" as is, replace colors with currentColor
      if (match.includes('fill="none"')) {
        return match;
      }
      return `fill="currentColor"`;
    })
    .replace(/stroke="#[^"]*"/g, (match) => {
      if (match.includes('stroke="none"')) {
        return match;
      }
      return `stroke="currentColor"`;
    });

  // Calculate size
  const sizeValue =
    typeof size === "number"
      ? size
      : size === "small"
      ? 16
      : size === "medium"
      ? 24
      : 32; // large

  // Determine color - use prop color, or default to design system text color
  const iconColor = color || "var(--on-surface-10)";

  // Extract viewBox from SVG
  const viewBoxMatch = processedSvg.match(/viewBox="([^"]*)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      viewBox={viewBox}
      className={`${styles.icon} ${className || ""}`}
      style={{
        color: iconColor,
        ...style,
      }}
      onClick={onClick}
      dangerouslySetInnerHTML={{
        __html: processedSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, ""),
      }}
      aria-label={name}
      role="img"
    />
  );
}
