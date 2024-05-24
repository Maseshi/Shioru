#!/bin/bash
echo -ne '\033]0;Shioru\007'
clear

cat << "EOF"
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              RUNNING VIA START.SH              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                ┃
┃ Running this script will automatically update  ┃
┃ and install all necessary packages. If you     ┃
┃ don't want to continue, you can Ctrl + C       ┃
┃ or ^C.                                         ┃
┃                                                ┃
┃ Will install: curl, fnm, git, default-jre,     ┃
┃ python3, ffmpeg, build-essential,              ┃
┃ libcairo2-dev, libpango1.0-dev, libjpeg-dev    ┃
┃ libgif-dev and librsvg2-dev                    ┃
┃                                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOF
echo

echo Updating system packages and installing required packages...
sudo apt-get update && sudo apt-get install curl git default-jre python3 ffmpeg build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
curl -fsSL https://fnm.vercel.app/install | bash
fnm use --install-if-missing 20
echo

echo Updating NPM to the latest version...
sudo npm install -g npm@latest
echo

echo Updating and installing depandancies...
sudo npm install
echo

echo Starting up the system...
sudo -E npm start
