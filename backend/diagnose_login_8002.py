import requests
import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import User

# Config
BASE_URL = "http://localhost:8002"
DB_URL = "sqlite:///./erp.db"

def log(msg):
    print(msg)
    with open("diagnosis_8002.txt", "a") as f:
        f.write(str(msg) + "\n")

# Limpiar log anterior
with open("diagnosis_8002.txt", "w") as f:
    f.write("--- DIAGNOSTICO INICIO ---\n")

# 1. Verificar Conectividad
try:
    log(f"Test 1: Conectando a {BASE_URL}...")
    r = requests.get(f"{BASE_URL}/docs", timeout=5)
    log(f"Server Status: {r.status_code}")
    if r.status_code == 200:
        log("✅ Servidor ONLINE en puerto 8002")
    else:
        log(f"⚠️ Servidor responde con error: {r.status_code}")
except Exception as e:
    log(f"❌ Servidor OFFLINE o inalcanzable: {e}")

# 2. Verificar Base de Datos y Usuario
try:
    log("\nTest 2: Verificando Base de Datos...")
    engine = create_engine(DB_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    user = db.query(User).filter(User.email == "admin@constructora.com").first()
    if user:
        log(f"✅ Usuario 'admin@constructora.com' ENCONTRADO (ID: {user.id})")
        log(f"   Rol: {user.rol}")
        log(f"   Estado: {user.estado}")
        log(f"   Hash Password: {user.password_hash[:10]}...")
    else:
        log("❌ Usuario 'admin@constructora.com' NO ENCONTRADO en la BD")
        
    db.close()
except Exception as e:
    log(f"❌ Error conectando a BD: {e}")

