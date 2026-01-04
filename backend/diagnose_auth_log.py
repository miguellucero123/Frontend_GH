import requests
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models
from database import SessionLocal

output = []

def log(msg):
    print(msg)
    output.append(str(msg))

# 1. Verificar Usuario en DB Directamente
log("--- 1. Verificando Base de Datos ---")
try:
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == "admin@constructora.com").first()
    
    if user:
        log(f"✅ Usuario encontrado: {user.email}")
        log(f"   Role: {user.role}")
        log(f"   Status: {user.status}")
        log(f"   Active: {user.is_active}")
        log(f"   Hash de contraseña existe: {bool(user.hashed_password)}")
    else:
        log("❌ EL USUARIO NO EXISTE EN LA BASE DE DATOS.")
    db.close()
except Exception as e:
    log(f"❌ Error conectando a BD: {e}")


# 2. Probar Endpoint de Login
log("\n--- 2. Probando API Login (http://localhost:8000/api/auth/login) ---")
try:
    url = "http://localhost:8000/api/auth/login"
    payload = {
        "username": "admin@constructora.com",
        "password": "admin123"
    }
    
    response = requests.post(url, data=payload)
    
    log(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        log("✅ Login Exitoso via API")
        if 'access_token' in data:
            log(f"   Token recibido: {data.get('access_token')[:20]}...")
        else:
            log("   ⚠️ No access_token in response")
    else:
        log("❌ Fallo el Login via API")
        log(f"   Respuesta: {response.text}")

except Exception as e:
    log(f"❌ Error conectando a la API: {e}")
    log("   ¿Está el servidor corriendo en el puerto 8000?")

with open("diagnose_result.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output))
