try:
    print("--- DEBUG IMPORT START ---")
    import sys
    print(f"Python path: {sys.path}")
    print("Importing main...")
    import main
    print("Main imported OK")
except Exception as e:
    import traceback
    print("ERROR IMPORTING MAIN:")
    traceback.print_exc()

print("--- DEBUG IMPORT END ---")
