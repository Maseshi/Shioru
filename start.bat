@echo off
title Shioru
chcp 65001
cls

echo ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
echo ┃             RUNNING VIA START.BAT              ┃
echo ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
echo ┃                                                ┃
echo ┃ Running this script will automatically update  ┃
echo ┃ and install all necessary components. If you   ┃
echo ┃ don't want to continue, you can Ctrl + C       ┃
echo ┃ or ^^C.                                         ┃
echo ┃                                                ┃
echo ┃ Will install: winget, Git,                     ┃
echo ┃ Java(TM).SE.Development.Kit, Python.3.12,      ┃
echo ┃ FFmpeg, Visual.Studio.BuildTools.2022 and      ┃
echo ┃ Node.js.LTS                                    ┃
echo ┃                                                ┃
echo ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
echo.

if '%1' neq 'am_admin' (
    powershell start -verb runas '%0' am_admin & exit /b
)

echo Verifying installation of package manager...
call winget --version >nul 2>&1
if %errorlevel% neq 0 (
    powershell Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe || (
        powershell Write-Information "Downloading WinGet and its dependencies..."
        powershell Invoke-WebRequest -Uri https://aka.ms/getwinget -OutFile Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle
        powershell Invoke-WebRequest -Uri https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx -OutFile Microsoft.VCLibs.x64.14.00.Desktop.appx
        powershell Invoke-WebRequest -Uri https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx -OutFile Microsoft.UI.Xaml.2.8.x64.appx
        powershell Add-AppxPackage Microsoft.VCLibs.x64.14.00.Desktop.appx
        powershell Add-AppxPackage Microsoft.UI.Xaml.2.8.x64.appx
        powershell Add-AppxPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle
    )
)
echo.

echo Updating and installing required components...
call winget install Git Java(TM).SE.Development.Kit Python.3.12 FFmpeg Visual.Studio.BuildTools.2022 Node.js.LTS
echo.

echo Updating NPM to the latest version...
call npm install -g npm@latest
echo.

echo Updating and installing depandancies...
call npm install
echo.

echo Starting up the system...
call npm start
