# ---------- Build stage (CRA) ----------
    FROM node:20-bullseye AS build
    WORKDIR /app
    
    # 의존성 캐시 최적화
    COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
    RUN \
      if [ -f package-lock.json ]; then npm ci; \
      elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
      elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
      else npm i; fi
    
    # 소스 복사 & 빌드
    COPY . .
    # CRA는 기본 빌드 명령이 build, 산출물 폴더는 build/
    ARG REACT_APP_API_BASE=/api
    ENV REACT_APP_API_BASE=${REACT_APP_API_BASE}
    RUN npm run build
    
    # ---------- Runtime stage (Nginx) ----------
    FROM nginx:1.27-alpine
    # SPA 라우팅/캐시 설정
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    # CRA 빌드 결과 복사 (build/)
    COPY --from=build /app/build /usr/share/nginx/html
    
    EXPOSE 80
    HEALTHCHECK --interval=30s --timeout=3s --retries=5 CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
    