import numpy as np
import pandas as pd

from sklearn.decomposition import PCA

def export_pcs_and_components(url, slug):
  fonts_ordered_df = pd.read_csv(url)

  xy_cols = [c for c in fonts_ordered_df.columns if c.startswith(("x", "y"))]
  nonxy_cols = [c for c in fonts_ordered_df.columns if not c.startswith(("x", "y"))]
  char_list = np.sort(fonts_ordered_df["char"].unique()).tolist()
  nrows = len(fonts_ordered_df)
  nfonts = nrows//len(char_list)
  npoints = len(xy_cols)//2

  mpca = PCA(n_components=640).set_output(transform="pandas")

  fonts_pca_df = mpca.fit_transform(fonts_ordered_df.drop(columns=nonxy_cols)).round(6)
  fonts_pca_df = pd.concat((fonts_ordered_df[nonxy_cols], fonts_pca_df), axis=1)

  fonts_components_df = pd.DataFrame(np.concatenate(([mpca.mean_], mpca.components_), axis=0), columns=xy_cols).round(6)

  fonts_pca_df.to_csv(f"./fonts_{npoints}_{slug}_pca_pcs.csv", index=False)
  fonts_components_df.to_csv(f"./fonts_{npoints}_{slug}_pca_components.csv", index=False)


URL = "https://psam-5020-2025f-a.github.io/5020-utils/datasets/csv/fonts_480_VARIANT.csv"

if __name__ == "__main__":
  for slug in ["polar", "distance"]:
    export_pcs_and_components(URL.replace("VARIANT", slug), slug)
