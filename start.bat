@echo off
cls
net session >nul 2>&1
IF %ERRORLEVEL% NEQ 0 powershell start -verb runas "%0" am_admin & exit /b

echo Start with start.bat in administrator mode...

@REM Chocolate installation
echo Verifying installation of Chocolatey...
call choco --version

if %ERRORLEVEL% EQU 0 exit /b 1

echo Installing Chocolatey...
powershell Set-ExecutionPolicy RemoteSigned
powershell iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex
echo Updating Chocolatey...
call choco upgrade -y chocolatey
echo Finish installing and updating Chocolatey.

@REM Python installation
echo Verifying installation of Python...
call python --version

if %ERRORLEVEL% EQU 0 exit /b 1

echo Installing Python...
call choco upgrade -y python3
echo Finish installing and updating Python.

@REM FFmpeg installation
echo Verifying installation of FFmpeg...
call ffmpeg -version

if %ERRORLEVEL% EQU 0 exit /b 1

echo Installing FFmpeg...
call choco upgrade -y ffmpeg
echo Finish installing and updating FFmpeg.

@REM Building Tools installation
echo Installing building tools...
call npm install -g windows-build-tools
echo Finish installing building components.

@REM NPM installation
echo Updating NPM to latest version...
call npm install -g npm@latest
echo Finished Updating npm.

@REM Components installation
echo Installing components...
call npm install
echo Completing the component installation.

echo Starting the system...
call node ./source/shard.js
exit /b 0
