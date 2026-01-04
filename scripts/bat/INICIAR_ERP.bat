@echo off
chcp 65001 >nul
title Sistema ERP Constructora - Puerto 5174
color 0A

echo.
echo ============================================================
echo     SISTEMA ERP CONSTRUCTORA - PUERTO 5174
echo ============================================================
echo.
echo [INFO] Iniciando servidor HTTP Python...
echo.

cd /d %~dp0

:: Verificar Python
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no encontrado en el PATH
    echo.
    echo Por favor instala Python desde: https://www.python.org/
    echo Asegúrate de agregar Python al PATH durante la instalación.
    echo.
    pause
    exit /b 1
)

echo [OK] Python encontrado
echo [INFO] Sirviendo archivos desde: %CD%
echo.
echo ============================================================
echo     ACCESO A LA APLICACIÓN
echo ============================================================
echo.
echo   🌐 URL Principal:  http://localhost:5174
echo   📱 Login:          http://localhost:5174/index.html
echo.
echo   CREDENCIALES DE PRUEBA:
echo   ─────────────────────────────────────────────────────────
echo   Admin:      admin@constructora.com / admin123
echo   Trabajador: trabajador@constructora.com / trabajador123
echo   Cliente:    cliente@constructora.com / cliente123
echo.
echo ============================================================
echo.
echo [INFO] Abriendo navegador en 2 segundos...
echo.
timeout /t 2 /nobreak >nul
start http://localhost:5174

echo [INFO] ✓ Servidor iniciado correctamente
echo [INFO] ⓘ No cierres esta ventana mientras uses la aplicación
echo [INFO] ⓘ Presiona CTRL+C para detener el servidor
echo.
python -m http.server 5174

echo.
echo [INFO] Servidor detenido
pause
