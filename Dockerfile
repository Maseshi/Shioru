# syntax=docker/dockerfile:1

ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine AS base
RUN apk --update --no-cache add \
    git openjdk11-jre python3 ffmpeg build-base \
    jpeg-dev cairo-dev giflib-dev pango-dev
WORKDIR /usr/src/app
EXPOSE 3000 4000 9000

FROM base AS serve
RUN npm install --global firebase-tools
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
COPY . .
CMD npm run serve

FROM base AS production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
COPY . .
CMD npm start
