@echo off
echo Starting FinPulse...

:: Start Backend
start "FinPulse Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

:: Start Frontend (Adding Node.js to PATH as per environment)
start "FinPulse Frontend" cmd /k "cd frontend && set PATH=k:\nodejs;%PATH% && npm run dev"

echo ===================================================
echo FinPulse is starting!
echo Backend will be at: http://localhost:8000
echo Frontend will be at: http://localhost:5173 (check popup window for exact port)
echo ===================================================
pause
