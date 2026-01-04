# run_server.py
import sys
import uvicorn

if __name__ == "__main__":
    print("Starting server on port 8002...")
    print("Backend API: http://localhost:8002")
    print("API Docs: http://localhost:8002/docs")
    print("Press CTRL+C to stop")
    print("-" * 50)
    
    # Usar cadena de importación para que reload funcione
    uvicorn.run(
        "main:app",  # Cadena de importación (requerido para reload)
        host="0.0.0.0",  # Permite acceso desde red local
        port=8002,
        reload=True,  # Auto-reload en desarrollo
        log_level="info"
    )

