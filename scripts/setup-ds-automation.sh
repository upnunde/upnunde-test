#!/usr/bin/env bash
# DS 자동 동기화 1회 설정 — upnunde-test push + (선택) DS notify 워크플로
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> 1. GitHub CLI workflow 권한 갱신 (브라우저 인증 필요할 수 있음)"
gh auth refresh -h github.com -s workflow,repo || {
  echo "workflow 권한 갱신 실패. 터미널에서 직접 실행하세요:"
  echo "  gh auth refresh -h github.com -s workflow,repo"
  exit 1
}

echo "==> 2. upnunde-test main push"
git push origin main

echo "==> 3. ds-sync 워크플로 수동 실행 (선택)"
gh workflow run ds-sync.yml -R upnunde/upnunde-test 2>/dev/null || true

echo ""
echo "==> 4. DS 저장소 (Renovel-Studio-DS) — Secret 1회 설정"
echo "  DS repo Secret: UPNUNDE_TEST_DISPATCH_PAT"
echo "     (upnunde-test repository_dispatch 권한 fine-grained PAT)"
echo "  설정: gh secret set UPNUNDE_TEST_DISPATCH_PAT -R upnunde/Renovel-Studio-DS"
echo "  (notify 워크플로는 DS main에 이미 포함됨 — docs/RELEASE.md 참고)"
echo "  c) upnunde-test repo Secret (DS 비공개 시만): DS_REPO_TOKEN"
echo ""
echo "완료. DS Release publish 시 ds-sync PR이 자동 생성됩니다."
