@echo off
chcp 65001 >nul
title Abrir ERP Constructora - Puerto 5174
color 0B

echo.
echo ============================================================
echo     ABRIENDO ERP CONSTRUCTORA
echo     Puerto 5174
echo ============================================================
echo.

echo [INFO] Abriendo navegador...
start http://localhost:5174

echo.
echo [OK] Navegador abierto
echo [INFO] Si el servidor no está corriendo, ejecuta: INICIAR_SERVIDOR.bat
echo.
timeout /t 3 /nobreak >nul

