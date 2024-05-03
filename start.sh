#!/bin/sh -x
clear

echo ##################################################
echo #              RUNNING VIA START.SH              #
echo ##################################################
echo #                                                #
echo # Running this script will automatically update  #
echo # and install all necessary packages. If you   #
echo # don't want to continue, you can Ctrl + C       #
echo # or ^C.                                         #
echo #                                                #
echo # Will install: git, nodejs, default-jre,        #
echo # python3, ffmpeg and build-essential           #
echo #                                                #
echo ##################################################
echo.
echo Updating system packages and installing required packages...
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install curl && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y git nodejs default-jre python3 ffmpeg build-essential
echo.
echo Updating NPM to the latest version and installing components...
sudo npm install -g npm@latest && sudo npm install
echo.
echo Starting up the system...
sudo npm start
