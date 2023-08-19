# syntax=docker/dockerfile:1
FROM node:20-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN apk add --no-cache python3
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache libtool-bin
RUN npm install -g npm@latest
RUN npm install

COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
