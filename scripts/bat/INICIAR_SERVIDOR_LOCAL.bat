@echo off
chcp 65001 >nul
title ERP Constructora - Servidor Local
color 0B

echo.
echo ============================================================
echo     INICIANDO SERVIDOR LOCAL PARA FRONTEND
echo ============================================================
echo.

cd /d %~dp0

:: Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] Node.js no encontrado en el PATH
    echo.
    echo Buscando Node.js en ubicaciones comunes...
    
    :: Buscar en ubicaciones de Anaconda/Conda
    if exist "D:\Miguel\Anaconda_AIEP\node.exe" (
        set "NODE_PATH=D:\Miguel\Anaconda_AIEP"
        set "PATH=%NODE_PATH%;%PATH%"
        echo [OK] Node.js encontrado en: %NODE_PATH!
    ) else if exist "D:\Miguel\Anaconda_AIEP\Scripts\node.exe" (
        set "NODE_PATH=D:\Miguel\Anaconda_AIEP\Scripts"
        set "PATH=%NODE_PATH%;%PATH%"
        echo [OK] Node.js encontrado en: %NODE_PATH!
    ) else (
        echo [ERROR] Node.js no encontrado
        echo.
        echo Usando Python como alternativa...
        echo.
        python -m http.server 8080
        goto :end
    )
)

:: Verificar si existe node_modules
if not exist "node_modules" (
    echo [INFO] Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Error al instalar dependencias
        echo.
        echo Usando Python como alternativa...
        echo.
        python -m http.server 8080
        goto :end
    )
)

:: Iniciar servidor
echo.
echo ============================================================
echo     SERVIDOR INICIADO
echo ============================================================
echo.
echo     URL: http://localhost:8080
echo.
echo     Presiona CTRL+C para detener el servidor
echo.
echo ============================================================
echo.

:: Abrir navegador después de 2 segundos
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8080"

:: Iniciar servidor
npm start

:end
pause

