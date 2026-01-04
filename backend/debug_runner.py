import subprocess
import os

def run():
    print("Iniciando prueba de servidor...")
    with open("server_test_out.txt", "w") as f:
        process = subprocess.Popen(["python", "run_server.py"], stdout=f, stderr=f)
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            print("Servidor sigue corriendo (timeout 10s alcanzado)")
            process.terminate()
    
    if os.path.exists("server_test_out.txt"):
        with open("server_test_out.txt", "r") as f:
            print("--- LOG DEL SERVIDOR ---")
            print(f.read())
            print("-------------------------")

if __name__ == "__main__":
    run()
