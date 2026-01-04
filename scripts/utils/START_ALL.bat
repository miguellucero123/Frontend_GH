@echo off
title Iniciando ERP Constructora
echo ========================================
echo    Iniciando ERP Constructora
echo ========================================
echo.

REM Definir rutas
set NODE_PATH=D:\Miguel\Anaconda_AIEP
set PATH=%PATH%;%NODE_PATH%

echo Iniciando Backend...
start "Backend - ERP" cmd /k "cd /d C:\Users\Alicia_Piero\Documents\Repo_AIEP\ERP_Costructora\frontend\backend && python -m uvicorn main:app --port 8002 --host 127.0.0.1 --reload"
timeout /t 3 /nobreak > nul

echo.
echo Iniciando Frontend...
start "Frontend - ERP" cmd /k "cd /d C:\Users\Alicia_Piero\Documents\Repo_AIEP\ERP_Costructora\frontend\app && set PATH=%PATH%;%NODE_PATH% && npm run dev"
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo    Servicios Iniciados
echo ========================================
echo  Backend:  http://127.0.0.1:8002
echo  Frontend: http://localhost:5173
echo  Usuario:  admin@constructora.com
echo  Pass:     admin123
echo ========================================
echo.
echo Abriendo navegador...
timeout /t 2 /nobreak > nul
start http://localhost:5173
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul