import sys
import traceback

try:
    print("Tentative import of main...")
    import main
    print("Import successful. Starting uvicorn...")
    import uvicorn
    uvicorn.run(main.app, host="0.0.0.0", port=8001)
except Exception as e:
    print("CRITICAL ERROR DURING STARTUP:")
    traceback.print_exc()
    with open("crash_report.txt", "w") as f:
        traceback.print_exc(file=f)
