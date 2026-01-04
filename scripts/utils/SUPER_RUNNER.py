import subprocess
import time
import os
import sys

def kill_processes():
    print("Limpiando procesos previos...")
    subprocess.run(["taskkill", "/F", "/IM", "node.exe", "/T"], capture_output=True)
    subprocess.run(["taskkill", "/F", "/IM", "python.exe", "/T"], capture_output=True)
    subprocess.run(["taskkill", "/F", "/IM", "uvicorn.exe", "/T"], capture_output=True)
    time.sleep(2)

def run_backend():
    print("Iniciando Backend en puerto 8001...")
    # Usar el directorio absoluto
    backend_dir = os.path.join(os.getcwd(), "backend")
    # Ejecutar uvicorn directamente como modulo para evitar problemas con run_server.py
    subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"], cwd=backend_dir)

def run_frontend():
    print("Iniciando Frontend en puerto 5173...")
    app_dir = os.path.join(os.getcwd(), "app")
    # Ejecutar vite directamente si es posible, o npm run dev
    subprocess.Popen(["cmd", "/c", "npm run dev"], cwd=app_dir)

if __name__ == "__main__":
    kill_processes()
    run_backend()
    time.sleep(5)
    run_frontend()
    print("PROCESOS LANZADOS.")
    # Mantener el script vivo por un momento
    time.sleep(10)
