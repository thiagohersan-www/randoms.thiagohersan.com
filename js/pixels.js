class Pixels extends Dice {
  constructor(data, minVal=5, maxVal=247) {
    super(1, maxVal - minVal + 1);
    this.rolls = 0;
    this.minVal = minVal;
    this.maxVal = maxVal;
    this.data = data;
    this.firstIdx = Math.floor(this.data.length * Math.random());
  }

  reset() {
    super.reset();
    this.firstIdx = Math.floor(this.data.length * Math.random());
  }

  roll(nrolls = 1) {
    if (nrolls < 0) {
      this.reset();
      return this;
    }

    for (let n = 0; n < nrolls; n++) {
      const dataIdx = (this.firstIdx + this.rolls) % this.data.length;
      const newVals = this.data[dataIdx].slice(this.minVal, this.maxVal);
      for (let k = 0; k < newVals.length; k++) {
        this.counts[k] += newVals[k];
      }
      this.rolls += 1;
    }

    return this;
  }
}

const PIXELS_URL = "https://raw.githubusercontent.com/thiagohersan-www/random-book/refs/heads/release/pix_vals.json";

async function fetchData(mUrl) {
  const response = await fetch(mUrl);
  return response.json();
}

window.addEventListener("load", async () => {
  const pixelData = await fetchData(PIXELS_URL);
  const cloudData = pixelData["clouds"];

  const pixelRolls = Array.from(document.getElementsByClassName("pixel-roll"));
  const pixelChanges = Array.from(document.getElementsByClassName("pixel-change"));
  const resetPixels = Array.from(document.querySelectorAll(".pixel-roll[data-rolls='-1']"));

  const MY_PIXELS = [
    [0].map(x => new Pixels(cloudData[x])),
    [0,1,2].map(x => new Pixels(cloudData[x])),
  ];

  pixelRolls.forEach((el) => el.addEventListener("click", (evt) => {
    const el = evt.target;
    const sectionEl = el.closest("section");
    const graphEls = sectionEl.querySelectorAll(".graph-pixels");
    const idx = parseInt(sectionEl.dataset.pixelSectionIdx);
    const rolls = parseInt(el.dataset.rolls);

    MY_PIXELS[idx].forEach((p,i) => p.roll(rolls).draw(graphEls[i]));
  }));

  pixelChanges.forEach((el) => el.addEventListener("click", (evt) => {
    const el = evt.target;
    const sectionEl = el.closest("section");
    const graphEls = sectionEl.querySelectorAll(".graph-pixels");
    const idx = parseInt(sectionEl.dataset.pixelSectionIdx);
    const source = el.dataset.source;
    const rolls = MY_PIXELS[idx][0].rolls;

    MY_PIXELS[idx].forEach((p, i) => {
      p.data = pixelData[source][i];
      p.reset();
      p.roll(rolls).draw(graphEls[i])
    });
  }));

  resetPixels.forEach((el) => el.click());
});
