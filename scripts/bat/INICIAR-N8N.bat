@echo off
REM ============================================================
REM Script para Iniciar n8n con Docker
REM ============================================================

echo.
echo ========================================
echo   INICIANDO n8n CON DOCKER
echo ========================================
echo.

REM Verificar si Docker está instalado
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no está instalado o no está en el PATH
    echo Por favor, instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Verificar si Docker está corriendo
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no está corriendo
    echo Por favor, inicia Docker Desktop y vuelve a intentar
    pause
    exit /b 1
)

echo [OK] Docker está instalado y corriendo
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si existe docker-compose.n8n.yml
if not exist "docker-compose.n8n.yml" (
    echo [ERROR] No se encontró docker-compose.n8n.yml
    pause
    exit /b 1
)

echo [INFO] Iniciando contenedores de n8n...
echo.

REM Iniciar contenedores
docker-compose -f docker-compose.n8n.yml up -d

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Error al iniciar contenedores
    pause
    exit /b 1
)

echo.
echo [OK] Contenedores iniciados correctamente
echo.
echo ========================================
echo   n8n ESTÁ LISTO
echo ========================================
echo.
echo URL: http://localhost:5678
echo Usuario: admin
echo Contraseña: admin123 (cambiar en producción)
echo.
echo Para ver los logs:
echo   docker-compose -f docker-compose.n8n.yml logs -f
echo.
echo Para detener n8n:
echo   docker-compose -f docker-compose.n8n.yml down
echo.
echo Presiona cualquier tecla para abrir n8n en el navegador...
pause >nul

REM Abrir navegador
start http://localhost:5678

echo.
echo [INFO] n8n abierto en el navegador
echo.

