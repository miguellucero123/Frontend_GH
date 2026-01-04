@echo off
chcp 65001 >nul
title Detener Todos los Servidores
color 0C

echo.
echo ============================================================
echo     DETENIENDO TODOS LOS SERVIDORES
echo ============================================================
echo.

echo [INFO] Deteniendo procesos de Python (http.server)...
taskkill /F /IM python.exe /T >nul 2>&1
if errorlevel 1 (
    echo [INFO] No se encontraron procesos de Python ejecutándose
) else (
    echo [OK] Procesos de Python detenidos
)

echo.
echo [INFO] Deteniendo procesos de Node.js (Vite/npm)...
taskkill /F /IM node.exe /T >nul 2>&1
if errorlevel 1 (
    echo [INFO] No se encontraron procesos de Node.js ejecutándose
) else (
    echo [OK] Procesos de Node.js detenidos
)

echo.
echo [INFO] Verificando puertos 5174, 8080, 8002...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174"') do (
    echo [INFO] Proceso usando puerto 5174: %%a
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080"') do (
    echo [INFO] Proceso usando puerto 8080: %%a
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8002"') do (
    echo [INFO] Proceso usando puerto 8002: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [OK] Todos los servidores han sido detenidos
echo.
echo [INFO] Espera 3 segundos antes de continuar...
timeout /t 3 /nobreak >nul
echo.
echo [OK] Listo para iniciar servidor nuevo
echo.
pause

