@echo off
chcp 65001 >nul
title ERP Constructora - Verificación de Requisitos (Sin Pausa)
color 0B

echo.
echo ============================================================
echo     VERIFICACIÓN DE REQUISITOS - ERP CONSTRUCTORA
echo ============================================================
echo.

setlocal enabledelayedexpansion
set "ERROR_COUNT=0"
set "WARNING_COUNT=0"

REM ============================================================
REM 1. VERIFICAR ANACONDA/CONDA
REM ============================================================
echo [1/7] Verificando Anaconda/Conda...
echo.

set "CONDA_FOUND=0"
set "CONDA_PATH="

REM Intentar ejecutar conda directamente primero
conda --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "CONDA_FOUND=1"
    for /f "tokens=*" %%i in ('conda --version 2^>nul') do echo [OK] Anaconda/Conda encontrado: %%i
) else (
    REM Si no está en PATH, buscar en ubicaciones comunes
    echo [BUSCANDO] Anaconda no está en PATH, buscando en ubicaciones comunes...
    
    REM Buscar en ubicaciones específicas del usuario (orden de prioridad)
    if exist "D:\Miguel\Anaconda_AIEP\Scripts\conda.exe" (
        set "CONDA_PATH=D:\Miguel\Anaconda_AIEP\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "D:\Miguel\Anaconda_AIEP\conda.exe" (
        set "CONDA_PATH=D:\Miguel\Anaconda_AIEP"
        set "CONDA_FOUND=1"
    ) else if exist "%USERPROFILE%\anaconda3\Scripts\conda.exe" (
        set "CONDA_PATH=%USERPROFILE%\anaconda3\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "%USERPROFILE%\miniconda3\Scripts\conda.exe" (
        set "CONDA_PATH=%USERPROFILE%\miniconda3\Scripts"
        set "CONDA_FOUND=1"
    )
    
    if "!CONDA_FOUND!"=="1" (
        echo [OK] Anaconda encontrado en: !CONDA_PATH!
        "!CONDA_PATH!\conda.exe" --version
    ) else (
        echo [ERROR] Anaconda/Conda no encontrado
        set /a ERROR_COUNT+=1
    )
)
echo.

REM ============================================================
REM 2. VERIFICAR PYTHON
REM ============================================================
echo [2/7] Verificando Python...
echo.

python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('python --version 2^>nul') do echo [OK] %%i
) else (
    if defined CONDA_PATH (
        if exist "!CONDA_PATH!\python.exe" (
            "!CONDA_PATH!\python.exe" --version
            echo [OK] Python encontrado en Anaconda
        ) else (
            echo [ERROR] Python no encontrado
            set /a ERROR_COUNT+=1
        )
    ) else (
        echo [ERROR] Python no encontrado
        set /a ERROR_COUNT+=1
    )
)
echo.

REM ============================================================
REM 3. VERIFICAR DOCKER
REM ============================================================
echo [3/7] Verificando Docker...
echo.

docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('docker --version 2^>nul') do echo [OK] %%i
    docker info >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Docker está corriendo
    ) else (
        echo [ADVERTENCIA] Docker está instalado pero no está corriendo
        set /a WARNING_COUNT+=1
    )
) else (
    echo [ERROR] Docker no encontrado
    set /a ERROR_COUNT+=1
)
echo.

REM ============================================================
REM 4. VERIFICAR NODE.JS
REM ============================================================
echo [4/7] Verificando Node.js...
echo.

set "NODE_FOUND=0"
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "NODE_FOUND=1"
    for /f "tokens=*" %%i in ('node --version 2^>nul') do echo [OK] Node.js: %%i
) else (
    if exist "D:\Miguel\Anaconda_AIEP\node.exe" (
        set "NODE_FOUND=1"
        "D:\Miguel\Anaconda_AIEP\node.exe" --version
        echo [OK] Node.js encontrado en Anaconda
    ) else (
        echo [ERROR] Node.js no encontrado
        set /a ERROR_COUNT+=1
    )
)
echo.

REM ============================================================
REM 5. VERIFICAR NPM
REM ============================================================
echo [5/7] Verificando npm...
echo.

if "!NODE_FOUND!"=="1" (
    npm --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        for /f "tokens=*" %%i in ('npm --version 2^>nul') do echo [OK] npm: %%i
    ) else (
        echo [ADVERTENCIA] npm no encontrado
        set /a WARNING_COUNT+=1
    )
) else (
    echo [OMITIDO] npm no verificado (Node.js no encontrado)
)
echo.

REM ============================================================
REM 6. VERIFICAR DEPENDENCIAS DEL BACKEND
REM ============================================================
echo [6/7] Verificando dependencias del Backend...
echo.

if exist "backend\requirements.txt" (
    echo [OK] requirements.txt encontrado
    if exist "backend\run_server.py" (
        echo [OK] run_server.py encontrado
        python -c "import fastapi" >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo [OK] FastAPI instalado
        ) else (
            echo [ADVERTENCIA] FastAPI no instalado. Ejecutar: pip install -r backend\requirements.txt
            set /a WARNING_COUNT+=1
        )
    ) else (
        echo [ADVERTENCIA] run_server.py no encontrado
        set /a WARNING_COUNT+=1
    )
) else (
    echo [ADVERTENCIA] requirements.txt no encontrado
    set /a WARNING_COUNT+=1
)
echo.

REM ============================================================
REM 7. VERIFICAR DEPENDENCIAS DEL FRONTEND
REM ============================================================
echo [7/7] Verificando dependencias del Frontend...
echo.

if exist "app\package.json" (
    echo [OK] package.json encontrado
    if exist "app\node_modules" (
        echo [OK] node_modules encontrado (dependencias instaladas)
    ) else (
        echo [ADVERTENCIA] node_modules no encontrado. Ejecutar: cd app ^&^& npm install
        set /a WARNING_COUNT+=1
    )
) else (
    echo [ADVERTENCIA] package.json no encontrado
    set /a WARNING_COUNT+=1
)
echo.

REM ============================================================
REM RESUMEN
REM ============================================================
echo.
echo ============================================================
echo     RESUMEN DE VERIFICACIÓN
echo ============================================================
echo.

if %ERROR_COUNT% EQU 0 (
    if %WARNING_COUNT% EQU 0 (
        echo [✓] TODOS LOS REQUISITOS ESTÁN INSTALADOS
        echo.
        echo Puedes iniciar el sistema con:
        echo   - iniciar-todo-con-anaconda.bat
        echo   - iniciar-n8n.bat (solo n8n)
        echo   - INICIAR_TODO.bat (sin Anaconda)
    ) else (
        echo [⚠] REQUISITOS PRINCIPALES OK, PERO HAY ADVERTENCIAS
        echo.
        echo Advertencias: %WARNING_COUNT%
        echo Revisa las advertencias arriba y corrige si es necesario.
    )
) else (
    echo [✗] FALTAN REQUISITOS CRÍTICOS
    echo.
    echo Errores encontrados: %ERROR_COUNT%
    echo Advertencias: %WARNING_COUNT%
    echo.
    echo Por favor, instala los componentes faltantes antes de continuar.
)

echo.
echo ============================================================
echo.

REM Mostrar información de ubicaciones encontradas
if defined CONDA_PATH (
    echo [INFO] Anaconda encontrado en: !CONDA_PATH!
)

echo.
echo Verificación completada.
timeout /t 3 >nul

