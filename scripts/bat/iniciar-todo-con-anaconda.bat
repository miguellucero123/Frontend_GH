@echo off
chcp 65001 >nul
title ERP Constructora - Iniciando Sistema (Anaconda + Docker)
color 0A

echo.
echo ============================================================
echo     ERP CONSTRUCTORA - INICIO CON ANACONDA Y DOCKER
echo ============================================================
echo.

REM Verificar Anaconda
echo [1/5] Verificando Anaconda...
where conda >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ADVERTENCIA] Anaconda no encontrado en el PATH
    echo Intentando encontrar Anaconda...
    
    set "CONDA_FOUND=0"
    
    REM Buscar en ubicaciones comunes
    if exist "D:\Miguel\Anaconda_AIEP\Scripts\conda.exe" (
        set "CONDA_PATH=D:\Miguel\Anaconda_AIEP\Scripts"
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
        set "PATH=!CONDA_PATH!;%PATH%"
    ) else (
        echo [ERROR] Anaconda no encontrado
        echo Por favor, instala Anaconda o agrega conda al PATH
        pause
        exit /b 1
    )
) else (
    echo [OK] Anaconda encontrado
)
conda --version
echo.

REM Verificar Docker
echo [2/5] Verificando Docker...
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no está instalado o no está en el PATH
    echo Por favor, instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no está corriendo
    echo Por favor, inicia Docker Desktop y vuelve a intentar
    pause
    exit /b 1
)
echo [OK] Docker está instalado y corriendo
docker --version
echo.

REM Verificar Node.js
echo [3/5] Verificando Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ADVERTENCIA] Node.js no encontrado en el PATH
    echo Buscando en ubicaciones comunes...
    
    set "NODE_FOUND=0"
    
    if exist "D:\Miguel\Anaconda_AIEP\node.exe" (
        set "NODE_PATH=D:\Miguel\Anaconda_AIEP"
        set "NODE_FOUND=1"
    ) else if exist "D:\Miguel\Anaconda_AIEP\Scripts\node.exe" (
        set "NODE_PATH=D:\Miguel\Anaconda_AIEP\Scripts"
        set "NODE_FOUND=1"
    )
    
    if "!NODE_FOUND!"=="1" (
        echo [OK] Node.js encontrado en: !NODE_PATH!
        set "PATH=!NODE_PATH!;%PATH%"
        "!NODE_PATH!\node.exe" --version
    ) else (
        echo [ERROR] Node.js no encontrado
        pause
        exit /b 1
    )
) else (
    node --version
    echo [OK] Node.js encontrado
)
echo.

REM Activar entorno Anaconda (si existe)
echo [4/5] Configurando entorno Anaconda...
if exist "environment.yml" (
    echo [INFO] Encontrado environment.yml
    echo [INFO] Si necesitas crear el entorno, ejecuta: conda env create -f environment.yml
) else (
    echo [INFO] No se encontró environment.yml, usando entorno base
)

REM Verificar si hay un entorno específico
set "CONDA_ENV_NAME=erp-constructora"
conda env list | findstr /C:"%CONDA_ENV_NAME%" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Activando entorno: %CONDA_ENV_NAME%
    call conda activate %CONDA_ENV_NAME%
) else (
    echo [INFO] Usando entorno base de Anaconda
)
echo.

REM Iniciar servicios
echo [5/5] Iniciando servicios...
echo.

REM Iniciar n8n con Docker
echo [N8N] Iniciando n8n con Docker...
cd /d "%~dp0"
if exist "docker-compose.n8n.yml" (
    docker-compose -f docker-compose.n8n.yml up -d >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] n8n iniciado en http://localhost:5678
    ) else (
        echo [ADVERTENCIA] n8n no pudo iniciarse
    )
) else (
    echo [INFO] docker-compose.n8n.yml no encontrado, omitiendo n8n
)
echo.

REM Iniciar Backend con Anaconda
echo [BACKEND] Iniciando servidor backend con Anaconda...
cd backend
if exist "run_server.py" (
    start "ERP Backend (Anaconda) - Puerto 8002" /min cmd /k "cd /d %~dp0backend && conda activate %CONDA_ENV_NAME% && python run_server.py"
    echo [OK] Backend iniciado en nueva ventana (puerto 8002)
) else (
    echo [ERROR] No se encontró run_server.py
)
cd ..
echo.

REM Esperar a que el backend inicie
echo Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak >nul

REM Iniciar Frontend
echo [FRONTEND] Iniciando servidor frontend...
cd app
if exist "package.json" (
    start "ERP Frontend - Puerto 5173" /min cmd /k "cd /d %~dp0app && npm run dev"
    echo [OK] Frontend iniciado en nueva ventana (puerto 5173)
) else (
    echo [ERROR] No se encontró package.json
)
cd ..
echo.

REM Esperar un momento más
echo Esperando 3 segundos adicionales...
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo     SISTEMA INICIADO CORRECTAMENTE
echo ============================================================
echo.
echo     Backend (Anaconda):  http://localhost:8002
echo     API Docs:            http://localhost:8002/docs
echo     Frontend:            http://localhost:5173
echo     n8n (Docker):        http://localhost:5678
echo.
echo     Credenciales de Prueba:
echo     - Admin:        admin@constructora.com / admin123
echo     - Trabajador:   trabajador@constructora.com / trabajador123
echo     - Cliente:      cliente@constructora.com / cliente123
echo.
echo ============================================================
echo.
echo Abriendo navegador en 2 segundos...
timeout /t 2 /nobreak >nul

REM Abrir navegador
start http://localhost:5173

echo.
echo [INFO] Los servidores se ejecutan en ventanas separadas
echo [INFO] Backend usa Anaconda, n8n usa Docker
echo [INFO] Para detener: cierra las ventanas o usa CTRL+C
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

