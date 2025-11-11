import numpy as np
import pandas as pd

from sklearn.decomposition import PCA

if __name__ == "__main__":
  SILS_URL = "https://github.com/PSAM-5020-2025F-A/5020-utils/raw/refs/heads/main/datasets/image/rev-sils/rev-sils-centered.csv"
  sils_df = pd.read_csv(SILS_URL)

  xy_cols = [c for c in sils_df.columns if c.startswith(("x", "y"))]
  nonxy_cols = [c for c in sils_df.columns if not c.startswith(("x", "y"))]

  mpca = PCA(n_components=128).set_output(transform="pandas")

  sils_pcs_df = mpca.fit_transform(sils_df[xy_cols]).round(6)
  sils_components_df = pd.DataFrame(np.concatenate(([mpca.mean_], mpca.components_), axis=0), columns=xy_cols).round(6)

  sils_pcs_df.to_csv(f"./sils_pca_pcs.csv", index=False)
  sils_components_df.to_csv(f"./sils_pca_components.csv", index=False)
