#!/bin/bash

echo "🚀 Iniciando ERP Construcción..."

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Por favor edita .env con tus configuraciones"
    exit 1
fi

# Levantar contenedores
echo "🐳 Levantando contenedores..."
docker-compose up -d

# Esperar a que la DB esté lista
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
docker-compose exec backend alembic upgrade head

# Sembrar datos de prueba
echo "🌱 Sembrando datos de prueba..."
docker-compose exec backend python -m scripts.seed_db

echo "✅ Sistema iniciado!"
echo ""
echo "📝 URLs:"
echo "   Backend API: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo "   Health: http://localhost:8000/health"
echo ""
echo "📝 Credenciales de prueba:"
echo "   Jefe: jefe@construccion.cl / Jefe123456"
echo "   Cliente 1: cliente1@gmail.com / Cliente123456"
echo "   Cliente 2: cliente2@gmail.com / Cliente123456"

