# syntax=docker/dockerfile:experimental

# --- Build Stage (compile native addons) ---
FROM oven/bun:alpine AS build

RUN apk --update --no-cache add \
    python3 build-base \
    jpeg-dev cairo-dev giflib-dev pango-dev

WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# --- Development/Serve Stage ---
FROM oven/bun:alpine AS serve

LABEL org.opencontainers.image.authors="dermhioasw123@gmail.com"
LABEL description="Assistants within your Discord server will help make your server a better place to live."

RUN apk --update --no-cache add \
    git openjdk11-jre python3 ffmpeg build-base \
    jpeg-dev cairo-dev giflib-dev pango-dev

WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000 4000 9000

CMD ["bun", "run", "serve"]

# --- Production Stage ---
FROM oven/bun:alpine AS production

LABEL org.opencontainers.image.authors="dermhioasw123@gmail.com"
LABEL description="Assistants within your Discord server will help make your server a better place to live."

# Only runtime dependencies (no build-base, no git, no jdk)
RUN apk --update --no-cache add \
    python3 ffmpeg \
    libjpeg-turbo cairo giflib pango

WORKDIR /usr/src/app

# Copy pre-built node_modules from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY source ./source

EXPOSE 3000

CMD ["bun", "run", "start"]
