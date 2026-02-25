# 새 프로젝트 터미널 설정 가이드

현재 프로젝트의 터미널 설정을 새 프로젝트에 동일하게 적용하는 방법입니다.

## 현재 프로젝트 설정

- **Node.js**: v24.11.1
- **npm**: 11.6.2
- **패키지 매니저**: pnpm (프로젝트 루트에 dependency로 포함)
- **프로젝트 구조**: Monorepo (루트 + web 서브프로젝트)

## 새 프로젝트 설정 방법

### 1. Node.js 버전 설정

#### 방법 A: nvm 사용 (권장)
```bash
# nvm이 설치되어 있다면
nvm install 24.11.1
nvm use 24.11.1

# 프로젝트 루트에 .nvmrc 파일 생성
echo "24.11.1" > .nvmrc

# 자동으로 버전 전환되도록 설정
nvm use
```

#### 방법 B: fnm 사용
```bash
# fnm이 설치되어 있다면
fnm install 24.11.1
fnm use 24.11.1

# 프로젝트 루트에 .node-version 파일 생성
echo "24.11.1" > .node-version
```

### 2. 패키지 매니저 설정 (pnpm)

#### pnpm 설치 확인
```bash
# pnpm이 설치되어 있는지 확인
pnpm --version

# 설치되어 있지 않다면 설치
npm install -g pnpm
# 또는
corepack enable
corepack prepare pnpm@latest --activate
```

#### 프로젝트에 pnpm 설정
```bash
# 새 프로젝트 루트에 package.json 생성 (또는 기존 파일 수정)
# package.json에 다음 추가:
{
  "dependencies": {
    "pnpm": "^10.28.2"
  }
}
```

### 3. 환경 변수 설정

#### Shell 설정 파일 확인 (.zshrc 또는 .bashrc)
```bash
# 현재 사용 중인 shell 확인
echo $SHELL

# zsh인 경우
cat ~/.zshrc | grep -E "(PATH|NODE|PNPM|BUN)"

# bash인 경우
cat ~/.bashrc | grep -E "(PATH|NODE|PNPM|BUN)"
```

#### 새 프로젝트에 적용할 환경 변수
현재 프로젝트에서 사용하는 주요 경로:
- `/Users/user/.bun/bin` (Bun)
- `/usr/local/bin` (시스템)
- Node.js 경로 (nvm/fnm 사용 시)

### 4. 프로젝트 구조 설정

#### Monorepo 구조인 경우
```
새프로젝트/
├── package.json          # 루트 package.json
├── pnpm-workspace.yaml   # pnpm workspace 설정 (선택사항)
└── web/                  # 서브프로젝트
    ├── package.json
    └── ...
```

#### pnpm-workspace.yaml 생성 (선택사항)
```yaml
packages:
  - 'web'
  - 'packages/*'
```

### 5. 빠른 설정 스크립트

새 프로젝트에서 다음 명령어들을 순서대로 실행:

```bash
# 1. Node.js 버전 설정
echo "24.11.1" > .nvmrc
nvm use

# 2. pnpm 설치 확인 및 활성화
corepack enable
corepack prepare pnpm@latest --activate

# 3. 루트 package.json에 pnpm 추가
cat > package.json << EOF
{
  "dependencies": {
    "pnpm": "^10.28.2"
  }
}
EOF

# 4. 의존성 설치 (서브프로젝트가 있는 경우)
cd web
pnpm install
```

### 6. 터미널 설정 확인

새 프로젝트에서 다음 명령어로 설정 확인:

```bash
# 버전 확인
node --version    # v24.11.1
npm --version     # 11.6.2
pnpm --version    # 설치된 버전

# PATH 확인
echo $PATH | tr ':' '\n' | grep -E "(node|pnpm|bun)"
```

## 주의사항

1. **Node.js 버전**: 새 프로젝트에서도 동일한 Node.js 버전을 사용하는 것이 좋습니다.
2. **패키지 매니저**: 현재 프로젝트는 pnpm을 사용하므로, 새 프로젝트도 pnpm을 사용하는 것을 권장합니다.
3. **환경 변수**: Shell 설정 파일(.zshrc, .bashrc)은 전역 설정이므로 새 프로젝트에서도 자동으로 적용됩니다.

## 문제 해결

### pnpm이 인식되지 않는 경우
```bash
# corepack 활성화
corepack enable

# pnpm 준비
corepack prepare pnpm@latest --activate

# 또는 npm으로 직접 설치
npm install -g pnpm
```

### Node.js 버전이 다른 경우
```bash
# nvm 사용
nvm install 24.11.1
nvm use 24.11.1

# 또는 fnm 사용
fnm install 24.11.1
fnm use 24.11.1
```
