# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /usr/src/app

# Native modules are compiled here and only their runtime output is copied into
# the final image.
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

FROM node:${NODE_VERSION} AS production

LABEL org.opencontainers.image.authors="dermhioasw123@gmail.com" \
      org.opencontainers.image.title="Shioru" \
      org.opencontainers.image.description="A Discord assistant that helps make servers a better place to live."

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /usr/src/app

# ffmpeg is required by the music commands. Python is used by yt-dlp.
RUN apk add --no-cache ffmpeg python3 && \
    mkdir -p /usr/src/app/logs && \
    chown node:node /usr/src/app/logs

COPY --from=dependencies --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node source ./source

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"]

# Run Node directly so container signals are delivered to the shard manager.
CMD ["node", "source/shard.js"]
