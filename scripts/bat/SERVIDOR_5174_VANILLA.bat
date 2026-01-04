@echo off
chcp 65001 >nul
title Servidor Puerto 5174 - HTML Vanilla
color 0B

echo.
echo ============================================================
echo     SERVIDOR EN PUERTO 5174 - HTML VANILLA
echo ============================================================
echo.
echo [INFO] Este script sirve los archivos HTML vanilla
echo [INFO] NO la aplicación React
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
echo     URL: http://localhost:5174
echo     Archivo principal: http://localhost:5174/index.html
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

