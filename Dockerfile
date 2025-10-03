FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY .gitignore .gitignore
COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY . .
RUN echo "$(date)" > /app/static/version.txt
RUN pnpm build:with-screenshots



FROM node:22-alpine AS runner
WORKDIR /app

RUN echo '{"type": "module"}' > package.json
COPY --from=builder --chown=node:node /app/build/ .

EXPOSE 3000
CMD ["node", "index.js"]
