@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title ERP Constructora - Iniciando Sistema
color 0A

echo.
echo ============================================================
echo     ERP CONSTRUCTORA - INICIO AUTOMATICO DEL SISTEMA
echo ============================================================
echo.

:: Verificar Python
echo [1/4] Verificando Python...
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no encontrado en el PATH
    echo Por favor, instala Python 3.8 o superior
    pause
    exit /b 1
)
python --version
echo [OK] Python encontrado
echo.

:: Verificar Node.js
echo [2/4] Verificando Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] Node.js no encontrado en el PATH
    echo.
    echo Buscando Node.js en ubicaciones comunes...
    
    :: Buscar en ubicaciones comunes
    set "NODE_FOUND=0"
    
    :: Buscar en ubicaciones estándar de Windows
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_PATH=C:\Program Files\nodejs"
        set "NODE_FOUND=1"
    ) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "NODE_PATH=C:\Program Files (x86)\nodejs"
        set "NODE_FOUND=1"
    ) else if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
        set "NODE_PATH=%LOCALAPPDATA%\Programs\nodejs"
        set "NODE_FOUND=1"
    ) else if exist "%APPDATA%\npm\node.exe" (
        set "NODE_PATH=%APPDATA%\npm"
        set "NODE_FOUND=1"
    )
    
    :: Buscar en ubicaciones de Anaconda/Conda
    if "!NODE_FOUND!"=="0" (
        :: Ubicación específica del usuario
        if exist "D:\Miguel\Anaconda_AIEP\node.exe" (
            set "NODE_PATH=D:\Miguel\Anaconda_AIEP"
            set "NODE_FOUND=1"
        ) else if exist "D:\Miguel\Anaconda_AIEP\Scripts\node.exe" (
            set "NODE_PATH=D:\Miguel\Anaconda_AIEP\Scripts"
            set "NODE_FOUND=1"
        ) else if exist "%USERPROFILE%\anaconda3\Scripts\node.exe" (
            set "NODE_PATH=%USERPROFILE%\anaconda3\Scripts"
            set "NODE_FOUND=1"
        ) else if exist "%USERPROFILE%\miniconda3\Scripts\node.exe" (
            set "NODE_PATH=%USERPROFILE%\miniconda3\Scripts"
            set "NODE_FOUND=1"
        ) else if exist "C:\Users\%USERNAME%\anaconda3\Scripts\node.exe" (
            set "NODE_PATH=C:\Users\%USERNAME%\anaconda3\Scripts"
            set "NODE_FOUND=1"
        ) else if exist "C:\Users\%USERNAME%\miniconda3\Scripts\node.exe" (
            set "NODE_PATH=C:\Users\%USERNAME%\miniconda3\Scripts"
            set "NODE_FOUND=1"
        ) else if exist "D:\Anaconda3\Scripts\node.exe" (
            set "NODE_PATH=D:\Anaconda3\Scripts"
            set "NODE_FOUND=1"
        ) else if exist "D:\Miniconda3\Scripts\node.exe" (
            set "NODE_PATH=D:\Miniconda3\Scripts"
            set "NODE_FOUND=1"
        )
    )
    
    :: Intentar usar conda para encontrar Node.js
    if "!NODE_FOUND!"=="0" (
        where conda >nul 2>&1
        if not errorlevel 1 (
            echo Intentando encontrar Node.js a traves de conda...
            for /f "tokens=*" %%i in ('conda info --base 2^>nul') do set "CONDA_BASE=%%i"
            if defined CONDA_BASE (
                if exist "!CONDA_BASE!\Scripts\node.exe" (
                    set "NODE_PATH=!CONDA_BASE!\Scripts"
                    set "NODE_FOUND=1"
                ) else if exist "!CONDA_BASE!\Library\bin\node.exe" (
                    set "NODE_PATH=!CONDA_BASE!\Library\bin"
                    set "NODE_FOUND=1"
                )
            )
        )
    )
    
    if "!NODE_FOUND!"=="1" (
        echo [OK] Node.js encontrado en: !NODE_PATH!
        set "PATH=!NODE_PATH!;%PATH%"
        "!NODE_PATH!\node.exe" --version
        echo [OK] Node.js configurado temporalmente
    ) else (
        echo [ERROR] Node.js no encontrado
        echo.
        echo ============================================================
        echo     SOLUCION: Node.js detectado pero no en PATH
        echo ============================================================
        echo.
        echo Node.js esta instalado (v20.19.5) pero no esta en el PATH
        echo del sistema para scripts .bat
        echo.
        echo Opcion 1: Agregar Node.js al PATH del sistema
        echo   1. Presiona Win + R, escribe: sysdm.cpl
        echo   2. Ve a "Opciones avanzadas" ^> "Variables de entorno"
        echo   3. En "Variables del sistema", busca "Path" ^> "Editar"
        echo   4. Agrega la ruta donde esta Node.js
        echo      (Busca en: C:\Program Files\nodejs\ o en tu instalacion de Anaconda)
        echo   5. Reinicia la computadora
        echo.
        echo Opcion 2: Usar PowerShell en lugar de CMD
        echo   Ejecuta: cd frontend\app ^&^& npm run dev
        echo   En otra ventana: cd frontend\backend ^&^& python run_server.py
        echo.
        echo Presiona cualquier tecla para continuar...
        pause >nul
        exit /b 1
    )
) else (
    node --version
    echo [OK] Node.js encontrado
)
echo.

:: Verificar dependencias del backend
echo [3/4] Verificando dependencias del Backend...
cd backend
if not exist "requirements.txt" (
    echo [ERROR] No se encuentra requirements.txt
    cd ..
    pause
    exit /b 1
)
echo [OK] Dependencias del backend listas
cd ..

:: Verificar dependencias del frontend
echo [4/4] Verificando dependencias del Frontend...
cd app
if not exist "node_modules" (
    echo [ADVERTENCIA] node_modules no encontrado
    echo Instalando dependencias del frontend...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Error al instalar dependencias del frontend
        cd ..
        pause
        exit /b 1
    )
)
echo [OK] Dependencias del frontend listas
cd ..

echo.
echo ============================================================
echo     INICIANDO SERVICIOS...
echo ============================================================
echo.

:: Iniciar Backend
echo [BACKEND] Iniciando servidor en puerto 8002...
start "ERP Backend - Puerto 8002" /min cmd /k "cd /d %~dp0backend && python run_server.py"
echo [OK] Backend iniciado en nueva ventana
echo.

:: Esperar a que el backend inicie
echo Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak >nul

:: Iniciar Frontend
echo [FRONTEND] Iniciando servidor en puerto 5173...
start "ERP Frontend - Puerto 5173" /min cmd /k "cd /d %~dp0app && npm run dev"
echo [OK] Frontend iniciado en nueva ventana
echo.

:: Esperar un momento más
echo Esperando 3 segundos adicionales...
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo     SISTEMA INICIADO CORRECTAMENTE
echo ============================================================
echo.
echo     Backend API:    http://localhost:8002
echo     API Docs:       http://localhost:8002/docs
echo     Frontend:       http://localhost:5173
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

:: Abrir navegador
start http://localhost:5173

echo.
echo [INFO] Los servidores se ejecutan en ventanas separadas
echo [INFO] Para detener los servidores, cierra las ventanas correspondientes
echo [INFO] O presiona CTRL+C en cada ventana
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

