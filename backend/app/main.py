from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time

from app.config import get_settings
from app.database import engine, Base
from app.api import auth, projects, files, chat

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

settings = get_settings()

# Lifespan context manager (reemplaza startup/shutdown events)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Iniciando aplicación ERP Construcción")
    logger.info(f"Modo DEBUG: {settings.DEBUG}")
    
    # Crear tablas si no existen (solo desarrollo)
    if settings.DEBUG:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Base de datos inicializada")
    
    yield
    
    # Shutdown
    logger.info("👋 Cerrando aplicación")

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None,  # Ocultar docs en producción
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# MIDDLEWARE

# 1. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# 2. Compresión GZIP
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 3. Middleware de logging de requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} "
        f"- Status: {response.status_code} "
        f"- Time: {process_time:.2f}s"
    )
    
    response.headers["X-Process-Time"] = str(process_time)
    return response

# 4. Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error no manejado: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Error interno del servidor",
            "error": str(exc) if settings.DEBUG else "Internal server error"
        }
    )

# RUTAS

@app.get("/")
async def root():
    return {
        "message": "ERP Construcción API",
        "version": settings.VERSION,
        "docs": "/docs" if settings.DEBUG else "disabled"
    }

@app.get("/health")
async def health_check():
    """Endpoint para verificar estado del servidor"""
    return {
        "status": "healthy",
        "timestamp": time.time()
    }

# Incluir routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(projects.router, prefix=settings.API_V1_PREFIX)
app.include_router(files.router, prefix=settings.API_V1_PREFIX)
app.include_router(chat.router, prefix=settings.API_V1_PREFIX)

# Comando para ejecutar: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

