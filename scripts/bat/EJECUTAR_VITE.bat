@echo off
chcp 65001 >nul
title Ejecutar ERP Constructora - Vite (Puerto 5174)
color 0B

echo.
echo ============================================================
echo     EJECUTANDO ERP CONSTRUCTORA
echo     Servidor Vite - Puerto 5174
echo ============================================================
echo.

cd /d %~dp0

:: Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no encontrado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
echo [INFO] Verificando dependencias...
cd app

:: Verificar si node_modules existe
if not exist node_modules (
    echo [INFO] Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Error al instalar dependencias
        pause
        exit /b 1
    )
)

echo [OK] Dependencias listas
echo [INFO] Iniciando servidor Vite en puerto 5174...
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
echo [INFO] Abriendo navegador...
timeout /t 3 /nobreak >nul
start http://localhost:5174
echo.
npm run dev

