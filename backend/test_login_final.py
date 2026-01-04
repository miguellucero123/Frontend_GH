import requests
import json

url = "http://localhost:8002/api/auth/login"
data = {
    "username": "admin@constructora.com",
    "password": "admin123"
}

print(f"Testing login at {url}...")
try:
    response = requests.post(url, data=data, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    with open("login_test_final.txt", "w") as f:
        f.write(f"Status: {response.status_code}\n")
        f.write(f"Response: {response.text}\n")
except Exception as e:
    print(f"Error: {e}")
    with open("login_test_final.txt", "w") as f:
        f.write(f"Error: {e}\n")
