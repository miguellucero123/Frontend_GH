@echo off
chcp 65001 >nul
title ERP Constructora - Ejecutar Simple
color 0B

echo.
echo ============================================================
echo     EJECUTANDO ERP CONSTRUCTORA
echo     Version Simple y Robusta
echo ============================================================
echo.

cd /d %~dp0

:: Intentar Python primero (más simple) - SERVIR HTML VANILLA
where python >nul 2>&1
if not errorlevel 1 (
    echo [OK] Python encontrado
    echo [INFO] Iniciando servidor en puerto 5174...
    echo [INFO] Sirviendo archivos HTML VANILLA (NO React)
    echo.
    echo     URL: http://localhost:5174/index.html
    echo.
    echo     Credenciales:
    echo     - Admin: admin@constructora.com / admin123
    echo     - Trabajador: trabajador@constructora.com / trabajador123
    echo     - Cliente: cliente@constructora.com / cliente123
    echo.
    echo     Presiona CTRL+C para detener
    echo.
    timeout /t 2 /nobreak >nul
    start http://localhost:5174/index.html
    echo.
    python -m http.server 5174
    goto :end
)

:: Si no hay Python, intentar Node.js
where node >nul 2>&1
if not errorlevel 1 (
    echo [OK] Node.js encontrado
    echo [INFO] Iniciando servidor Vite...
    cd app
    if not exist node_modules (
        echo [INFO] Instalando dependencias...
        call npm install
    )
    echo [INFO] Iniciando servidor en puerto 5174...
    echo.
    echo     URL: http://localhost:5174
    echo.
    timeout /t 2 /nobreak >nul
    start http://localhost:5174
    echo.
    npm run dev
    goto :end
)

:: Si no hay nada, abrir directamente
echo [ADVERTENCIA] No se encontró Python ni Node.js
echo [INFO] Abriendo index.html directamente...
if exist index.html (
    start index.html
) else (
    echo [ERROR] No se encontró index.html
    pause
)

:end

