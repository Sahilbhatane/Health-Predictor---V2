@echo off
echo Starting Health Prediction System Backend...
echo.

REM Change to the server directory
cd /d "%~dp0\.."

REM Set default API key if not already set
if not defined MODEL_API_KEY (
    set MODEL_API_KEY=changeme
    echo Using default API key: changeme
)

echo API Key: %MODEL_API_KEY%
echo Working Directory: %CD%
echo.

REM Start the FastAPI server
echo Starting FastAPI server on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo Health Check: http://localhost:8000/health
echo.

python app.py

echo.
echo Server stopped.
pause