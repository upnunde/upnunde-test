#!/usr/bin/env bash
# CI·클린 환경에서 design-system(GitHub git dep) 설치
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" || true
git config --global url."https://github.com/".insteadOf "git@github.com:" || true

cd "$ROOT"
npm ci

echo "ci-install OK — design-system: $(node -p "require('./node_modules/design-system/package.json').version")"
