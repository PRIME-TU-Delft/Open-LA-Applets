# Installing turbo on Alpine currently fails for some fucking reason
# FROM node:16-alpine AS builder
FROM node:16 AS builder
# RUN apk update
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=web --docker



FROM node:16 AS installer
# RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN echo "$(date)" > /app/apps/web/static/version.txt
RUN yarn turbo run build --filter=web...



FROM node:16-alpine AS runner
WORKDIR /app
RUN chown node:node /app
USER node

COPY --from=installer --chown=node:node /app/apps/web/package.json .
COPY --from=installer --chown=node:node /app/apps/web/build/ .

EXPOSE 3000
CMD ["node", "index.js"]
