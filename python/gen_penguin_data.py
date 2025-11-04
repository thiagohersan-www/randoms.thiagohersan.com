import json
import pandas as pd
import urllib.request as request

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def object_from_json_url(url):
  with request.urlopen(url) as in_file:
    return json.load(in_file)


if __name__ == "__main__":
  PENGUIN_URL = "https://raw.githubusercontent.com/PSAM-5020-2025F-A/5020-utils/refs/heads/main/datasets/json/penguins.json"
  penguin_data = object_from_json_url(PENGUIN_URL)

  penguins_df = pd.DataFrame.from_records(penguin_data).drop(columns=["species"])

  scaler = StandardScaler().set_output(transform="pandas")
  pca = PCA(n_components=3)

  penguins_scaled_df = scaler.fit_transform(penguins_df)

  penguins_pca_df = pd.DataFrame(pca.fit_transform(penguins_scaled_df), columns=["x","y","z"]).round(6)

  penguins_pca_df.to_json("./penguins_3d.json", orient="records")
