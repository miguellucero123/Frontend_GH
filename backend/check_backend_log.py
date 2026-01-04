import sys
import os
import traceback

with open("check_result.txt", "w") as f:
    try:
        f.write("Attempting to import main...\n")
        import main
        f.write("Import successful\n")
    except Exception as e:
        f.write("Import failed:\n")
        traceback.print_exc(file=f)
