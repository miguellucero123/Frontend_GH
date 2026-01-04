import sys
import traceback

with open("debug_output.txt", "w", encoding="utf-8") as services_log:
    def log(msg):
        services_log.write(str(msg) + "\n")
        print(msg)

    try:
        log("--- DEBUG IMPORT START ---")
        log(f"Python path: {sys.path}")
        log("Importing main...")
        try:
             import main
             log("Main imported OK")
        except ImportError as ie:
             log(f"ImportError: {ie}")
             log(traceback.format_exc())
        except Exception as e:
             log(f"Exception: {e}")
             log(traceback.format_exc())

    except Exception as e:
        log(f"Fatal logging error: {e}")

    log("--- DEBUG IMPORT END ---")
