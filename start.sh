#!/bin/sh -x
clear

echo Start with start.sh in administrator mode....

# Updating system components
echo Initiate system components update...
apt-get update -y || sudo apt-get update -y
echo The component update is complete.

# Python installation
echo Installing Python...
apt-get install -y python3 || sudo apt-get install -y python3
echo Finished installing Python.

# FFmpeg installation
echo Installing FFmpeg...
apt-get install -y ffmpeg || sudo apt-get install -y ffmpeg
echo Finished installing FFmpeg.

# Building Tools installation
echo Installing building tool...
apt-get install -y libtool-bin || sudo apt-get install -y libtool-bin
echo Finish installing building tool.

# NPM installation
echo Updating NPM to latest version...
npm install -g npm@latest || sudo npm install -g npm@latest
echo Finished Updating npm.

# Components installation
echo Installing components...
npm install || sudo npm install
echo Completing the component installation.

echo Starting the system...
node ./source/shard.js || sudo node ./source/shard.js
