import requests
import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import models
from database import SessionLocal

# 1. Verificar Usuario en DB Directamente
print("--- 1. Verificando Base de Datos ---")
try:
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == "admin@constructora.com").first()
    
    if user:
        print(f"✅ Usuario encontrado: {user.email}")
        print(f"   Role: {user.role}")
        print(f"   Status: {user.status}")
        print(f"   Active: {user.is_active}")
        print(f"   Hash de contraseña existe: {bool(user.hashed_password)}")
    else:
        print("❌ EL USUARIO NO EXISTE EN LA BASE DE DATOS.")
    db.close()
except Exception as e:
    print(f"❌ Error conectando a BD: {e}")


# 2. Probar Endpoint de Login
print("\n--- 2. Probando API Login (http://localhost:8000/api/auth/login) ---")
try:
    url = "http://localhost:8000/api/auth/login"
    payload = {
        "username": "admin@constructora.com",
        "password": "admin123"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    # Nota: requests.post con data=payload envía application/x-www-form-urlencoded por defecto
    response = requests.post(url, data=payload)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Login Exitoso via API")
        print(f"   Token recibido: {data.get('access_token')[:20]}...")
    else:
        print("❌ Fallo el Login via API")
        print(f"   Respuesta: {response.text}")

except Exception as e:
    print(f"❌ Error conectando a la API: {e}")
    print("   ¿Está el servidor corriendo en el puerto 8000?")
