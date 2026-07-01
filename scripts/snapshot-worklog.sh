#!/usr/bin/env bash
# docs/wip/WORKLOG.md 와 Git 요약을 날짜별로 보관 (7일 보존)
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
WIP_DIR="$ROOT/docs/wip"
HISTORY_DIR="$WIP_DIR/history"
DATE="$(date +%Y-%m-%d)"
TIME="$(date +%H-%M-%S)"
SNAP_DIR="$HISTORY_DIR/$DATE"

mkdir -p "$SNAP_DIR"

if [[ -f "$WIP_DIR/WORKLOG.md" ]]; then
  cp "$WIP_DIR/WORKLOG.md" "$SNAP_DIR/WORKLOG-${TIME}.md"
  cp "$WIP_DIR/WORKLOG.md" "$SNAP_DIR/WORKLOG-latest.md"
else
  echo "warn: $WIP_DIR/WORKLOG.md 없음 — Git 요약만 저장합니다." >&2
fi

{
  echo "# snapshot $DATE $TIME"
  echo ""
  echo "## branch"
  git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "(not a git repo)"
  echo ""
  echo "## status"
  git -C "$ROOT" status --short 2>/dev/null || true
  echo ""
  echo "## diff --stat"
  git -C "$ROOT" diff --stat 2>/dev/null || true
  echo ""
  echo "## recent commits"
  git -C "$ROOT" log -8 --oneline 2>/dev/null || true
} > "$SNAP_DIR/git-summary.txt"

# YYYY-MM-DD 폴더명 기준 7일 초과 삭제
if [[ -d "$HISTORY_DIR" ]]; then
  CUTOFF_EPOCH="$(date -v-7d +%s 2>/dev/null || date -d '7 days ago' +%s)"
  for dir in "$HISTORY_DIR"/*/; do
    [[ -d "$dir" ]] || continue
    base="$(basename "$dir")"
    if [[ ! "$base" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
      continue
    fi
    dir_epoch="$(date -j -f "%Y-%m-%d" "$base" +%s 2>/dev/null || date -d "$base" +%s 2>/dev/null || echo 0)"
    if [[ "$dir_epoch" != "0" && "$dir_epoch" -lt "$CUTOFF_EPOCH" ]]; then
      rm -rf "$dir"
      echo "pruned: $dir"
    fi
  done
fi

echo "worklog snapshot → $SNAP_DIR"
