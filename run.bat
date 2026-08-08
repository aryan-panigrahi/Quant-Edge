@echo off
title QuantEdge Terminal Launcher
color 0A

echo.
echo  ============================================
echo   QUANTEDGE — NSE Precision Engine
echo   Starting Backend + Frontend...
echo  ============================================
echo.

:: Start FastAPI backend in a new window
start "QuantEdge Backend [FastAPI :8000]" cmd /k "color 0B && echo [BACKEND] Starting FastAPI on http://127.0.0.1:8000 && echo. && uvicorn main:app --reload"

:: Small delay so backend gets a head start
timeout /t 2 /nobreak >nul

:: Start Vite frontend in a new window
start "QuantEdge Frontend [Vite :5173]" cmd /k "color 0A && echo [FRONTEND] Starting Vite on http://localhost:5173 && echo. && cd frontend && npm run dev"

echo.
echo  [OK] Both servers are launching in separate windows.
echo.
echo  Backend  ->  http://127.0.0.1:8000
echo  Frontend ->  http://localhost:5173
echo.
echo  Open http://localhost:5173 in your browser.
echo  Close those windows to stop the servers.
echo.
pause
