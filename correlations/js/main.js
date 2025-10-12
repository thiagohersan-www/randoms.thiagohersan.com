const ANSUR_URL = "https://raw.githubusercontent.com/PSAM-5020-2025F-A/5020-utils/refs/heads/main/datasets/json/ansur-full-flat.json";

async function getFeatureData(url) {
  const result = await fetch(url);
  const jsonData = await result.json();

  const featureData = {};
  Object.keys(jsonData[0]).forEach(k => {
    featureData[k] = [];
  });

  jsonData.forEach(i => Object.keys(i).forEach(k => featureData[k].push(i[k])));
  delete featureData["gender"];

  return featureData;
}

function addOption(el, val, label) {
  const opt = document.createElement("option");
  opt.value = val;
  opt.innerHTML = label;
  el.appendChild(opt);
}

function setupFeatures(features) {
  const xSelEl = document.getElementById("x-select");
  const ySelEl = document.getElementById("y-select");

  xSelEl.addEventListener("change", updateGraph);
  ySelEl.addEventListener("change", updateGraph);

  addOption(xSelEl, "", "---");
  addOption(ySelEl, "", "---");

  features.forEach(feat => {
    [xSelEl, ySelEl].forEach(sEl => {
      addOption(sEl, feat, `${feat.replace(".", " ")}`);
    });
  });
}

function setupScalers() {
  const scaleSelEl = document.getElementById("scaler-select");
  scaleSelEl.addEventListener("change", updateGraph);
}

function setupLobf() {
  const lobfBut = document.getElementById("lobf-select");
  lobfBut.addEventListener("click", (evt) => {
    evt.target.classList.toggle("selected");
    updateGraph();
  });
}

let mGraph;
function setupGraph() {
  const graphEl = document.getElementById("graph");
  const w = graphEl.offsetWidth;
  const h = 0.8 * window.innerHeight;
  mGraph = new p5(scatterGraph(Math.min(w,h), Math.min(w,h)), "graph");
}

let myData;
document.addEventListener("DOMContentLoaded", async () => {
  myData = await getFeatureData(ANSUR_URL);

  setupFeatures(Object.keys(myData));
  setupScalers();
  setupLobf();
  setupGraph();
});

const scaleFunction = {
  "none": (x) => x,
  "minmax": scaleMinMax,
  "standard": scaleStandard,
};

function updateGraph() {
  const xSelEl = document.getElementById("x-select");
  const ySelEl = document.getElementById("y-select");
  const scaleSelEl = document.getElementById("scaler-select");
  const lobfBut = document.getElementById("lobf-select");

  const xStatsEl = document.getElementById("x-stats");
  const yStatsEl = document.getElementById("y-stats");
  const xyStatsEl = document.getElementById("xy-stats");


  const xVar = xSelEl.value;
  const yVar = ySelEl.value;
  const sVal = scaleSelEl.value;
  const lobdVal = lobfBut.classList.contains("selected");

  xStatsEl.innerHTML = "";
  yStatsEl.innerHTML = "";
  xyStatsEl.innerHTML = "";

  if (xVar === "" || yVar === "") return;

  const xData = scaleFunction[sVal](myData[xVar]);
  const yData = scaleFunction[sVal](myData[yVar]);

  xStatsEl.innerHTML = `
                        ${xVar}<br>
                        min: ${Math.min(...xData).toPrecision(4)}<br>
                        max: ${Math.max(...xData).toPrecision(4)}<br>
                        mean: ${mean(xData).toPrecision(4)}<br>
                        std: ${std(xData).toPrecision(4)}`;

  yStatsEl.innerHTML = `
                        ${yVar}<br>
                        min: ${Math.min(...yData).toPrecision(4)}<br>
                        max: ${Math.max(...yData).toPrecision(4)}<br>
                        mean: ${mean(yData).toPrecision(4)}<br>
                        std: ${std(yData).toPrecision(4)}`;

  xyStatsEl.innerHTML = `
                         X & Y<br>
                         cov: ${cov(xData, yData).toPrecision(4)}<br>
                         Y = ${lobf(xData, yData)["m"].toPrecision(4)} &middot; X + ${lobf(xData, yData)["b"].toPrecision(4)}`;

  mGraph.updateGraph(xData, yData, lobdVal);
}
