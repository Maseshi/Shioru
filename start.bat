@echo off
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

@REM Check is in admin mode or not
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 powershell start -verb runas "%0" am_admin & exit /b

echo Verifying installation of package manager...
call choco --version >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo Installing package manager...
    powershell Set-ExecutionPolicy Bypass -Scope Process -Force
    powershell [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    powershell iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
)

echo Updating package manager and installing required components......
call choco upgrade -y chocolatey && choco upgrade -y git nodejs-lts openjdk python3 ffmpeg visualstudio2022buildtools
echo.
echo Updating NPM to the latest version and installing packages...
call npm install -g npm@latest && npm install
echo.
echo Starting up the system...
call npm start
