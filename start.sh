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
┃ Will install: curl, git, unzip, python3,       ┃
┃ ffmpeg, build-essential, Node.js (nvm)         ┃
┃ and Bun                                        ┃
┃                                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOF
echo

echo Updating system packages and installing required packages...
sudo apt-get update && sudo apt-get install -y curl git unzip python3 ffmpeg build-essential
echo

echo Installing Node.js via nvm...
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
fi
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install --lts
echo

echo Installing Bun...
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
echo

echo Updating and installing dependencies...
bun install
echo

echo Starting up the system...
bun run start
