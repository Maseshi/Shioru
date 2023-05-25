#!/bin/sh -x

clear

echo Start with start.sh in administrator mode....

echo Initiate component update...
apt-get update -y || sudo apt-get update -y
echo The component update is complete.

echo Installing FFmpeg...
apt-get install ffmpeg -y || sudo apt-get install ffmpeg -y
echo Finished installing FFmpeg.

echo Installing build components...
apt-get install build-essential -y || sudo apt-get install build-essential -y
apt-get install autoconf automake g++ libtool -y || sudo apt-get install autoconf automake g++ libtool -y
echo Finish installing building components.

echo Installing components...
npm install --save || sudo npm install --save
echo Completing the component installation.

echo Starting the system...
node ./source/shard.js || sudo node ./source/shard.js
