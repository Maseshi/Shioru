@echo off

cls
net session >nul 2>&1
IF %ERRORLEVEL% NEQ 0 powershell start -verb runas "%0" am_admin & exit /b

echo Start with start.bat in administrator mode...

echo Verifying installation of Chocolatey...
call :VerifyChocolatey

echo Initiate component upgrade...
call choco upgrade all -y
echo The component upgrade is complete.

echo Verifying installation of FFmpeg...
call :VerifyFFmpeg

echo Installing build components...
call choco install build-essential -y
call choco install autoconf automake g++ libtool -y
echo Finish installing building components.

echo Installing components...
call npm install --save
echo Completing the component installation.

echo Starting the system...
call node ./source/shard.js
exit /b 0

:VerifyChocolatey
call choco --version

if %ERRORLEVEL% EQU 0 exit /b 1

echo Installing Chocolatey...
powershell Set-ExecutionPolicy RemoteSigned
powershell iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex
echo Updating Chocolatey...
call choco upgrade chocolatey -y
echo Finish installing and updating Chocolatey.
exit /b 1

:VerifyFFmpeg
call ffmpeg -version

if %ERRORLEVEL% EQU 0 exit /b 1

echo Installing FFmpeg...
call choco install ffmpeg -y
echo Updating FFmpeg...
call choco upgrade ffmpeg -y
echo Finish installing and updating FFmpeg.
exit /b 1
