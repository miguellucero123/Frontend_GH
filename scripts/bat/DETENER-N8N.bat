@echo off
REM ============================================================
REM Script para Detener n8n con Docker
REM ============================================================

echo.
echo ========================================
echo   DETENIENDO n8n
echo ========================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si existe docker-compose.n8n.yml
if not exist "docker-compose.n8n.yml" (
    echo [ERROR] No se encontró docker-compose.n8n.yml
    pause
    exit /b 1
)

echo [INFO] Deteniendo contenedores de n8n...
echo.

REM Detener contenedores
docker-compose -f docker-compose.n8n.yml down

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Error al detener contenedores
    pause
    exit /b 1
)

echo.
echo [OK] Contenedores detenidos correctamente
echo.
echo Nota: Los datos se conservan en los volúmenes de Docker
echo Para eliminar los datos también, usa:
echo   docker-compose -f docker-compose.n8n.yml down -v
echo.
pause

