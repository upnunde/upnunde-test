/**
 * Icon utility functions for SVG icons
 * All icons are located in /public/icons/
 */

import type { IconName } from "./icon-list";

/**
 * Get the path to an icon by name
 * @param iconName - Name of the icon file (without .svg extension)
 * @returns Path to the icon
 */
export function getIconPath(iconName: string): string {
  return `/icons/${iconName}.svg`;
}

/**
 * Icon component props
 */
export interface IconProps {
  name: IconName | string; // Allow string for flexibility, but prefer IconName for type safety
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * React component to render an SVG icon
 * Usage: <Icon name="arrow_back" width={24} height={24} />
 */
export function Icon({
  name,
  width = 24,
  height = 24,
  className,
  style,
  onClick,
}: IconProps) {
  return (
    <img
      src={getIconPath(name)}
      alt={name}
      width={width}
      height={height}
      className={className}
      style={style}
      onClick={onClick}
      onError={(e) => {
        console.warn(`Icon not found: ${name}`);
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

/**
 * Get list of all available icon names
 * This can be used for autocomplete or icon picker components
 */
export async function getAvailableIcons(): Promise<string[]> {
  return [];
}
