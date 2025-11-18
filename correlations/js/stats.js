function sum(vals) {
  return vals.reduce((acc, v) => acc += v, 0);
}

function mean(vals) {
  return sum(vals) / vals.length;
}

function std(vals) {
  const mu = mean(vals);
  const variance = mean(vals.map(v => (v - mu) ** 2));
  return variance ** 0.5;
}

function scaleMinMax(vals) {
  const vmin = Math.min(...vals);
  const vmax = Math.max(...vals);
  return vals.map(v => (v - vmin) / (vmax - vmin));
}

function scaleStandard(vals) {
  const mu = mean(vals);
  const sig = std(vals);
  return vals.map(v => (v - mu) / sig);
}

function sumDevs(A, B) {
  const muA = mean(A);
  const muB = mean(B);
  const devA = A.map(v => (v - muA));
  const devB = B.map(v => (v - muB));
  return sum(devA.map((v, i) => v * devB[i]));
}

function cov(A, B) {
  return sumDevs(A, B) / (A.length - 1);
}

function lobf(X, Y) {
  const muX = mean(X);
  const muY = mean(Y);

  const m = sumDevs(X, Y) / sumDevs(X, X);
  const b = muY - m * muX;

  return { m, b }
}
