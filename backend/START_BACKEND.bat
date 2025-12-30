@echo off
REM ====================================================================
REM Farm AI - Backend Chat API Quick Start Script
REM ====================================================================

echo.
echo ====================================================================
echo          Farm AI Backend Chat Service - Startup Script
echo ====================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Change to backend directory
cd /d "%~dp0backend" || (
    echo [ERROR] Could not navigate to backend directory
    pause
    exit /b 1
)

echo [INFO] Installing dependencies from requirements.txt...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ====================================================================
echo                    Starting FastAPI Chat Service
echo ====================================================================
echo.
echo Backend will run on: http://localhost:5000
echo API Documentation: http://localhost:5000/docs
echo Health Check: http://localhost:5000/api/chat/health
echo.
echo In another terminal, start the frontend:
echo   cd frontend
echo   npm start
echo.
echo Then open: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ====================================================================
echo.

REM Start the FastAPI server
python -m uvicorn chat_api:app --host 0.0.0.0 --port 5000 --reload

pause
