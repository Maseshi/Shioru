FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN apt-get update && apt-get install -y
RUN apk add --no-cache python3
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache build-essential
RUN apk add --no-cache git
RUN npm install -g npm@latest
RUN npm install

COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
