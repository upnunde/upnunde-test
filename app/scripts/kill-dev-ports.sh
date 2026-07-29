#!/usr/bin/env sh
# 이 프로젝트 Next.js dev 서버 포트(3002) 점유 프로세스만 종료
# (다른 로컬 서비스의 3000·3001 등은 건드리지 않음)
lsof -ti:3002 2>/dev/null | xargs kill -9 2>/dev/null || true
