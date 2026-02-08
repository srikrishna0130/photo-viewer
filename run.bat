@echo off
title Photo Viewer
echo.
echo  =============================
echo   📸 Photo Viewer
echo  =============================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  ❌ Node.js is not installed. Please install it from https://nodejs.org
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo  📦 Installing dependencies...
    npm install --silent
    echo.
)

:: Start the dev server and open browser
echo  🚀 Starting Photo Viewer...
echo  Open http://localhost:5173 in Chrome or Edge
echo.
start http://localhost:5173
npm run dev
