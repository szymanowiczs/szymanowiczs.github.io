import os
import json

files = [item for item in os.listdir("./") if item.endswith(".mp4")]
with open("./vids.json", 'w') as json_file:
    json.dump({"files": files}, json_file, indent=4)