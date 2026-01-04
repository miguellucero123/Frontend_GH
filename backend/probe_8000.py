import requests
import sys

def probe(url):
    print(f"Probing {url}...")
    try:
        r = requests.get(url, timeout=5)
        print(f"Status: {r.status_code}")
        print(f"Server Header: {r.headers.get('Server')}")
        print(f"Body snippet: {r.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    probe("http://localhost:8000/")
    probe("http://localhost:8000/api/health")
