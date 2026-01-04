import websockets
import os
with open("ws_path_check.txt", "w") as f:
    f.write(f"Websockets file: {websockets.__file__}\n")
    f.write(f"Current dir: {os.getcwd()}\n")
    f.write(f"Dir contents: {os.listdir()}\n")
