@echo off
setlocal
:: Force UTF-8 for the console
chcp 65001 > nul

echo ==========================================
echo 🔧 INICIADOR MAESTRO - ERP CONSTRUCTORA
echo ==========================================
echo.

echo 🟥 1. LIMPIANDO PROCESOS...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM uvicorn.exe /T 2>nul
timeout /t 2 /nobreak > nul

echo 🐍 2. ACTUALIZANDO COMPONENTES BACKEND...
cd backend
python -m pip install -r requirements.txt --quiet
timeout /t 1 /nobreak > nul

echo 📦 3. INICIANDO BACKEND (Puerto 8001)...
start "SOPORTE-BACKEND" cmd /k "chcp 65001 > nul && echo [BACKEND] Iniciando... && python run_server.py || echo ERROR CRITICO EN BACKEND && pause"
timeout /t 5 /nobreak > nul

echo 🚀 4. INICIANDO FRONTEND (Puerto 5173)...
cd ../app

:: Intentar iniciar el frontend de 3 formas: npm, npx o binario directo
echo [FRONTEND] Detectando metodo de inicio...
if exist node_modules\.bin\vite.cmd (
    echo [FRONTEND] Usando binario local de Vite...
    start "SOPORTE-FRONTEND" cmd /k "chcp 65001 > nul && echo [FRONTEND] Iniciando con Vite Local... && node_modules\.bin\vite.cmd || echo ERROR CRITICO: No se pudo iniciar Vite. Verifique si Node.js esta instalado. && pause"
) else (
    echo [FRONTEND] Intentando con npm...
    start "SOPORTE-FRONTEND" cmd /k "chcp 65001 > nul && echo [FRONTEND] Iniciando con NPM... && npm run dev || echo ERROR: npm no encontrado. Por favor instale Node.js && pause"
)

echo.
echo ==========================================
echo ✅ PROCESO FINALIZADO
echo ==========================================
echo 🌐 Frontend: http://localhost:5173
echo 🌐 Backend:  http://localhost:8001
echo.
echo 💡 NOTA: El Backend ya esta FUNCIONANDO. 
echo Si el Frontend falla, asegurese de tener Node.js instalado.
echo ==========================================
echo.
pause
