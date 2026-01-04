@echo off
chcp 65001 >nul
title ERP Constructora - Verificación de Requisitos
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
    conda --version
    echo [OK] Anaconda/Conda encontrado en PATH
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
    ) else if exist "D:\Miguel\Anaconda_AIEP\Library\bin\conda.exe" (
        set "CONDA_PATH=D:\Miguel\Anaconda_AIEP\Library\bin"
        set "CONDA_FOUND=1"
    ) else if exist "%USERPROFILE%\anaconda3\Scripts\conda.exe" (
        set "CONDA_PATH=%USERPROFILE%\anaconda3\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "%USERPROFILE%\anaconda3\conda.exe" (
        set "CONDA_PATH=%USERPROFILE%\anaconda3"
        set "CONDA_FOUND=1"
    ) else if exist "%USERPROFILE%\miniconda3\Scripts\conda.exe" (
        set "CONDA_PATH=%USERPROFILE%\miniconda3\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "C:\Users\%USERNAME%\anaconda3\Scripts\conda.exe" (
        set "CONDA_PATH=C:\Users\%USERNAME%\anaconda3\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "C:\Users\%USERNAME%\miniconda3\Scripts\conda.exe" (
        set "CONDA_PATH=C:\Users\%USERNAME%\miniconda3\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "D:\Anaconda3\Scripts\conda.exe" (
        set "CONDA_PATH=D:\Anaconda3\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "D:\Miniconda3\Scripts\conda.exe" (
        set "CONDA_PATH=D:\Miniconda3\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "C:\ProgramData\Anaconda3\Scripts\conda.exe" (
        set "CONDA_PATH=C:\ProgramData\Anaconda3\Scripts"
        set "CONDA_FOUND=1"
    ) else if exist "C:\ProgramData\Miniconda3\Scripts\conda.exe" (
        set "CONDA_PATH=C:\ProgramData\Miniconda3\Scripts"
        set "CONDA_FOUND=1"
    )
    
    if "!CONDA_FOUND!"=="1" (
        echo [OK] Anaconda encontrado en: !CONDA_PATH!
        "!CONDA_PATH!\conda.exe" --version
        echo [INFO] Para agregar Anaconda al PATH permanentemente:
        echo        Agrega esta ruta a las Variables de Entorno del sistema: !CONDA_PATH!
    ) else (
        REM Último intento: usar where para buscar
        for /f "delims=" %%i in ('where conda 2^>nul') do (
            set "CONDA_PATH=%%~dpi"
            set "CONDA_FOUND=1"
            echo [OK] Anaconda encontrado en: !CONDA_PATH!
            "%%i" --version
            goto :conda_found
        )
        
        :conda_found
        if "!CONDA_FOUND!"=="0" (
            echo [ERROR] Anaconda/Conda no encontrado
            echo.
            echo SOLUCIONES:
            echo 1. Instalar Anaconda desde: https://www.anaconda.com/products/distribution
            echo 2. O agregar Anaconda al PATH del sistema:
            echo    - Presiona Win + R, escribe: sysdm.cpl
            echo    - Ve a "Opciones avanzadas" ^> "Variables de entorno"
            echo    - En "Variables del sistema", busca "Path" ^> "Editar"
            echo    - Agrega la ruta donde está instalado Anaconda (ej: D:\Miguel\Anaconda_AIEP\Scripts)
            echo.
            set /a ERROR_COUNT+=1
        )
    )
)
echo.

REM ============================================================
REM 2. VERIFICAR PYTHON
REM ============================================================
echo [2/7] Verificando Python...
echo.

where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    python --version
    echo [OK] Python encontrado en PATH
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
        echo         Instalar desde: https://www.python.org/downloads/
        set /a ERROR_COUNT+=1
    )
)
echo.

REM ============================================================
REM 3. VERIFICAR DOCKER
REM ============================================================
echo [3/7] Verificando Docker...
echo.

where docker >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    docker --version
    echo [OK] Docker encontrado en PATH
    
    REM Verificar si Docker está corriendo
    docker info >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Docker está corriendo
    ) else (
        echo [ADVERTENCIA] Docker está instalado pero no está corriendo
        echo               Por favor, inicia Docker Desktop
        set /a WARNING_COUNT+=1
    )
) else (
    echo [ERROR] Docker no encontrado
    echo         Instalar Docker Desktop desde: https://www.docker.com/products/docker-desktop
    set /a ERROR_COUNT+=1
)
echo.

REM ============================================================
REM 4. VERIFICAR NODE.JS
REM ============================================================
echo [4/7] Verificando Node.js...
echo.

set "NODE_FOUND=0"
set "NODE_PATH="

where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "NODE_FOUND=1"
    node --version
    echo [OK] Node.js encontrado en PATH
) else (
    echo [BUSCANDO] Node.js no está en PATH, buscando...
    
    REM Buscar en ubicaciones comunes
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_PATH=C:\Program Files\nodejs"
        set "NODE_FOUND=1"
    ) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "NODE_PATH=C:\Program Files (x86)\nodejs"
        set "NODE_FOUND=1"
    ) else if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
        set "NODE_PATH=%LOCALAPPDATA%\Programs\nodejs"
        set "NODE_FOUND=1"
    ) else if exist "D:\Miguel\Anaconda_AIEP\node.exe" (
        set "NODE_PATH=D:\Miguel\Anaconda_AIEP"
        set "NODE_FOUND=1"
    ) else if exist "D:\Miguel\Anaconda_AIEP\Scripts\node.exe" (
        set "NODE_PATH=D:\Miguel\Anaconda_AIEP\Scripts"
        set "NODE_FOUND=1"
    )
    
    if "!NODE_FOUND!"=="1" (
        echo [OK] Node.js encontrado en: !NODE_PATH!
        "!NODE_PATH!\node.exe" --version
    ) else (
        echo [ERROR] Node.js no encontrado
        echo         Instalar desde: https://nodejs.org/
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
    if defined NODE_PATH (
        "!NODE_PATH!\npm.cmd" --version >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            "!NODE_PATH!\npm.cmd" --version
            echo [OK] npm encontrado
        ) else (
            echo [ADVERTENCIA] npm no encontrado (puede estar en otro PATH)
            set /a WARNING_COUNT+=1
        )
    ) else (
        npm --version >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            npm --version
            echo [OK] npm encontrado
        ) else (
            echo [ADVERTENCIA] npm no encontrado
            set /a WARNING_COUNT+=1
        )
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

cd /d "%~dp0"

if exist "backend\requirements.txt" (
    echo [OK] requirements.txt encontrado
    
    if exist "backend\run_server.py" (
        echo [OK] run_server.py encontrado
        
        REM Verificar si las dependencias están instaladas
        if defined CONDA_PATH (
            "!CONDA_PATH!\python.exe" -c "import fastapi" >nul 2>&1
        ) else (
            python -c "import fastapi" >nul 2>&1
        )
        
        if %ERRORLEVEL% EQU 0 (
            echo [OK] Dependencias Python básicas instaladas
        ) else (
            echo [ADVERTENCIA] Algunas dependencias pueden faltar
            echo               Ejecutar: pip install -r backend\requirements.txt
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
        echo [ADVERTENCIA] node_modules no encontrado
        echo               Ejecutar: cd app ^&^& npm install
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
        echo.
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
if defined NODE_PATH (
    echo [INFO] Node.js encontrado en: !NODE_PATH!
)

echo.
echo Presiona cualquier tecla para cerrar...
pause >nul

