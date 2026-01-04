import subprocess
import sys
import os
import time

log_file = "debug_server_out.txt"
with open(log_file, "w") as f:
    f.write(f"Starting subprocess in {os.getcwd()}...\n")
    try:
        proc = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "main:app", "--port", "8002", "--host", "0.0.0.0"],
            stdout=f,
            stderr=subprocess.STDOUT,
            cwd=os.getcwd()
        )
        f.write(f"Process started with PID {proc.pid}\n")
        time.sleep(5)
        # Check if process is still running
        if proc.poll() is None:
            f.write("Process is STILL RUNNING.\n")
        else:
            f.write(f"Process EXITED with code {proc.returncode}\n")
    except Exception as e:
        f.write(f"EXCEPTION: {e}\n")

f.write("Done debugging.\n")
