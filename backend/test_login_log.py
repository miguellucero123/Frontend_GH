import requests
import sys

with open("login_result.txt", "w") as f:
    def log(msg):
        f.write(str(msg) + "\n")
        print(msg)

    URL = "http://localhost:8000/token"
    CREDENTIALS = {
        "username": "admin@constructora.com",
        "password": "admin123"
    }

    try:
        log(f"Testing connection to {URL}...")
        response = requests.post(URL, data=CREDENTIALS, timeout=5)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text}")
        
        if response.status_code == 200:
            log("LOGIN SUCCESS!")
        else:
            log("LOGIN FAILED")
    except Exception as e:
        log(f"CONNECTION ERROR: {e}")
