import requests
import sys

URL = "http://localhost:8000/token"
CREDENTIALS = {
    "username": "admin@constructora.com",
    "password": "admin123"
}

try:
    print(f"Testing connection to {URL}...")
    response = requests.post(URL, data=CREDENTIALS, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("LOGIN SUCCESS!")
    else:
        print("LOGIN FAILED")
except Exception as e:
    print(f"CONNECTION ERROR: {e}")
