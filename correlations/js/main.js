async function loadJson() {
  const URL = "https://raw.githubusercontent.com/PSAM-5020-2025F-A/5020-utils/refs/heads/main/datasets/json/ansur-full-flat.json";

  const result = await fetch(URL);
  const jsonData = await result.json();

  const featureData = {};
  Object.keys(jsonData[0]).forEach(k => {
    featureData[k] = [];
  });

  jsonData.forEach(i => Object.keys(i).forEach(k => featureData[k].push(i[k])));

  return featureData;
}

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


let myData;
document.addEventListener("DOMContentLoaded", async () => {
  myData = await loadJson();

  // TODO: drop downs
  // TODO: no scale, minmax, std
  // TODO: LoBF
});
