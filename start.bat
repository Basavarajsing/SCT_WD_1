@echo off
echo Starting TaskLit Application...
echo.

echo Starting backend server on port 5000...
start "TaskLit Backend" cmd /k "npm run dev"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend server on port 3000...
start "TaskLit Frontend" cmd /k "npm run client"

echo.
echo TaskLit is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 