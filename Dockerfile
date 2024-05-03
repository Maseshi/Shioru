FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN apt-get update -y && apt-get upgrade -y
RUN apk add --no-cache git default-jre python3 ffmpeg build-essential
RUN npm install -g npm@latest && npm install

COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
