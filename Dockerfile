# 루월당 — Node + Chromium
#
# Railway 가 기본 빌더(Railpack)로 바뀌면서 nixpacks.toml 을 무시한다.
# Dockerfile 이 있으면 그걸 최우선으로 쓰므로, 여기서 크롬을 확실히 깔아준다.

FROM node:20-slim

# 크롬 + 한글 폰트
#  - chromium        : 서버에서 PDF 를 만들 때 쓴다 (puppeteer-core 가 이걸 실행)
#  - fonts-noto-cjk  : 한글이 네모(두부)로 깨지지 않게
#  - fonts-nanum     : 명조체 대체용
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      fonts-noto-cjk \
      fonts-nanum \
      ca-certificates \
      fontconfig \
    && fc-cache -f \
    && rm -rf /var/lib/apt/lists/*

# puppeteer-core 가 이 크롬을 쓰도록 알려준다
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

# ⚠️ 이걸 안 하면 컨테이너가 UTC 로 돌아서 신청 시각이 9시간 밀려 보인다
ENV TZ=Asia/Seoul

WORKDIR /app

# 의존성 먼저 (코드가 바뀌어도 이 층은 캐시된다 → 배포가 빨라진다)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 나머지 코드
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
