#!/usr/bin/env sh
# Next.js dev 서버가 쓰는 포트(3000·3001) 점유 프로세스 종료
lsof -ti:3000,3001 2>/dev/null | xargs kill -9 2>/dev/null || true
