FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.app.json tsconfig.json tsconfig.spec.json nx.json project.json ./
COPY src ./src
RUN yarn build api

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup --system api && \
    adduser --system -G api api

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist/api ./api
COPY --from=builder /app/src/prisma ./src/prisma

RUN chown -R api:api /app

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER api

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

ARG VERSION
ARG BUILD_DATE
ARG GIT_COMMIT

LABEL org.opencontainers.image.source="https://github.com/yurisldk/node-express-realworld-example-app" \
      org.opencontainers.image.url="https://github.com/yurisldk/node-express-realworld-example-app" \
      org.opencontainers.image.documentation="https://github.com/yurisldk/node-express-realworld-example-app#readme" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${GIT_COMMIT}" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.title="realworld-api"
