@echo off
chcp 65001 >nul
title Abrir ERP Constructora - Modo Directo
color 0B

echo.
echo ============================================================
echo     ABRIENDO ERP CONSTRUCTORA
echo     Modo Directo (sin servidor)
echo ============================================================
echo.

cd /d %~dp0

if exist index.html (
    echo [OK] Abriendo index.html en el navegador...
    start index.html
    echo.
    echo [INFO] Archivo abierto
    echo [ADVERTENCIA] Algunas funcionalidades pueden no funcionar:
    echo     - APIs y llamadas al backend
    echo     - Módulos ES6
    echo     - Algunos estilos pueden verse diferentes
    echo.
    echo [INFO] Para mejor experiencia, instala Node.js o Python
    echo        y usa EJECUTAR.bat o INICIAR_SERVIDOR.bat
) else (
    echo [ERROR] No se encontró index.html
    echo [INFO] Asegúrate de estar en la carpeta frontend
)

echo.
pause

