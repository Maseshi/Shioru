# syntax=docker/dockerfile:experimental

# --- Build Stage (compile native addons) ---
FROM node:alpine AS build

RUN apk --update --no-cache add \
    python3 build-base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# --- Development/Serve Stage ---
FROM node:alpine AS serve

LABEL org.opencontainers.image.authors="dermhioasw123@gmail.com"
LABEL description="Assistants within your Discord server will help make your server a better place to live."

RUN apk --update --no-cache add \
    git openjdk11-jre python3 ffmpeg build-base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000 4000 9000

CMD ["npm", "run", "serve"]

# --- Production Stage ---
FROM node:alpine AS production

LABEL org.opencontainers.image.authors="dermhioasw123@gmail.com"
LABEL description="Assistants within your Discord server will help make your server a better place to live."

RUN apk --update --no-cache add \
    python3 ffmpeg

WORKDIR /usr/src/app

# Copy pre-built node_modules from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY source ./source

EXPOSE 3000

CMD ["npm", "start"]
