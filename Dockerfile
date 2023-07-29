FROM node:18-alpine

COPY package*.json /usr/src/app

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080

CMD ["/bin/sh", "start.sh"]