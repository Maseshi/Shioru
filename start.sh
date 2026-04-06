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
┃ Will install: curl, git, default-jre, python3, ┃
┃ ffmpeg, build-essential, libcairo2-dev,        ┃
┃ libpango1.0-dev, libjpeg-dev, libgif-dev,      ┃
┃ librsvg2-dev and bun                           ┃
┃                                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOF
echo

echo Updating system packages and installing required packages...
sudo apt-get update && sudo apt-get install -y curl git default-jre python3 ffmpeg build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
echo

echo Installing Bun...
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
echo

echo Updating and installing dependencies...
bun install
echo

echo Starting up the system...
bun run start
