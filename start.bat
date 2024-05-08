@echo off
title Shioru
cls

echo ##################################################
echo #             RUNNING VIA START.BAT              #
echo ##################################################
echo #                                                #
echo # Running this script will automatically update  #
echo # and install all necessary components. If you   #
echo # don't want to continue, you can Ctrl + C       #
echo # or ^C.                                         #
echo #                                                #
echo # Will install: chocolatey, git, nodejs-lts,     #
echo # openjdk, python3, ffmpeg                       #
echo # and visualstudio2022buildtools                 #
echo #                                                #
echo ##################################################
echo.

@REM Check is in admin mode or not
net session >nul 2>&1
if ERRORLEVEL NEQ 0 powershell start -verb runas "%0" am_admin & exit /b

echo Verifying installation of package manager...
call choco --version >nul 2>&1

if ERRORLEVEL NEQ 0 (
    echo Updating and installing package manager...
    powershell Set-ExecutionPolicy Bypass -Scope Process -Force
    powershell [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    powershell iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    call choco upgrade -y chocolatey
)

echo.

echo Updating and installing required components...
call choco list --local-only | findstr /C:"git" || call choco upgrade -y git
call choco list --local-only | findstr /C:"nodejs-lts" || (
    call choco upgrade -y nodejs-lts
    echo.
    echo Updating NPM to the latest version...
    call npm install -g npm@latest
)
call choco list --local-only | findstr /C:"openjdk" || call choco upgrade -y openjdk
call choco list --local-only | findstr /C:"python3" || call choco upgrade -y python3
call choco list --local-only | findstr /C:"ffmpeg" || call choco upgrade -y ffmpeg
call choco list --local-only | findstr /C:"visualstudio2022buildtools" || call choco upgrade -y visualstudio2022buildtools
echo.

echo Updating and installing depandancies...
call npm install
echo.

echo Starting up the system...
call npm start
