@echo off
chcp 65001 >nul
title Iniciar Servidor Limpio - Puerto 5174
color 0B

echo.
echo ============================================================
echo     INICIANDO SERVIDOR LIMPIO - PUERTO 5174
echo ============================================================
echo.

echo [PASO 1] Deteniendo todos los servidores anteriores...
echo.

echo [INFO] Deteniendo procesos de Python (http.server)...
taskkill /F /IM python.exe /T >nul 2>&1
if errorlevel 1 (
    echo [INFO] No se encontraron procesos de Python ejecutándose
) else (
    echo [OK] Procesos de Python detenidos
)

echo [INFO] Deteniendo procesos de Node.js (Vite/npm)...
taskkill /F /IM node.exe /T >nul 2>&1
if errorlevel 1 (
    echo [INFO] No se encontraron procesos de Node.js ejecutándose
) else (
    echo [OK] Procesos de Node.js detenidos
)

echo [INFO] Liberando puertos 5174, 8080, 8002...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8002"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [OK] Servidores detenidos
echo [INFO] Esperando 2 segundos para liberar puertos...
timeout /t 2 /nobreak >nul
echo.

echo [PASO 2] Iniciando servidor HTTP en puerto 5174...
echo.

cd /d %~dp0

:: Verificar Python
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no encontrado
    echo.
    echo Por favor instala Python desde: https://www.python.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Python encontrado
echo [INFO] Iniciando servidor HTTP en puerto 5174...
echo [INFO] Sirviendo archivos desde: %CD%
echo.
echo     URL: http://localhost:5174/index.html
echo.
echo     Credenciales de Prueba:
echo     - Admin: admin@constructora.com / admin123
echo     - Trabajador: trabajador@constructora.com / trabajador123
echo     - Cliente: cliente@constructora.com / cliente123
echo.
echo     Presiona CTRL+C para detener el servidor
echo.
echo [INFO] Abriendo navegador en 3 segundos...
timeout /t 3 /nobreak >nul
start http://localhost:5174/index.html
echo.
echo [INFO] Servidor iniciado. No cierres esta ventana.
echo.
python -m http.server 5174

