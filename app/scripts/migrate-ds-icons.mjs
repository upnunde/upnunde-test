#!/usr/bin/env node
/**
 * lucide-react 직접 import → design-system ICONS 레지스트리로 일괄 치환
 *
 *   node scripts/migrate-ds-icons.mjs          # dry-run
 *   node scripts/migrate-ds-icons.mjs --write
 */
import { readdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const srcRoot = join(appRoot, "src")

/** Lucide export name → ICONS key */
const LUCIDE_TO_ICONS_KEY = {
  AlertCircle: "alertCircle",
  AlertTriangle: "warning",
  ArrowUp: "arrowUp",
  BarChart3: "barChart3",
  Bell: "bell",
  Bold: "formatBold",
  BookOpen: "bookOpen",
  Calendar: "calendar",
  CalendarDays: "calendarDays",
  Check: "check",
  CheckIcon: "check",
  ChevronDown: "chevronDown",
  ChevronLeft: "chevronLeft",
  ChevronRight: "chevronRight",
  ChevronRightIcon: "chevronRight",
  ChevronUp: "chevronUp",
  Circle: "circle",
  CircleAlert: "error",
  CircleCheck: "checkCircle",
  CircleIcon: "circle",
  Clapperboard: "clapperboard",
  Download: "download",
  Eye: "eye",
  EyeOff: "eyeOff",
  FileText: "fileText",
  Film: "film",
  GripVertical: "gripVertical",
  Heading: "heading",
  Heart: "heart",
  History: "history",
  Home: "home",
  Image: "image",
  ImagePlus: "imagePlus",
  Info: "info",
  Italic: "formatItalic",
  Layers: "layers",
  LibraryBig: "libraryBig",
  ListChecks: "listChecks",
  Loader2: "loader",
  Mail: "mail",
  Menu: "menu",
  MessageCircle: "messageCircle",
  MessageSquareText: "messageSquareText",
  Minus: "minus",
  Moon: "moon",
  MoreVertical: "moreVertical",
  Music: "music",
  Pause: "pause",
  Pencil: "pencil",
  Play: "play",
  Plus: "plus",
  Receipt: "receipt",
  RefreshCw: "refreshCw",
  RotateCcw: "rotateCcw",
  Search: "search",
  Settings2: "settings2",
  Sliders: "sliders",
  Smartphone: "smartphone",
  Sparkles: "sparkles",
  Square: "square",
  Sun: "sun",
  Trash2: "trash2",
  TriangleAlert: "warning",
  Type: "type",
  Underline: "formatUnderlined",
  User: "user",
  UserRoundCog: "userRoundCog",
  X: "close",
}

const write = process.argv.includes("--write")

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue
      files.push(...(await walk(full)))
    } else if (/\.(tsx?)$/.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

function migrateContent(content) {
  const importRe = /import\s*\{([^}]+)\}\s*from\s*["']lucide-react["'];?/g
  const match = importRe.exec(content)
  if (!match) return { content, changed: false }

  const imported = match[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const mappings = []
  for (const item of imported) {
    const typeMatch = item.match(/^type\s+(\w+)$/)
    if (typeMatch) {
      if (typeMatch[1] === "LucideIcon") {
        mappings.push({ lucide: "LucideIcon", key: null, isType: true })
      }
      continue
    }
    const lucideName = item.replace(/^type\s+/, "")
    const key = LUCIDE_TO_ICONS_KEY[lucideName]
    if (!key) {
      throw new Error(`Unknown lucide icon: ${lucideName}`)
    }
    mappings.push({ lucide: lucideName, key, isType: false })
  }

  let next = content.replace(importRe, () => {
    const needsLucideIcon = mappings.some((m) => m.isType)
    if (needsLucideIcon) {
      return `import { ICONS, type LucideIcon } from "@/lib/icons";`
    }
    return `import { ICONS } from "@/lib/icons";`
  })

  for (const { lucide, key, isType } of mappings) {
    if (isType || !key) continue
    const re = new RegExp(`\\b${lucide}\\b`, "g")
    next = next.replace(re, `ICONS.${key}`)
  }

  return { content: next, changed: next !== content }
}

async function main() {
  const files = await walk(srcRoot)
  let count = 0

  for (const file of files) {
    if (file.endsWith("lib/icons.ts")) continue
    const rel = relative(appRoot, file)
    const original = await readFile(file, "utf8")
    try {
      const { content, changed } = migrateContent(original)
      if (!changed) continue
      count++
      if (write) {
        await writeFile(file, content, "utf8")
        console.log(`updated: ${rel}`)
      } else {
        console.log(`would update: ${rel}`)
      }
    } catch (err) {
      console.error(`${rel}: ${err.message}`)
      process.exitCode = 1
    }
  }

  if (count === 0) {
    console.log(write ? "migrate-ds-icons — 변경 없음" : "migrate-ds-icons — dry-run: 변경 없음")
  } else {
    console.log(
      write
        ? `migrate-ds-icons — ${count}개 파일 수정됨`
        : `migrate-ds-icons — dry-run: ${count}개 파일 대상`,
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
