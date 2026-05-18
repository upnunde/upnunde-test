#!/bin/sh
set -e

HOST="renovel.localhost"
LINE="127.0.0.1 ${HOST}"

if grep -q "${HOST}" /etc/hosts 2>/dev/null; then
  echo "이미 설정되어 있습니다: ${LINE}"
  exit 0
fi

echo "${LINE} 을(를) /etc/hosts 에 추가합니다."
echo "${LINE}" | sudo tee -a /etc/hosts >/dev/null
echo "완료. Cursor 미리보기 또는 브라우저에서 http://${HOST}:3000 으로 접속하세요."
