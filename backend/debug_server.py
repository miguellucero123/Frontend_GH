import uvicorn
import sys
import os

if __name__ == "__main__":
    try:
        print("Starting server...")
        uvicorn.run("main:app", host="127.0.0.1", port=8002, log_level="debug")
    except Exception as e:
        print(f"FAILED TO START SERVER: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
