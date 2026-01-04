@echo off
chcp 65001 >nul
title Ejecutar ERP Constructora - Formato Innovador
color 0B

echo.
echo ============================================================
echo     EJECUTANDO ERP CONSTRUCTORA
echo     Formato Innovador Restaurado
echo ============================================================
echo.
echo [INFO] Opciones disponibles:
echo     1. Servidor Vite (Puerto 5174) - Recomendado
echo     2. Servidor HTTP (Puerto 8080) - Alternativa
echo.
echo [INFO] Iniciando servidor Vite en puerto 5174...
echo.

cd /d %~dp0

:: Verificar Node.js en PATH
where node >nul 2>&1
if errorlevel 1 (
    :: Intentar rutas comunes de Node.js
    if exist "C:\Program Files\nodejs\node.exe" (
        set PATH=%PATH%;C:\Program Files\nodejs
        echo [INFO] Node.js encontrado en ruta común
    ) else if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
        set PATH=%PATH%;%LOCALAPPDATA%\Programs\nodejs
        echo [INFO] Node.js encontrado en AppData
    ) else (
        echo [ADVERTENCIA] Node.js no encontrado en PATH
        echo [INFO] Vite requiere Node.js, usando servidor HTTP alternativo en puerto 5174...
        goto :http_server_5174
    )
)

echo [OK] Node.js encontrado
echo [INFO] Verificando dependencias en carpeta app...
cd app

:: Verificar si node_modules existe
if not exist node_modules (
    echo [INFO] Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Error al instalar dependencias
        echo [INFO] Intentando con servidor HTTP alternativo...
        cd ..
        goto :http_server
    )
)

echo [OK] Dependencias listas
echo [INFO] Iniciando servidor Vite en puerto 5174...
echo.
echo     URL: http://localhost:5174
echo.
echo     Credenciales de Prueba:
echo     - Admin: admin@constructora.com / admin123
echo     - Trabajador: trabajador@constructora.com / trabajador123
echo     - Cliente: cliente@constructora.com / cliente123
echo.
echo     Presiona CTRL+C para detener
echo.
echo [INFO] Abriendo navegador...
timeout /t 3 /nobreak >nul
start http://localhost:5174
echo.
npm run dev
goto :end

:http_server_5174
cd /d %~dp0
echo.
echo [INFO] Usando servidor HTTP alternativo en puerto 5174...
where python >nul 2>&1
if not errorlevel 1 (
    echo [OK] Python encontrado
    echo [INFO] Iniciando servidor en puerto 5174...
    echo.
    echo     URL: http://localhost:5174
    echo.
    echo     NOTA: Este es un servidor HTTP simple, no Vite.
    echo     Para usar Vite con todas sus funciones, instala Node.js.
    echo.
    echo     Credenciales de Prueba:
    echo     - Admin: admin@constructora.com / admin123
    echo     - Trabajador: trabajador@constructora.com / trabajador123
    echo     - Cliente: cliente@constructora.com / cliente123
    echo.
    echo     Presiona CTRL+C para detener
    echo.
    echo [INFO] Abriendo navegador...
    timeout /t 2 /nobreak >nul
    start http://localhost:5174
    echo.
    python -m http.server 5174
    goto :end
)

:http_server_8080
cd /d %~dp0
echo.
echo [INFO] Usando servidor HTTP alternativo en puerto 8080...
where python >nul 2>&1
if not errorlevel 1 (
    echo [OK] Python encontrado
    echo [INFO] Iniciando servidor en puerto 8080...
    echo.
    echo     URL: http://localhost:8080
    echo.
    echo     Credenciales de Prueba:
    echo     - Admin: admin@constructora.com / admin123
    echo     - Trabajador: trabajador@constructora.com / trabajador123
    echo     - Cliente: cliente@constructora.com / cliente123
    echo.
    echo     Presiona CTRL+C para detener
    echo.
    echo [INFO] Abriendo navegador...
    timeout /t 2 /nobreak >nul
    start http://localhost:8080
    echo.
    python -m http.server 8080
    goto :end
)

:: Si no hay ni Node.js ni Python
echo [ERROR] Node.js y Python no encontrados
echo.
echo Opciones:
echo 1. Instalar Node.js desde: https://nodejs.org/ (Recomendado para Vite)
echo 2. Instalar Python desde: https://www.python.org/ (Alternativa)
echo 3. Abrir index.html directamente en el navegador
echo.
echo [INFO] Intentando abrir index.html directamente...
if exist index.html (
    start index.html
    echo [OK] Abierto en el navegador
    echo [ADVERTENCIA] Algunas funcionalidades pueden no funcionar sin servidor
) else (
    echo [ERROR] No se encontró index.html
)
echo.
pause
goto :end

:end

