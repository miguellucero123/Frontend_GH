@echo off
echo Iniciando Backend...
cd /d "%~dp0"
python -m uvicorn main:app --port 8002 --host 127.0.0.1 --reload
pause