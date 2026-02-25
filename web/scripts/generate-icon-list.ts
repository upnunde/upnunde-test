/**
 * Script to generate a list of all available icons
 * Run with: npx tsx scripts/generate-icon-list.ts
 */

import fs from "fs";
import path from "path";

const iconsDir = path.join(process.cwd(), "public", "icons");
const outputFile = path.join(process.cwd(), "lib", "icon-list.ts");

function generateIconList() {
  try {
    const files = fs.readdirSync(iconsDir);
    const svgFiles = files.filter((file) => file.endsWith(".svg"));
    const iconNames = svgFiles.map((file) => file.replace(".svg", ""));

    const content = `/**
 * Auto-generated list of available icons
 * Generated from /public/icons/
 * DO NOT EDIT MANUALLY
 */

export const AVAILABLE_ICONS = [
${iconNames.map((name) => `  "${name}"`).join(",\n")}
] as const;

export type IconName = typeof AVAILABLE_ICONS[number];
`;

    fs.writeFileSync(outputFile, content, "utf-8");
    console.log(`✅ Generated icon list with ${iconNames.length} icons`);
    console.log(`📝 Output: ${outputFile}`);
  } catch (error) {
    console.error("❌ Error generating icon list:", error);
    process.exit(1);
  }
}

generateIconList();
