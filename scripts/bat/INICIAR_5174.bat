@echo off
chcp 65001 >nul
title Servidor Puerto 5174 - ERP Constructora
color 0B

echo.
echo ============================================================
echo     INICIANDO SERVIDOR EN PUERTO 5174
echo ============================================================
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
echo [INFO] Iniciando servidor en puerto 5174...
echo.
echo     URL: http://localhost:5174
echo.
echo     Credenciales de Prueba:
echo     - Admin: admin@constructora.com / admin123
echo     - Trabajador: trabajador@constructora.com / trabajador123
echo     - Cliente: cliente@constructora.com / cliente123
echo.
echo     Presiona CTRL+C para detener
echo.
echo [INFO] Abriendo navegador en 3 segundos...
timeout /t 3 /nobreak >nul
start http://localhost:5174
echo.
python -m http.server 5174

