FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Install Chromium dependencies for Puppeteer on Debian
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY .gitignore .gitignore
COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY . .
RUN echo "$(date)" > /app/static/version.txt
RUN pnpm build:with-screenshots



FROM node:22-bookworm-slim AS runner
WORKDIR /app

RUN echo '{"type": "module"}' > package.json
COPY --from=builder --chown=node:node /app/build/ .

EXPOSE 3000
CMD ["node", "index.js"]
