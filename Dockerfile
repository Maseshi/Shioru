FROM debian:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get -y update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get -y install nodejs

COPY . .

EXPOSE 8080
CMD [ "/bin/sh", "start.sh" ]
