import numpy as np
import pandas as pd

from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

def flip_sils(df):
  df = df.copy()
  xy_cols = [c for c in df.columns if c.startswith(("x", "y"))]
  x_cols = [c for c in df.columns if c.startswith("x")]
  y_cols = [c for c in df.columns if c.startswith("y")]
  nonxy_cols = [c for c in df.columns if not c.startswith(("x", "y"))]

  clusters = KMeans(n_clusters=2).fit_predict(df[xy_cols])
  cs, cnts = np.unique(clusters, return_counts=True)
  c_to_flip = int(np.argmin(cnts))

  df.loc[clusters==c_to_flip, x_cols] = (-1 * df.loc[clusters==c_to_flip, x_cols]).values[:,::-1]
  df.loc[clusters==c_to_flip, y_cols] = (df.loc[clusters==c_to_flip, y_cols]).values[:,::-1]

  def polar_angle(xy):
    x,y = xy
    return np.arctan2(y, x) + np.pi

  def shift_rotate(row):
    off = row["offset"]
    row[xy_cols] = np.roll(row[xy_cols].values, shift=-2*off, axis=0)
    return row

  points = df[xy_cols].values.reshape(-1, len(x_cols), 2)
  df["offset"] = np.argmin(np.apply_along_axis(polar_angle, axis=2, arr=points), axis=1)
  df = df.apply(shift_rotate, axis=1).drop(columns=["offset"])
  return df

def export_pcs_and_components(df, slug):
  xy_cols = [c for c in df.columns if c.startswith(("x", "y"))]
  nonxy_cols = [c for c in df.columns if not c.startswith(("x", "y"))]

  mpca = PCA(n_components=128).set_output(transform="pandas")

  pcs_df = mpca.fit_transform(df[xy_cols]).round(6)
  components_df = pd.DataFrame(np.concatenate(([mpca.mean_], mpca.components_), axis=0), columns=xy_cols).round(6)

  pcs_df.to_csv(f"./sils_{slug}_pca_pcs.csv", index=False)
  components_df.to_csv(f"./sils_{slug}_pca_components.csv", index=False)


URL = "https://github.com/PSAM-5020-2025F-A/5020-utils/raw/refs/heads/main/datasets/image/rev-sils/rev-sils-centered.csv"

if __name__ == "__main__":
  sils_df = pd.read_csv(URL)
  export_pcs_and_components(sils_df, "LR")
  export_pcs_and_components(flip_sils(sils_df), "RR")
