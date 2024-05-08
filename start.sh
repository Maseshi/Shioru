#!/bin/sh -x
echo -e '\033]2;Shioru\007'
clear

echo ##################################################
echo #              RUNNING VIA START.SH              #
echo ##################################################
echo #                                                #
echo # Running this script will automatically update  #
echo # and install all necessary packages. If you     #
echo # don't want to continue, you can Ctrl + C       #
echo # or ^C.                                         #
echo #                                                #
echo # Will install: git, nodejs, default-jre,        #
echo # python3, ffmpeg and build-essential            #
echo #                                                #
echo ##################################################
echo

echo Updating system packages and installing required packages...
sudo apt-get update -y
dpkg -s git || sudo apt-get install git -y
dpkg -s nodejs || (
    sudo apt-get install curl && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install nodjs -y
    echo
    echo Updating NPM to the latest version...
    sudo npm install -g npm@latest
)
dpkg -s default-jre || sudo apt-get install default-jre -y
dpkg -s python3 || sudo apt-get install python3 -y
dpkg -s ffmpeg || sudo apt-get install ffmpeg -y
dpkg -s build-essential || sudo apt-get install build-essential -y
echo

echo Updating and installing depandancies...
sudo npm install
echo

echo Starting up the system...
sudo npm start
