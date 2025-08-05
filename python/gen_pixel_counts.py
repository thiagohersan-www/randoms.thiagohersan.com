import json
import numpy as np

from os import listdir
from PIL import Image as PImage


def count_channel_vals(path):
  img = PImage.open(path).resize((128, 128)).convert("RGB")
  img_np = np.array(img).reshape(-1, 3)

  img_counts = np.zeros((3, 256), dtype=np.uint32).tolist()

  for idx in range(3):
    vals, cnts = np.unique(img_np[:,idx], return_counts=True)
    for v,c in zip(vals, cnts):
      img_counts[idx][v] += int(c)

  return img_counts

if __name__ == "__main__":
  PIXCOUNTS = {}

  for d in ["clouds", "flowers", "metfaces"]:
    dpath = f"./data/image/{d}"
    fnames = sorted([f for f in listdir(dpath) if f.endswith(("jpg", "png"))])
    PIXCOUNTS[d] = np.array([count_channel_vals(f"{dpath}/{f}") for f in fnames]).transpose(1,0,2).tolist()


  with open("pix_vals.json", "w") as f:
    json.dump(PIXCOUNTS, f)
