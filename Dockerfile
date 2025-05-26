# syntax=docker/dockerfile:experimental

ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine AS base

LABEL org.opencontainers.image.authors="dermhioasw123@gmail.com"
LABEL description="Assistants within your Discord server will help make your server a better place to live."

# Install system dependencies in one layer
RUN apk --update --no-cache add \
    git openjdk11-jre python3 ffmpeg build-base \
    jpeg-dev cairo-dev giflib-dev pango-dev

WORKDIR /usr/src/app

EXPOSE 3000 4000 9000

# --- Development/Serve Stage ---
FROM base AS serve

# Copy only package files first for better caching
COPY package*.json ./

RUN npm install --global firebase-tools
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# Copy the rest of the source code
COPY . .

# Mount at runtime
CMD ["npm", "run", "serve"]

# --- Production Stage ---
FROM base AS production

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .

# Mount at runtime
CMD ["npm", "start"]
