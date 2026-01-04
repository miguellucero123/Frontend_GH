# START_ERP.ps1
param(
    [switch]$KillExisting
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Iniciando ERP Constructora" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Función para matar procesos en puertos específicos
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $connections = netstat -ano | findstr ":$Port "
    if ($connections) {
        Write-Host "Deteniendo procesos en puerto $Port..." -ForegroundColor Yellow
        $connections | ForEach-Object {
            if ($_ -match '\s+(\d+)\s*$') {
                $pid = $matches[1]
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "  Proceso $pid detenido" -ForegroundColor Gray
                } catch {
                    Write-Host "  No se pudo detener proceso $pid" -ForegroundColor Red
                }
            }
        }
        Start-Sleep -Seconds 2
    }
}

# Limpiar puertos si se solicita
if ($KillExisting) {
    Write-Host "`nLimpiando puertos ocupados..." -ForegroundColor Yellow
    Stop-ProcessOnPort 8002
    Stop-ProcessOnPort 5173
}

# Verificar Node.js
Write-Host "`nVerificando Node.js..." -ForegroundColor Cyan
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "  Node.js no encontrado en PATH. Intentando localización..." -ForegroundColor Yellow
    $env:Path += ";D:\Miguel\Anaconda_AIEP"
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCmd) {
        Write-Host "  Node.js encontrado: $($nodeCmd.Source)" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Node.js no encontrado. Instala Node.js o verifica la ruta." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  Node.js OK: $(node --version)" -ForegroundColor Green
    Write-Host "  NPM OK: $(npm --version)" -ForegroundColor Green
}

# Iniciar Backend
Write-Host "`nIniciando Backend..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backendPath'; Write-Host 'Backend iniciando...' -ForegroundColor Green; python -m uvicorn main:app --port 8002 --host 127.0.0.1 --reload"
)

Write-Host "  Backend iniciado en ventana separada" -ForegroundColor Green
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "`nIniciando Frontend..." -ForegroundColor Cyan
$frontendPath = Join-Path $PSScriptRoot "app"
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$frontendPath'; Write-Host 'Frontend iniciando...' -ForegroundColor Green; npm run dev"
)

Write-Host "  Frontend iniciado en ventana separada" -ForegroundColor Green

# Resumen
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "    Servicios Iniciados" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend:  http://127.0.0.1:8002" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Admin:    admin@constructora.com / admin123" -ForegroundColor Yellow
Write-Host "`n  Presiona Ctrl+C en cada ventana para detener" -ForegroundColor Gray
Write-Host "========================================`n" -ForegroundColor Cyan

# Esperar y abrir navegador
Start-Sleep -Seconds 5
Write-Host "Abriendo navegador..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"